"""End-to-end GuardianAI frame pipeline (modular wiring only)."""

from __future__ import annotations

import os
import re
import time
from dataclasses import dataclass, field, replace
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Sequence

import cv2
import numpy as np

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

# Hikvision-style names: D03_20260729142351.mp4 → start 2026-07-29 14:23:51 local
_FILE_TS = re.compile(r"(?<!\d)(\d{14})(?!\d)")


def _parse_file_start(source: str | int) -> datetime | None:
    if isinstance(source, int):
        return None
    stem = Path(str(source)).stem
    m = _FILE_TS.search(stem)
    if not m:
        return None
    raw = m.group(1)
    try:
        naive = datetime.strptime(raw, "%Y%m%d%H%M%S")
    except ValueError:
        return None
    # Treat as local hostel wall-clock (IST on demo laptops).
    return naive.astimezone()


def _default_zones() -> ZoneManager:
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
        self._zones_path = (
            Path(self.config.zones_path)
            if self.config.zones_path and Path(self.config.zones_path).is_file()
            else None
        )
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
        self._zones_scaled = False
        self._file_start = _parse_file_start(self.config.source)

    def open(self) -> None:
        self._stream = OpenCVVideoStream(self.config.source)
        self._stream.open()
        self.status.online = True
        self._file_start = _parse_file_start(self.config.source)

    def _event_time(self) -> datetime:
        """Wall clock for live cams; footage timestamp for file sources when parseable."""
        if self._stream is not None and not self.is_live and self._file_start is not None:
            msec = 0.0
            cap = getattr(self._stream, "_cap", None)
            if cap is not None:
                msec = float(cap.get(cv2.CAP_PROP_POS_MSEC) or 0.0)
            return self._file_start + timedelta(milliseconds=max(0.0, msec))
        # Live webcam / unknown file naming → local now (hostel schedule hours).
        return datetime.now().astimezone()

    def update_runtime(
        self,
        *,
        confidence_threshold: float | None = None,
        crowd_threshold: int | None = None,
        night_start_hour: int | None = None,
        night_end_hour: int | None = None,
    ) -> AIConfig:
        """Hot-swap rule/detection thresholds without restarting the camera."""
        kwargs: dict = {}
        if confidence_threshold is not None:
            kwargs["confidence_threshold"] = confidence_threshold
        if crowd_threshold is not None:
            kwargs["crowd_threshold"] = crowd_threshold
        if night_start_hour is not None:
            kwargs["night_start_hour"] = night_start_hour
        if night_end_hour is not None:
            kwargs["night_end_hour"] = night_end_hour
        if not kwargs:
            return self.config
        self.config = replace(self.config, **kwargs)
        if confidence_threshold is not None:
            self._tracker._confidence = float(confidence_threshold)
        return self.config

    def close(self) -> None:
        if self._stream is not None:
            self._stream.close()
            self._stream = None
        self._tracker.close()
        self.status.online = False

    def _ensure_zones(self, frame: Frame) -> None:
        if self._zones_scaled or self._zones_path is None:
            return
        h, w = frame.shape[:2]
        self.zones = PolygonZoneManager.from_json(self._zones_path, frame_size=(w, h))
        self._zones_scaled = True

    def annotate(self, frame: Frame, tracks: Sequence[Track]) -> Frame:
        """Copy frame with zones + track boxes for the warden live view."""
        out = frame.copy()
        for z in self.zones.zones():
            pts = np.array([[int(p.x), int(p.y)] for p in z.polygon], dtype=np.int32)
            color = (0, 0, 220) if z.restricted else (200, 200, 0)
            cv2.polylines(out, [pts], True, color, 2)
            x0, y0 = int(z.polygon[0].x), int(z.polygon[0].y)
            cv2.putText(out, z.name, (x0, max(16, y0 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
        for track in tracks:
            b = track.detection.bbox
            x1, y1, x2, y2 = int(b.x1), int(b.y1), int(b.x2), int(b.y2)
            cv2.rectangle(out, (x1, y1), (x2, y2), (0, 200, 80), 2)
            cv2.putText(
                out,
                f"ID {track.track_id} {track.detection.confidence:.2f}",
                (x1, max(20, y1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 200, 80),
                1,
            )
        cv2.putText(
            out,
            f"FPS {self._fps:.1f}  people={len(tracks)}",
            (10, 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (40, 40, 255),
            2,
        )
        return out

    def process_frame(self, frame: Frame) -> FrameResult:
        self._ensure_zones(frame)
        tracks = list(self._tracker.update((), frame))
        now = self._event_time()
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
        # Hostel CCTV exports are often 1440p+; downscale keeps CPU demos usable.
        max_w = int(os.environ.get("GUARDIAN_MAX_WIDTH", "1280"))
        h, w = frame.shape[:2]
        if w > max_w > 0:
            nh = max(1, int(h * max_w / w))
            frame = cv2.resize(frame, (max_w, nh), interpolation=cv2.INTER_AREA)
        return self.process_frame(frame)

    @property
    def is_live(self) -> bool:
        return bool(self._stream is not None and getattr(self._stream, "_is_live", False))
