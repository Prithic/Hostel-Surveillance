"""Sprint MVP local demo: full pipeline overlay (zones + IDs + alerts console).

Does not replace Sprint 1/2 demos.
  python -m ai.demo
  python -m ai.demo_track
  python -m ai.demo_mvp
"""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np

from ai.config import AIConfig
from ai.pipeline import GuardianPipeline
from ai.zone import Zone


def draw_zones(frame, zones: list[Zone]) -> None:
    for z in zones:
        pts = np.array([[int(p.x), int(p.y)] for p in z.polygon], dtype=np.int32)
        color = (0, 0, 220) if z.restricted else (200, 200, 0)
        cv2.polylines(frame, [pts], True, color, 2)
        x, y = pts[0]
        cv2.putText(frame, z.name, (x, max(20, y - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)


def main() -> None:
    p = argparse.ArgumentParser(description="GuardianAI MVP pipeline demo")
    p.add_argument("--source", default="0")
    p.add_argument("--model", default="models/yolov8n.pt")
    p.add_argument("--device", default="cpu")
    p.add_argument("--zones", default="datasets/zones/default_zones.json")
    p.add_argument("--camera-id", default="webcam-0")
    args = p.parse_args()
    source: str | int = int(args.source) if args.source.isdigit() else args.source
    zones_path = Path(args.zones) if Path(args.zones).is_file() else None
    model = Path(args.model)
    cfg = AIConfig(
        source=source,
        model_path=model if model.is_file() else Path(model.name),
        device=args.device,
        zones_path=zones_path,
        camera_id=args.camera_id,
    )
    pipe = GuardianPipeline(config=cfg)
    window = "GuardianAI — MVP Pipeline"
    try:
        pipe.open()
        while True:
            result = pipe.read()
            if result is None:
                break
            frame = result.frame
            draw_zones(frame, list(pipe.zones.zones()))
            for track in result.tracks:
                b = track.detection.bbox
                x1, y1, x2, y2 = int(b.x1), int(b.y1), int(b.x2), int(b.y2)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 80), 2)
                cv2.putText(
                    frame,
                    f"ID {track.track_id} {track.detection.confidence:.2f}",
                    (x1, max(20, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    (0, 200, 80),
                    2,
                )
            cv2.putText(
                frame,
                f"FPS {result.fps:.1f}  people={len(result.tracks)}",
                (10, 28),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.75,
                (40, 40, 255),
                2,
            )
            for inc in result.incidents:
                print(f"[ALERT] {inc.id} {inc.severity}: {inc.reason}")
            cv2.imshow(window, frame)
            if cv2.waitKey(1) & 0xFF in (ord("q"), 27):
                break
    finally:
        pipe.close()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
