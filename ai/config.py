"""Runtime configuration for the GuardianAI vision pipeline.

Single source of thresholds and source paths. Loaded by callers (CLI, FastAPI)
and passed into detectors, trackers, and rules — never read from globals.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class AIConfig:
    """Immutable settings for one pipeline run.

    Attributes:
        source: Webcam index (``0``), file path, or RTSP URL.
        model_path: Path to the YOLO weights file under ``models/``.
        confidence_threshold: Minimum detection score to keep (0–1).
        person_class_id: COCO / model class id treated as a person.
        night_start_hour: Local hour (0–23) when night-movement rules begin.
        night_end_hour: Local hour (0–23) when night-movement rules end.
        crowd_threshold: Person count that triggers a crowd incident.
        zones_path: Optional JSON/YAML describing restricted polygons.
        device: Inference device hint (``cpu``, ``cuda``, ``0``, …).
    """

    source: str | int = 0
    model_path: Path = field(default_factory=lambda: Path("models/yolov8n.pt"))
    confidence_threshold: float = 0.5
    person_class_id: int = 0
    night_start_hour: int = 22
    night_end_hour: int = 5
    crowd_threshold: int = 5
    zones_path: Path | None = None
    device: str = "cpu"

    def __post_init__(self) -> None:
        if not 0.0 <= self.confidence_threshold <= 1.0:
            raise ValueError("confidence_threshold must be in [0, 1]")
        if not 0 <= self.night_start_hour <= 23:
            raise ValueError("night_start_hour must be in [0, 23]")
        if not 0 <= self.night_end_hour <= 23:
            raise ValueError("night_end_hour must be in [0, 23]")
        if self.crowd_threshold < 1:
            raise ValueError("crowd_threshold must be >= 1")


if __name__ == "__main__":
    # ponytail: one assert-based check for trust-boundary validation
    cfg = AIConfig(confidence_threshold=0.6, crowd_threshold=3)
    assert cfg.confidence_threshold == 0.6
    try:
        AIConfig(confidence_threshold=1.5)
        raise AssertionError("expected ValueError")
    except ValueError:
        pass
    print("ai.config: ok")
