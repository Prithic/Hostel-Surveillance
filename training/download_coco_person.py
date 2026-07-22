"""Download COCO 2017 person boxes → YOLO layout under datasets/public/coco_person.

Licenses (see datasets/LICENSES.md):
  - Annotations: Creative Commons Attribution 4.0 (COCO)
  - Images: original Flickr photographer terms; research / redistribution
    constraints apply — review before commercial use.

Default downloads a small sample (individual image URLs). Use --full for the
official zip mirrors (many GB).
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "datasets" / "public" / "coco_person"
RAW = OUT / "raw"
ANN_URL = "http://images.cocodataset.org/annotations/annotations_trainval2017.zip"
IMG_BASE = {
    "train": "http://images.cocodataset.org/train2017",
    "val": "http://images.cocodataset.org/val2017",
}
ZIP_URLS = {
    "train": "http://images.cocodataset.org/zips/train2017.zip",
    "val": "http://images.cocodataset.org/zips/val2017.zip",
}
# COCO category_id for person
PERSON_CAT = 1


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_file() and dest.stat().st_size > 0:
        print(f"skip (exists): {dest}")
        return
    print(f"downloading {url}")
    urllib.request.urlretrieve(url, dest)  # noqa: S310 — fixed upstream URL


def _coco_to_yolo(box: list[float], img_w: int, img_h: int) -> tuple[float, float, float, float] | None:
    """COCO xywh (top-left) → YOLO normalized cxcywh. Skip invalid boxes."""
    x, y, w, h = box
    if w <= 0 or h <= 0 or img_w <= 0 or img_h <= 0:
        return None
    cx = (x + w / 2.0) / img_w
    cy = (y + h / 2.0) / img_h
    nw = w / img_w
    nh = h / img_h
    if not (0.0 <= cx <= 1.0 and 0.0 <= cy <= 1.0):
        return None
    nw = min(max(nw, 0.0), 1.0)
    nh = min(max(nh, 0.0), 1.0)
    return cx, cy, nw, nh


def _load_person_index(ann_path: Path) -> tuple[dict, dict[int, list]]:
    data = json.loads(ann_path.read_text(encoding="utf-8"))
    images = {im["id"]: im for im in data["images"]}
    by_image: dict[int, list] = defaultdict(list)
    for ann in data["annotations"]:
        if ann.get("category_id") != PERSON_CAT:
            continue
        if ann.get("iscrowd", 0) == 1:
            continue
        by_image[ann["image_id"]].append(ann)
    return images, by_image


def _write_split(
    split: str,
    images: dict,
    by_image: dict[int, list],
    image_ids: list[int],
    *,
    full_zip_images: Path | None,
) -> int:
    img_dir = OUT / "images" / split
    lbl_dir = OUT / "labels" / split
    img_dir.mkdir(parents=True, exist_ok=True)
    lbl_dir.mkdir(parents=True, exist_ok=True)
    written = 0
    for image_id in image_ids:
        im = images[image_id]
        anns = by_image[image_id]
        file_name = im["file_name"]
        dest_img = img_dir / file_name
        lines: list[str] = []
        for ann in anns:
            yolo = _coco_to_yolo(ann["bbox"], im["width"], im["height"])
            if yolo is None:
                continue
            cx, cy, nw, nh = yolo
            lines.append(f"0 {cx:.6f} {cy:.6f} {nw:.6f} {nh:.6f}")
        if not lines:
            continue
        if not dest_img.is_file():
            if full_zip_images is not None:
                src = full_zip_images / file_name
                if not src.is_file():
                    continue
                dest_img.write_bytes(src.read_bytes())
            else:
                url = f"{IMG_BASE[split]}/{file_name}"
                try:
                    _download(url, dest_img)
                except Exception as exc:  # noqa: BLE001 — continue sample on flaky CDN
                    print(f"warn: skip {file_name}: {exc}", file=sys.stderr)
                    if dest_img.is_file():
                        dest_img.unlink()
                    continue
        (lbl_dir / f"{Path(file_name).stem}.txt").write_text(
            "\n".join(lines) + "\n",
            encoding="utf-8",
        )
        written += 1
    return written


def export_split(split: str, ann_name: str, max_images: int | None, full: bool) -> None:
    ann_path = RAW / "annotations" / ann_name
    images, by_image = _load_person_index(ann_path)
    ids = sorted(i for i in by_image if i in images)
    if max_images is not None:
        ids = ids[:max_images]
    zip_extract: Path | None = None
    if full:
        zpath = RAW / f"{split}2017.zip"
        _download(ZIP_URLS[split], zpath)
        zip_extract = RAW / f"{split}2017"
        if not zip_extract.is_dir():
            print(f"extracting {zpath.name} …")
            with zipfile.ZipFile(zpath, "r") as zf:
                zf.extractall(RAW)
        # zip extracts to train2017/ or val2017/
        if not zip_extract.is_dir():
            raise RuntimeError(f"expected extract dir {zip_extract}")
    n = _write_split(split, images, by_image, ids, full_zip_images=zip_extract)
    print(f"{split}: wrote {n} person images (requested {len(ids)})")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument(
        "--max-images",
        type=int,
        default=200,
        help="Max images per split with person boxes (default: 200). Ignored with --full.",
    )
    p.add_argument(
        "--full",
        action="store_true",
        help="Download full COCO train/val zips (many GB) and export all person images.",
    )
    p.add_argument("--skip-train", action="store_true")
    p.add_argument("--skip-val", action="store_true")
    args = p.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)
    ann_zip = RAW / "annotations_trainval2017.zip"
    _download(ANN_URL, ann_zip)
    ann_dir = RAW / "annotations"
    if not (ann_dir / "instances_train2017.json").is_file():
        print("extracting annotations …")
        with zipfile.ZipFile(ann_zip, "r") as zf:
            zf.extractall(RAW)

    max_images = None if args.full else args.max_images
    if not args.skip_train:
        export_split("train", "instances_train2017.json", max_images, args.full)
    if not args.skip_val:
        export_split("val", "instances_val2017.json", max_images, args.full)

    print(f"done → {OUT}")
    print("validate:  python -m training.validate_dataset --data datasets/coco_person.yaml")


def _self_check() -> None:
    # ponytail: conversion math must stay correct
    box = _coco_to_yolo([10.0, 20.0, 40.0, 80.0], 100, 200)
    assert box is not None
    cx, cy, nw, nh = box
    assert abs(cx - 0.30) < 1e-6 and abs(cy - 0.30) < 1e-6
    assert abs(nw - 0.40) < 1e-6 and abs(nh - 0.40) < 1e-6
    assert _coco_to_yolo([0.0, 0.0, 0.0, 1.0], 100, 100) is None
    print("download_coco_person self-check: ok")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--self-check":
        _self_check()
    else:
        main()
