"""Start YOLOv8s fine-tuning from training/configs/yolov8s_person.yaml.

Prerequisite: a validated dataset with real images/labels.

  python -m training.validate_dataset
  python -m training.train

Does not alter the Sprint 1 demo weights (models/yolov8n.pt).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CFG = ROOT / "training" / "configs" / "yolov8s_person.yaml"

# Keys passed through to YOLO.train (ignore meta keys we handle ourselves)
_TRAIN_KEYS = {
    "epochs", "imgsz", "batch", "patience", "workers", "device", "optimizer",
    "lr0", "lrf", "weight_decay", "warmup_epochs", "cos_lr",
    "hsv_h", "hsv_s", "hsv_v", "degrees", "translate", "scale", "fliplr", "mosaic",
    "project", "name", "exist_ok", "pretrained", "plots", "save", "seed",
}


def _load_cfg(path: Path) -> dict:
    cfg = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(cfg, dict):
        raise ValueError(f"invalid train config: {path}")
    return cfg


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--config", default=str(DEFAULT_CFG), help="Train hyperparam yaml")
    p.add_argument(
        "--data",
        default=None,
        help="Override data yaml (default: from config)",
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="Print resolved settings and exit without training",
    )
    args = p.parse_args()

    cfg_path = Path(args.config).resolve()
    cfg = _load_cfg(cfg_path)
    data = args.data or cfg.get("data", "datasets/data.yaml")
    data_path = (ROOT / data).resolve() if not Path(data).is_absolute() else Path(data)
    model_name = str(cfg.get("model", "yolov8s.pt"))

    if not data_path.is_file():
        print(f"error: data yaml missing: {data_path}", file=sys.stderr)
        return 2

    train_kwargs = {k: cfg[k] for k in _TRAIN_KEYS if k in cfg}
    train_kwargs["data"] = str(data_path)
    # Ultralytics project path relative to cwd
    if "project" in train_kwargs and not Path(train_kwargs["project"]).is_absolute():
        train_kwargs["project"] = str(ROOT / train_kwargs["project"])

    print("model:", model_name)
    print("data:", data_path)
    print("train kwargs:", train_kwargs)

    if args.dry_run:
        print("dry-run: not training")
        return 0

    # Soft gate: suggest validate first (non-fatal if user forces)
    from training.validate_dataset import main as validate_main

    print("running dataset validation …")
    prev = sys.argv
    try:
        sys.argv = ["validate_dataset", "--data", str(data_path)]
        code = validate_main()
    finally:
        sys.argv = prev
    if code != 0:
        print(
            "error: dataset validation failed — fix labels or add images before training",
            file=sys.stderr,
        )
        return code

    model = YOLO(model_name)
    model.train(**train_kwargs)
    print("training finished — best weights under runs/detect/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
