"""Validate a YOLO detection dataset (images ↔ labels, box ranges, class ids)."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def _load_data_yaml(path: Path) -> dict:
    raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise ValueError(f"invalid data yaml: {path}")
    return raw


def _resolve_split_dirs(data_yaml: Path, cfg: dict, split: str) -> tuple[Path, Path]:
    base = (data_yaml.parent / str(cfg["path"])).resolve()
    rel = cfg[split]
    img_dir = (base / rel).resolve()
    # Ultralytics convention: labels mirror images path (images/→labels/)
    lbl_dir = Path(str(img_dir).replace("images", "labels", 1))
    if "images" not in img_dir.parts:
        lbl_dir = base / "labels" / Path(rel).name
    return img_dir, lbl_dir


def _parse_label_line(line: str, n_classes: int) -> str | None:
    parts = line.split()
    if len(parts) != 5:
        return f"expected 5 fields, got {len(parts)}"
    try:
        cls = int(float(parts[0]))
        vals = [float(x) for x in parts[1:]]
    except ValueError:
        return "non-numeric fields"
    if cls < 0 or cls >= n_classes:
        return f"class_id {cls} out of range [0, {n_classes})"
    cx, cy, w, h = vals
    for name, v in (("cx", cx), ("cy", cy), ("w", w), ("h", h)):
        if not 0.0 <= v <= 1.0:
            return f"{name}={v} outside [0, 1]"
    if w <= 0 or h <= 0:
        return "zero/negative width or height"
    return None


def validate_split(img_dir: Path, lbl_dir: Path, n_classes: int) -> list[str]:
    errors: list[str] = []
    if not img_dir.is_dir():
        return [f"missing image dir: {img_dir}"]
    if not lbl_dir.is_dir():
        return [f"missing label dir: {lbl_dir}"]

    images = sorted(p for p in img_dir.iterdir() if p.suffix.lower() in IMAGE_EXTS)
    labels = {p.stem: p for p in lbl_dir.glob("*.txt")}

    if not images:
        errors.append(f"{img_dir}: no images (pipeline ready, add labeled data)")
        return errors

    box_count = 0
    for img in images:
        lab = labels.get(img.stem)
        if lab is None:
            errors.append(f"missing label for image: {img.name}")
            continue
        text = lab.read_text(encoding="utf-8").strip()
        if not text:
            # empty file = background image; allowed
            continue
        for i, line in enumerate(text.splitlines(), start=1):
            line = line.strip()
            if not line:
                continue
            err = _parse_label_line(line, n_classes)
            if err:
                errors.append(f"{lab.name}:{i}: {err}")
            else:
                box_count += 1

    for stem, lab in labels.items():
        if not any((img_dir / f"{stem}{ext}").is_file() for ext in IMAGE_EXTS):
            errors.append(f"orphan label (no image): {lab.name}")

    print(f"  {img_dir.name}: images={len(images)} labels={len(labels)} boxes={box_count}")
    return errors


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--data",
        default=str(ROOT / "datasets" / "data.yaml"),
        help="Ultralytics data yaml",
    )
    args = p.parse_args()
    data_yaml = Path(args.data).resolve()
    if not data_yaml.is_file():
        print(f"error: data yaml not found: {data_yaml}", file=sys.stderr)
        return 2

    cfg = _load_data_yaml(data_yaml)
    names = cfg.get("names") or {}
    n_classes = len(names) if isinstance(names, dict) else len(names)

    print(f"validating {data_yaml} ({n_classes} classes)")
    all_errors: list[str] = []
    for split in ("train", "val"):
        if split not in cfg:
            all_errors.append(f"yaml missing key: {split}")
            continue
        img_dir, lbl_dir = _resolve_split_dirs(data_yaml, cfg, split)
        print(f"[{split}] {img_dir}")
        all_errors.extend(validate_split(img_dir, lbl_dir, n_classes))

    if all_errors:
        print(f"\nFAIL ({len(all_errors)} issues):")
        for e in all_errors[:50]:
            print(f"  - {e}")
        if len(all_errors) > 50:
            print(f"  … {len(all_errors) - 50} more")
        return 1

    print("\nOK — dataset ready for training")
    return 0


if __name__ == "__main__":
    # ponytail: one runnable check — empty hostel_person reports clearly, exits 1
    raise SystemExit(main())
