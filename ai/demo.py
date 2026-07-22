"""Sprint 1 demo: webcam → YOLO person detection → boxes + FPS.

Controls:
    q / Esc — quit
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import cv2

from ai.config import AIConfig
from ai.detector import Detection
from ai.opencv_stream import OpenCVVideoStream
from ai.yolo_detector import YOLODetector


def draw_detections(frame, detections: list[Detection], fps: float) -> None:
    """Draw person boxes, labels, and FPS onto ``frame`` in place."""
    for det in detections:
        x1, y1, x2, y2 = (
            int(det.bbox.x1),
            int(det.bbox.y1),
            int(det.bbox.x2),
            int(det.bbox.y2),
        )
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 80), 2)
        label = f"{det.class_name} {det.confidence:.2f}"
        cv2.putText(
            frame,
            label,
            (x1, max(20, y1 - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.55,
            (0, 200, 80),
            2,
            cv2.LINE_AA,
        )
    cv2.putText(
        frame,
        f"FPS {fps:.1f}",
        (10, 28),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (40, 40, 255),
        2,
        cv2.LINE_AA,
    )


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="GuardianAI Sprint 1 — person detect demo")
    p.add_argument("--source", default="0", help="Webcam index or video path (default: 0)")
    p.add_argument(
        "--model",
        default="models/yolov8n.pt",
        help="YOLO weights path (downloaded on first run if missing name)",
    )
    p.add_argument("--conf", type=float, default=0.5, help="Confidence threshold")
    p.add_argument("--device", default="cpu", help="cpu | cuda | 0 …")
    return p.parse_args()


def resolve_source(raw: str) -> str | int:
    return int(raw) if raw.isdigit() else raw


def resolve_model(path: str) -> str:
    """Prefer local path; fall back to Ultralytics name so first run can download."""
    p = Path(path)
    if p.is_file():
        return str(p)
    # models/yolov8n.pt missing → let Ultralytics fetch yolov8n.pt into cwd/cache
    return p.name


def main() -> None:
    args = parse_args()
    source = resolve_source(args.source)
    config = AIConfig(
        source=source,
        model_path=Path(args.model),
        confidence_threshold=args.conf,
        device=args.device,
    )

    detector = YOLODetector(
        model_path=resolve_model(str(config.model_path)),
        confidence_threshold=config.confidence_threshold,
        person_class_id=config.person_class_id,
        device=config.device,
    )

    window = "GuardianAI — Sprint 1"
    prev = time.perf_counter()
    fps = 0.0

    try:
        with OpenCVVideoStream(config.source) as stream:
            while True:
                frame = stream.read()
                if frame is None:
                    break

                detections = list(detector.detect(frame))
                now = time.perf_counter()
                dt = now - prev
                prev = now
                if dt > 0:
                    fps = 0.9 * fps + 0.1 * (1.0 / dt) if fps > 0 else 1.0 / dt

                draw_detections(frame, detections, fps)
                cv2.imshow(window, frame)
                key = cv2.waitKey(1) & 0xFF
                if key in (ord("q"), 27):
                    break
    finally:
        detector.close()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
