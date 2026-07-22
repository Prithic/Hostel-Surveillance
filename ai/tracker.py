"""Multi-object tracking contracts.

ByteTrack (via Ultralytics or Supervision) will implement :class:`Tracker`.
Tracking assigns stable ids across frames so rules can reason about *events*
(enter zone, linger) rather than raw per-frame boxes.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Sequence

from ai.detector import Detection
from ai.video_stream import Frame


@dataclass(frozen=True)
class Track:
    """A detection associated with a persistent track id.

    Attributes:
        track_id: Stable id for this object across consecutive frames.
        detection: The current-frame detection that updated this track.
    """

    track_id: int
    detection: Detection


class Tracker(ABC):
    """Associate detections across frames.

    Call :meth:`update` once per frame with that frame's detections. The
    implementation may use the optional ``frame`` for appearance features.
    """

    @abstractmethod
    def update(
        self,
        detections: Sequence[Detection],
        frame: Frame | None = None,
    ) -> Sequence[Track]:
        """Update tracks from the latest detections.

        Args:
            detections: Detector output for the current frame.
            frame: Optional image (needed by some appearance-based trackers).

        Returns:
            Active tracks after this update. Dropped / lost tracks are omitted.
        """

    def reset(self) -> None:
        """Clear all track state (e.g. after seeking a video). Default no-op."""

    def close(self) -> None:
        """Release resources. Default is a no-op."""
