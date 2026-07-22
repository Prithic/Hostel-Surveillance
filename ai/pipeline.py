"""End-to-end GuardianAI frame pipeline (modular wiring only)."""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Sequence

from ai.alerts import AlertEngine
from ai.bytetrack import ByteTrackTracker
from ai.config import AIConfig
from ai.incidents import IncidentEngine, StoredIncident
from ai.opencv_stream import OpenCVVideoStream
from ai.polygon_zones import PolygonZoneManager
from ai.rule_engine import SimpleRuleEngine, default_rules
from ai.rules import RuleContext
from ai.tracker import Track
from ai.video_stream import Frame
from ai.zone import Point, Zone, ZoneManager


def _default_zones() -> ZoneManager:
    """Demo restricted rectangle (top-right quadrant @ 640x480)."""
    return PolygonZoneManager(
        [
            Zone(
                zone_id="restricted_a",
                name="Restricted Area A",
                polygon=(
                    Point(360, 40),
                    Point(620, 40),
                    Point(620, 280),
                    Point(360, 280),
                ),
                restricted=True,
            )
        ]
    )


@dataclass
class PipelineStatus:
    camera_id: str
    online: bool = False
    fps: float = 0.0
    person_count: int = 0
    frame_index: int = 0
    last_error: str = ""


@dataclass
class FrameResult:
    frame: Frame
    tracks: Sequence[Track]
    incidents: list[StoredIncident]
    fps: float


@dataclass
class GuardianPipeline:
    """VideoStream → ByteTrack → Zones → Rules → Incidents → Alerts."""

    config: AIConfig
    zones: ZoneManager = field(default_factory=_default_zones)
    incidents: IncidentEngine = field(default_factory=IncidentEngine)
    alerts: AlertEngine = field(default_factory=AlertEngine)
    status: PipelineStatus = field(init=False)

    def __post_init__(self) -> None:
        self.status = PipelineStatus(camera_id=self.config.camera_id)
        if self.config.zones_path and Path(self.config.zones_path).is_file():
            self.zones = PolygonZoneManager.from_json(self.config.zones_path)
        model = str(self.config.model_path)
        if not Path(model).is_file():
            model = Path(model).name
        self._tracker = ByteTrackTracker(
            model_path=model,
            confidence_threshold=self.config.confidence_threshold,
            person_class_id=self.config.person_class_id,
            device=self.config.device,
        )
        self._rules = SimpleRuleEngine(default_rules())
        self._stream: OpenCVVideoStream | None = None
        self._prev_t = time.perf_counter()
        self._fps = 0.0
        self._frame_index = 0

    def open(self) -> None:
        self._stream = OpenCVVideoStream(self.config.source)
        self._stream.open()
        self.status.online = True

    def close(self) -> None:
        if self._stream is not None:
            self._stream.close()
            self._stream = None
        self._tracker.close()
        self.status.online = False

    def process_frame(self, frame: Frame) -> FrameResult:
        tracks = list(self._tracker.update((), frame))
        now = datetime.now(timezone.utc)
        ctx = RuleContext(
            tracks=tracks,
            zones=self.zones,
            config=self.config,
            frame_index=self._frame_index,
            timestamp=now,
            camera_id=self.config.camera_id,
        )
        raw = list(self._rules.evaluate(ctx))
        stored = self.incidents.ingest(self.config.camera_id, raw)
        for s in stored:
            self.alerts.publish(s)

        t = time.perf_counter()
        dt = t - self._prev_t
        self._prev_t = t
        if dt > 0:
            self._fps = 0.9 * self._fps + 0.1 * (1.0 / dt) if self._fps > 0 else 1.0 / dt
        self._frame_index += 1
        self.status.fps = self._fps
        self.status.person_count = len(tracks)
        self.status.frame_index = self._frame_index
        return FrameResult(frame=frame, tracks=tracks, incidents=stored, fps=self._fps)

    def read(self) -> FrameResult | None:
        if self._stream is None:
            raise RuntimeError("pipeline not open")
        frame = self._stream.read()
        if frame is None:
            return None
        return self.process_frame(frame)
