"""Ultralytics built-in ByteTrack :class:`~ai.tracker.Tracker`.

ByteTrack runs inside ``YOLO.track(..., tracker='bytetrack.yaml')``. That API
owns detection+association, so :meth:`update` requires ``frame`` and ignores
precomputed ``detections`` (callers may pass ``()``).
"""

from __future__ import annotations

from pathlib import Path
from typing import Sequence

from ultralytics import YOLO

from ai.detector import BoundingBox, Detection
from ai.tracker import Track, Tracker
from ai.video_stream import Frame


class ByteTrackTracker(Tracker):
    """Person tracking via Ultralytics ByteTrack (``bytetrack.yaml``).

    Args:
        model_path: YOLO weights (same family as the detect demo).
        confidence_threshold: Minimum detection score.
        person_class_id: Class to track (COCO person = 0).
        device: Inference device (``cpu``, ``cuda``, ``0``, …).
    """

    def __init__(
        self,
        model_path: str | Path = "yolov8n.pt",
        confidence_threshold: float = 0.5,
        person_class_id: int = 0,
        device: str = "cpu",
    ) -> None:
        self._confidence = confidence_threshold
        self._class_id = person_class_id
        self._device = device
        self._model = YOLO(str(model_path))

    def update(
        self,
        detections: Sequence[Detection],
        frame: Frame | None = None,
    ) -> Sequence[Track]:
        if frame is None:
            raise ValueError("ByteTrackTracker.update requires frame")
        # detections unused — Ultralytics ByteTrack re-detects inside track()
        _ = detections

        results = self._model.track(
            source=frame,
            persist=True,
            tracker="bytetrack.yaml",
            conf=self._confidence,
            classes=[self._class_id],
            device=self._device,
            verbose=False,
        )
        if not results:
            return []

        result = results[0]
        boxes = result.boxes
        if boxes is None or len(boxes) == 0:
            return []
        if boxes.id is None:
            # No IDs yet (tracker warm-up / all lost) — nothing to report
            return []

        names = result.names or {}
        xyxy = boxes.xyxy.cpu().tolist()
        confs = boxes.conf.cpu().tolist()
        clss = boxes.cls.cpu().tolist()
        ids = boxes.id.int().cpu().tolist()

        out: list[Track] = []
        for (x1, y1, x2, y2), conf, cls, tid in zip(xyxy, confs, clss, ids):
            class_id = int(cls)
            det = Detection(
                bbox=BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2),
                class_id=class_id,
                class_name=str(names.get(class_id, class_id)),
                confidence=float(conf),
            )
            out.append(Track(track_id=int(tid), detection=det))
        return out

    def reset(self) -> None:
        predictor = getattr(self._model, "predictor", None)
        if predictor is not None and getattr(predictor, "trackers", None) is not None:
            predictor.trackers = []

    def close(self) -> None:
        self.reset()
        self._model = None  # type: ignore[assignment]
