"""Ultralytics YOLO :class:`~ai.detector.Detector` (person class only for Sprint 1)."""

from __future__ import annotations

from pathlib import Path
from typing import Sequence

from ultralytics import YOLO

from ai.detector import BoundingBox, Detection, Detector
from ai.video_stream import Frame


class YOLODetector(Detector):
    """Run YOLO and keep detections for a single class (default: person / COCO 0).

    Args:
        model_path: Local weights path or Ultralytics model name (e.g. ``yolov8n.pt``).
        confidence_threshold: Minimum score to keep.
        person_class_id: Class id to retain (others discarded).
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

    def detect(self, frame: Frame) -> Sequence[Detection]:
        results = self._model.predict(
            source=frame,
            conf=self._confidence,
            classes=[self._class_id],
            device=self._device,
            verbose=False,
        )
        if not results:
            return []

        result = results[0]
        names = result.names or {}
        boxes = result.boxes
        if boxes is None or len(boxes) == 0:
            return []

        out: list[Detection] = []
        xyxy = boxes.xyxy.cpu().tolist()
        confs = boxes.conf.cpu().tolist()
        clss = boxes.cls.cpu().tolist()
        for (x1, y1, x2, y2), conf, cls in zip(xyxy, confs, clss):
            class_id = int(cls)
            out.append(
                Detection(
                    bbox=BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2),
                    class_id=class_id,
                    class_name=str(names.get(class_id, class_id)),
                    confidence=float(conf),
                )
            )
        return out

    def close(self) -> None:
        self._model = None  # type: ignore[assignment]
