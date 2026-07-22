"""Sprint 2 demo: webcam → YOLO + ByteTrack → box, ID, confidence, FPS.

Controls:
    q / Esc — quit

Sprint 1 detect-only demo remains: ``python -m ai.demo``
"""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import cv2

from ai.bytetrack import ByteTrackTracker
from ai.config import AIConfig
from ai.opencv_stream import OpenCVVideoStream
from ai.tracker import Track


def draw_tracks(frame, tracks: list[Track], fps: float) -> None:
    """Draw person boxes with track id, confidence, and FPS."""
    for track in tracks:
        det = track.detection
        x1, y1, x2, y2 = (
            int(det.bbox.x1),
            int(det.bbox.y1),
            int(det.bbox.x2),
            int(det.bbox.y2),
        )
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 80), 2)
        label = f"ID {track.track_id}  {det.confidence:.2f}"
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
    p = argparse.ArgumentParser(description="GuardianAI Sprint 2 — person track demo")
    p.add_argument("--source", default="0", help="Webcam index or video path (default: 0)")
    p.add_argument(
        "--model",
        default="models/yolov8n.pt",
        help="YOLO weights path",
    )
    p.add_argument("--conf", type=float, default=0.5, help="Confidence threshold")
    p.add_argument("--device", default="cpu", help="cpu | cuda | 0 …")
    return p.parse_args()


def resolve_source(raw: str) -> str | int:
    return int(raw) if raw.isdigit() else raw


def resolve_model(path: str) -> str:
    p = Path(path)
    if p.is_file():
        return str(p)
    return p.name


def main() -> None:
    args = parse_args()
    config = AIConfig(
        source=resolve_source(args.source),
        model_path=Path(args.model),
        confidence_threshold=args.conf,
        device=args.device,
    )

    tracker = ByteTrackTracker(
        model_path=resolve_model(str(config.model_path)),
        confidence_threshold=config.confidence_threshold,
        person_class_id=config.person_class_id,
        device=config.device,
    )

    window = "GuardianAI — Sprint 2 (ByteTrack)"
    prev = time.perf_counter()
    fps = 0.0

    try:
        with OpenCVVideoStream(config.source) as stream:
            while True:
                frame = stream.read()
                if frame is None:
                    break

                tracks = list(tracker.update((), frame))
                now = time.perf_counter()
                dt = now - prev
                prev = now
                if dt > 0:
                    fps = 0.9 * fps + 0.1 * (1.0 / dt) if fps > 0 else 1.0 / dt

                draw_tracks(frame, tracks, fps)
                cv2.imshow(window, frame)
                key = cv2.waitKey(1) & 0xFF
                if key in (ord("q"), 27):
                    break
    finally:
        tracker.close()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
