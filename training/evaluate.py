"""Evaluate a trained YOLO checkpoint on the dataset val split."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from ultralytics import YOLO

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--weights",
        required=True,
        help="Path to best.pt / last.pt from a training run",
    )
    p.add_argument(
        "--data",
        default=str(ROOT / "datasets" / "data.yaml"),
        help="Ultralytics data yaml",
    )
    p.add_argument("--imgsz", type=int, default=640)
    p.add_argument("--batch", type=int, default=16)
    p.add_argument("--device", default="cpu")
    p.add_argument(
        "--split",
        default="val",
        choices=("val", "test", "train"),
        help="Which split to evaluate",
    )
    args = p.parse_args()

    weights = Path(args.weights)
    data = Path(args.data)
    if not weights.is_file():
        print(f"error: weights not found: {weights}", file=sys.stderr)
        return 2
    if not data.is_file():
        print(f"error: data yaml not found: {data}", file=sys.stderr)
        return 2

    model = YOLO(str(weights))
    metrics = model.val(
        data=str(data.resolve()),
        split=args.split,
        imgsz=args.imgsz,
        batch=args.batch,
        device=args.device,
        plots=True,
        project=str(ROOT / "runs" / "detect"),
        name="eval",
        exist_ok=True,
    )
    box = metrics.box
    print(
        f"mAP50={box.map50:.4f}  mAP50-95={box.map:.4f}  "
        f"precision={box.mp:.4f}  recall={box.mr:.4f}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
