"""Object detection contracts.

YOLO (Ultralytics) will implement :class:`Detector`. This module only defines
the shapes the rest of the pipeline depends on — no model loading here.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Sequence

from ai.video_stream import Frame


@dataclass(frozen=True)
class BoundingBox:
    """Axis-aligned box in pixel coordinates (origin top-left).

    Attributes:
        x1: Left edge.
        y1: Top edge.
        x2: Right edge.
        y2: Bottom edge.
    """

    x1: float
    y1: float
    x2: float
    y2: float

    def center(self) -> tuple[float, float]:
        """Return the geometric center ``(cx, cy)``."""
        return ((self.x1 + self.x2) / 2.0, (self.y1 + self.y2) / 2.0)

    def area(self) -> float:
        """Return box area in square pixels (clamped at zero)."""
        return max(0.0, self.x2 - self.x1) * max(0.0, self.y2 - self.y1)


@dataclass(frozen=True)
class Detection:
    """One detected object in a single frame.

    Privacy note: no identity fields — class + geometry + score only.
    """

    bbox: BoundingBox
    class_id: int
    class_name: str
    confidence: float


class Detector(ABC):
    """Detect objects in a frame.

    Implementations (e.g. Ultralytics YOLO) must be swappable without changing
    tracker / zone / rule code.
    """

    @abstractmethod
    def detect(self, frame: Frame) -> Sequence[Detection]:
        """Run detection on ``frame``.

        Args:
            frame: BGR image as produced by :class:`~ai.video_stream.VideoStream`.

        Returns:
            Zero or more detections for this frame. Order is undefined.
        """

    def close(self) -> None:
        """Release model / GPU resources. Default is a no-op."""
