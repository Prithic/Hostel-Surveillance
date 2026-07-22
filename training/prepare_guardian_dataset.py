"""Build GuardianAI YOLO dataset from synthetic CCTV videos.

Phases: inventory → extract → annotate → quality → split → augment → docs.
Does NOT start training.

Usage:
  python -m training.prepare_guardian_dataset
  python -m training.prepare_guardian_dataset --skip-augment
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import random
import shutil
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = ROOT / "models" / "custom" / "yolov8s_v4_production.pt"
VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mkv"}
OUT = ROOT / "datasets" / "guardian_synthetic"
RAW_IMG = OUT / "raw" / "images"
RAW_LBL = OUT / "raw" / "labels"
RAW_PREV = OUT / "raw" / "previews"
AUG_IMG = OUT / "augmented" / "images"
AUG_LBL = OUT / "augmented" / "labels"
SPLIT = OUT / "yolo"
CONF_JSONL = OUT / "raw" / "confidences.jsonl"

# Quality thresholds
MIN_LAPLACIAN = 35.0  # blur reject
DUP_HIST_CORR = 0.995  # near-duplicate consecutive keepers
MIN_BOX_AREA = 0.0008  # normalized w*h
MIN_CONF = 0.25


@dataclass
class VideoInfo:
    path: Path
    filename: str
    duration: float
    fps: float
    width: int
    height: int
    category: str
    source: str
    extract_fps: float


def categorize(path: Path) -> tuple[str, float]:
    name = path.stem.lower()
    if "students" in name or "crowd" in name:
        return "crowd", 4.0
    if "dark" in name or "night" in name:
        return "walking_dark", 2.0
    if "fast" in name or "run" in name:
        return "fast_motion", 5.0
    return "walking", 2.0


def discover_videos(root: Path) -> list[Path]:
    vids: list[Path] = []
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        if p.suffix.lower() not in VIDEO_EXTS:
            continue
        if any(part.startswith(".") for part in p.parts):
            continue
        if "node_modules" in p.parts:
            continue
        vids.append(p)
    return sorted(vids)


def probe_video(path: Path) -> VideoInfo:
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise RuntimeError(f"cannot open {path}")
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 0.0) or 25.0
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    cap.release()
    duration = n / fps if fps > 0 else 0.0
    cat, efps = categorize(path)
    try:
        rel = str(path.relative_to(ROOT))
    except ValueError:
        rel = str(path)
    source = "synthetic" if "synthetic" in path.parts else path.parent.name
    return VideoInfo(path, path.name, duration, fps, w, h, cat, source, efps)


def write_inventory(videos: list[VideoInfo], dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["filename", "duration", "fps", "resolution", "category", "source", "extract_fps", "path"])
        for v in videos:
            w.writerow([
                v.filename,
                f"{v.duration:.2f}",
                f"{v.fps:.3f}",
                f"{v.width}x{v.height}",
                v.category,
                v.source,
                v.extract_fps,
                str(v.path.relative_to(ROOT)),
            ])


def is_blurry(frame: np.ndarray) -> bool:
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var()) < MIN_LAPLACIAN


def hist_corr(a: np.ndarray, b: np.ndarray) -> float:
    ha = cv2.calcHist([cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)], [0], None, [64], [0, 256])
    hb = cv2.calcHist([cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)], [0], None, [64], [0, 256])
    cv2.normalize(ha, ha)
    cv2.normalize(hb, hb)
    return float(cv2.compareHist(ha, hb, cv2.HISTCMP_CORREL))


def extract_frames(videos: list[VideoInfo]) -> tuple[list[Path], dict]:
    RAW_IMG.mkdir(parents=True, exist_ok=True)
    stats = {"considered": 0, "saved": 0, "blur": 0, "dup": 0, "corrupt": 0}
    saved: list[Path] = []
    for v in videos:
        cap = cv2.VideoCapture(str(v.path))
        if not cap.isOpened():
            stats["corrupt"] += 1
            continue
        interval = max(v.fps / v.extract_fps, 1.0)
        idx = 0
        next_keep = 0.0
        prev_kept: np.ndarray | None = None
        stem = v.path.stem[:48]
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            stats["considered"] += 1
            if idx + 1e-6 < next_keep:
                idx += 1
                continue
            next_keep += interval
            idx += 1
            if frame is None or frame.size == 0:
                stats["corrupt"] += 1
                continue
            if is_blurry(frame):
                stats["blur"] += 1
                continue
            if prev_kept is not None and hist_corr(prev_kept, frame) >= DUP_HIST_CORR:
                stats["dup"] += 1
                continue
            name = f"{stem}_f{idx:06d}.jpg"
            out = RAW_IMG / name
            if not cv2.imwrite(str(out), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 92]):
                stats["corrupt"] += 1
                continue
            prev_kept = frame
            saved.append(out)
            stats["saved"] += 1
        cap.release()
    return saved, stats


def annotate(images: list[Path], model_path: Path) -> dict:
    RAW_LBL.mkdir(parents=True, exist_ok=True)
    RAW_PREV.mkdir(parents=True, exist_ok=True)
    model = YOLO(str(model_path))
    CONF_JSONL.parent.mkdir(parents=True, exist_ok=True)
    if CONF_JSONL.exists():
        CONF_JSONL.unlink()
    stats = {"images": 0, "with_boxes": 0, "boxes": 0, "tiny_dropped": 0}
    for img_path in images:
        frame = cv2.imread(str(img_path))
        if frame is None:
            continue
        h, w = frame.shape[:2]
        results = model.predict(
            source=frame,
            conf=MIN_CONF,
            classes=[0],
            verbose=False,
        )
        stats["images"] += 1
        lines: list[str] = []
        confs: list[float] = []
        vis = frame.copy()
        if results and results[0].boxes is not None and len(results[0].boxes):
            boxes = results[0].boxes
            xyxy = boxes.xyxy.cpu().tolist()
            conf_list = boxes.conf.cpu().tolist()
            for (x1, y1, x2, y2), conf in zip(xyxy, conf_list):
                bw = (x2 - x1) / w
                bh = (y2 - y1) / h
                if bw * bh < MIN_BOX_AREA:
                    stats["tiny_dropped"] += 1
                    continue
                cx = ((x1 + x2) / 2) / w
                cy = ((y1 + y2) / 2) / h
                # clamp
                cx, cy = min(max(cx, 0), 1), min(max(cy, 0), 1)
                bw, bh = min(max(bw, 0), 1), min(max(bh, 0), 1)
                lines.append(f"0 {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}")
                confs.append(float(conf))
                cv2.rectangle(vis, (int(x1), int(y1)), (int(x2), int(y2)), (0, 200, 80), 2)
                cv2.putText(
                    vis,
                    f"person {conf:.2f}",
                    (int(x1), max(20, int(y1) - 6)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 200, 80),
                    1,
                )
        lbl = RAW_LBL / f"{img_path.stem}.txt"
        lbl.write_text(("\n".join(lines) + ("\n" if lines else "")), encoding="utf-8")
        with CONF_JSONL.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"image": img_path.name, "confidences": confs, "n": len(confs)}) + "\n")
        if lines:
            stats["with_boxes"] += 1
            stats["boxes"] += len(lines)
            cv2.imwrite(str(RAW_PREV / img_path.name), vis, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    return stats


def quality_filter() -> dict:
    """Remove empty / corrupt / duplicate content hashes / bad labels."""
    report = {
        "images_before": 0,
        "removed_empty": 0,
        "removed_corrupt": 0,
        "removed_duplicate": 0,
        "removed_bad_label": 0,
        "images_after": 0,
        "total_boxes": 0,
        "conf_mean": 0.0,
    }
    images = sorted(RAW_IMG.glob("*.jpg"))
    report["images_before"] = len(images)
    hashes: dict[str, Path] = {}
    confs: list[float] = []
    if CONF_JSONL.is_file():
        for line in CONF_JSONL.read_text(encoding="utf-8").splitlines():
            if line.strip():
                confs.extend(json.loads(line).get("confidences") or [])

    for img in images:
        data = img.read_bytes()
        if len(data) < 100:
            img.unlink(missing_ok=True)
            (RAW_LBL / f"{img.stem}.txt").unlink(missing_ok=True)
            report["removed_corrupt"] += 1
            continue
        digest = hashlib.md5(data).hexdigest()
        if digest in hashes:
            img.unlink(missing_ok=True)
            (RAW_LBL / f"{img.stem}.txt").unlink(missing_ok=True)
            report["removed_duplicate"] += 1
            continue
        hashes[digest] = img
        frame = cv2.imread(str(img))
        if frame is None:
            img.unlink(missing_ok=True)
            (RAW_LBL / f"{img.stem}.txt").unlink(missing_ok=True)
            report["removed_corrupt"] += 1
            continue
        lbl = RAW_LBL / f"{img.stem}.txt"
        text = lbl.read_text(encoding="utf-8").strip() if lbl.is_file() else ""
        if not text:
            img.unlink(missing_ok=True)
            lbl.unlink(missing_ok=True)
            (RAW_PREV / img.name).unlink(missing_ok=True)
            report["removed_empty"] += 1
            continue
        bad = False
        n_boxes = 0
        for line in text.splitlines():
            parts = line.split()
            if len(parts) != 5:
                bad = True
                break
            try:
                cls = int(float(parts[0]))
                vals = [float(x) for x in parts[1:]]
            except ValueError:
                bad = True
                break
            if cls != 0 or any(v < 0 or v > 1 for v in vals) or vals[2] * vals[3] < MIN_BOX_AREA:
                bad = True
                break
            n_boxes += 1
        if bad or n_boxes == 0:
            img.unlink(missing_ok=True)
            lbl.unlink(missing_ok=True)
            report["removed_bad_label"] += 1
            continue
        report["total_boxes"] += n_boxes

    report["images_after"] = len(list(RAW_IMG.glob("*.jpg")))
    report["conf_mean"] = float(sum(confs) / len(confs)) if confs else 0.0
    return report


def split_dataset(seed: int = 42) -> dict:
    images = sorted(RAW_IMG.glob("*.jpg"))
    random.Random(seed).shuffle(images)
    n = len(images)
    n_train = int(n * 0.7)
    n_val = int(n * 0.2)
    splits = {
        "train": images[:n_train],
        "val": images[n_train : n_train + n_val],
        "test": images[n_train + n_val :],
    }
    for split, files in splits.items():
        idir = SPLIT / "images" / split
        ldir = SPLIT / "labels" / split
        idir.mkdir(parents=True, exist_ok=True)
        ldir.mkdir(parents=True, exist_ok=True)
        for img in files:
            shutil.copy2(img, idir / img.name)
            lbl = RAW_LBL / f"{img.stem}.txt"
            if lbl.is_file():
                shutil.copy2(lbl, ldir / lbl.name)
    return {k: len(v) for k, v in splits.items()}


def _aug_ops(frame: np.ndarray) -> list[tuple[str, np.ndarray]]:
    out: list[tuple[str, np.ndarray]] = []
    # brightness
    out.append(("bright", cv2.convertScaleAbs(frame, alpha=1.0, beta=35)))
    out.append(("dark", cv2.convertScaleAbs(frame, alpha=1.0, beta=-40)))
    # contrast
    out.append(("contrast", cv2.convertScaleAbs(frame, alpha=1.4, beta=0)))
    # gamma (low light)
    gamma = 1.8
    table = np.array([((i / 255.0) ** gamma) * 255 for i in range(256)]).astype("uint8")
    out.append(("gamma", cv2.LUT(frame, table)))
    # motion blur
    k = np.zeros((9, 9))
    k[4, :] = 1 / 9
    out.append(("mblur", cv2.filter2D(frame, -1, k)))
    # gaussian noise
    noise = np.random.normal(0, 12, frame.shape).astype(np.float32)
    noisy = np.clip(frame.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    out.append(("noise", noisy))
    # jpeg compression artifact
    ok, enc = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 28])
    if ok:
        out.append(("jpeg", cv2.imdecode(enc, cv2.IMREAD_COLOR)))
    return out


def augment(max_per_image: int = 3) -> int:
    """Photometric augs only — labels copied unchanged. Originals untouched."""
    AUG_IMG.mkdir(parents=True, exist_ok=True)
    AUG_LBL.mkdir(parents=True, exist_ok=True)
    count = 0
    for img_path in sorted(RAW_IMG.glob("*.jpg")):
        frame = cv2.imread(str(img_path))
        if frame is None:
            continue
        lbl = RAW_LBL / f"{img_path.stem}.txt"
        if not lbl.is_file():
            continue
        label_text = lbl.read_text(encoding="utf-8")
        ops = _aug_ops(frame)
        random.Random(img_path.stem).shuffle(ops)
        for name, aug in ops[:max_per_image]:
            out_name = f"{img_path.stem}__{name}.jpg"
            cv2.imwrite(str(AUG_IMG / out_name), aug, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
            (AUG_LBL / f"{img_path.stem}__{name}.txt").write_text(label_text, encoding="utf-8")
            count += 1
    # also copy augs into train split (optional enrichment)
    train_img = SPLIT / "images" / "train"
    train_lbl = SPLIT / "labels" / "train"
    if train_img.is_dir():
        for p in AUG_IMG.glob("*.jpg"):
            shutil.copy2(p, train_img / p.name)
            lp = AUG_LBL / f"{p.stem}.txt"
            if lp.is_file():
                shutil.copy2(lp, train_lbl / lp.name)
    return count


def contact_sheet(n: int = 12) -> Path | None:
    previews = sorted(RAW_PREV.glob("*.jpg"))
    if not previews:
        return None
    sample = previews[:n] if len(previews) <= n else random.Random(0).sample(previews, n)
    tiles = []
    for p in sample:
        im = cv2.imread(str(p))
        if im is None:
            continue
        tiles.append(cv2.resize(im, (320, 180)))
    if not tiles:
        return None
    cols = 4
    rows = (len(tiles) + cols - 1) // cols
    while len(tiles) < rows * cols:
        tiles.append(np.zeros_like(tiles[0]))
    grid = []
    for r in range(rows):
        grid.append(np.hstack(tiles[r * cols : (r + 1) * cols]))
    sheet = np.vstack(grid)
    dest = OUT / "validation_contact_sheet.jpg"
    cv2.imwrite(str(dest), sheet)
    return dest


def write_docs(
    videos: list[VideoInfo],
    extract_stats: dict,
    ann_stats: dict,
    quality: dict,
    split_counts: dict,
    aug_count: int,
    model_path: Path,
) -> None:
    yaml_path = OUT / "dataset.yaml"
    yaml_path.write_text(
        f"""# GuardianAI synthetic CCTV person dataset
path: {SPLIT.as_posix()}
train: images/train
val: images/val
test: images/test

names:
  0: person
""",
        encoding="utf-8",
    )

    # symlink-friendly copy for training/configs pointer
    (OUT / "README.md").write_text(
        f"""# GuardianAI Synthetic CCTV Dataset

Auto-built from synthetic hostel corridor videos.

- **Detector used for labels:** `{model_path.relative_to(ROOT)}` (class 0 `item` → `person`)
- **YOLO root:** `yolo/` (train/val/test)
- **Raw frames:** `raw/images` + `raw/labels`
- **Augmented:** `augmented/` (photometric only; originals preserved)
- **Do not train until human spot-check** of `raw/previews/` and `validation_contact_sheet.jpg`

```powershell
python -m training.validate_dataset --data datasets/guardian_synthetic/dataset.yaml
python -m training.train --data datasets/guardian_synthetic/dataset.yaml --dry-run
```
""",
        encoding="utf-8",
    )

    (OUT / "dataset_statistics.md").write_text(
        f"""# Dataset statistics

| Metric | Value |
|--------|-------|
| Videos | {len(videos)} |
| Frames considered | {extract_stats.get('considered', 0)} |
| Frames saved (raw) | {extract_stats.get('saved', 0)} |
| Blur rejected | {extract_stats.get('blur', 0)} |
| Dup rejected | {extract_stats.get('dup', 0)} |
| Annotated images (pre-QC) | {ann_stats.get('images', 0)} |
| Boxes (pre-QC) | {ann_stats.get('boxes', 0)} |
| After QC images | {quality.get('images_after', 0)} |
| After QC boxes | {quality.get('total_boxes', 0)} |
| Mean conf | {quality.get('conf_mean', 0):.3f} |
| Split train/val/test | {split_counts.get('train', 0)} / {split_counts.get('val', 0)} / {split_counts.get('test', 0)} |
| Augmented images | {aug_count} |
| Class | person (0) only |
""",
        encoding="utf-8",
    )

    (OUT / "quality_report.md").write_text(
        f"""# Quality report

Generated: {datetime.now(timezone.utc).isoformat()}

## Extraction
- considered: {extract_stats}
## Annotation
- {ann_stats}
## QC removals
- {quality}

## Policies
- Empty label images removed
- MD5 duplicate images removed
- Boxes with area < {MIN_BOX_AREA} dropped
- Blur (Laplacian < {MIN_LAPLACIAN}) skipped at extract
- Near-duplicate frames (hist corr ≥ {DUP_HIST_CORR}) skipped
""",
        encoding="utf-8",
    )

    sheet = contact_sheet()
    (OUT / "validation_report.md").write_text(
        f"""# Validation report

- Contact sheet: `{sheet.name if sheet else 'none'}`
- Spot-check `raw/previews/` for box alignment
- Class IDs must be `0` (person) only
- Missing labels: removed in QC (empty images deleted)

## Sample checklist
- [ ] Dark corridor boxes on body (not walls)
- [ ] Multi-person frames have multiple boxes
- [ ] No face-ID / name labels
""",
        encoding="utf-8",
    )

    total_jpg = len(list((SPLIT / "images").rglob("*.jpg"))) if (SPLIT / "images").exists() else 0
    size_mb = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file()) / (1024 * 1024)
    (ROOT / "docs" / "DATASET.md").write_text(
        f"""# DATASET.md — GuardianAI

## Summary

| Item | Value |
|------|-------|
| Total videos | {len(videos)} |
| Frames extracted (pre-QC) | {extract_stats.get('saved', 0)} |
| Images after QC | {quality.get('images_after', 0)} |
| Annotations (boxes) | {quality.get('total_boxes', 0)} |
| Train/Val/Test | {split_counts.get('train', 0)} / {split_counts.get('val', 0)} / {split_counts.get('test', 0)} |
| Augmented extras | {aug_count} |
| YOLO images on disk (incl. aug in train) | {total_jpg} |
| Dataset folder size | {size_mb:.1f} MB |
| Model used | `{model_path.relative_to(ROOT)}` |
| Classes | person (0) |

## Location

`datasets/guardian_synthetic/`

## Known issues

- Auto-labels inherit detector errors (custom model class name is `item`).
- Synthetic domain ≠ real hostel CCTV; mix real frames before production deploy.
- Human review of previews is still required.

## Recommendations

1. Spot-check contact sheet + 20 random previews.
2. Add real hostel stills into `datasets/hostel_person/`.
3. Fine-tune with `training/configs/guardian_transfer.yaml` when ready (`--dry-run` first).
""",
        encoding="utf-8",
    )

    (ROOT / "training" / "configs" / "guardian_transfer.yaml").write_text(
        f"""# Transfer learning config — DO NOT auto-start long runs
model: models/custom/yolov8s_v4_production.pt
data: datasets/guardian_synthetic/dataset.yaml
epochs: 40
imgsz: 640
batch: 8
patience: 15
device: 0
workers: 4
optimizer: AdamW
lr0: 0.0005
lrf: 0.01
pretrained: true
project: runs/detect
name: guardian_synthetic_ft
exist_ok: true
# Est. VRAM: ~4–6 GB at batch 8 imgsz 640 (YOLOv8s)
# Est. time: ~20–60 min on mid GPU for ~{quality.get('images_after', 0)} base images + augs
""",
        encoding="utf-8",
    )


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--model", default=str(DEFAULT_MODEL))
    p.add_argument("--skip-augment", action="store_true")
    p.add_argument("--seed", type=int, default=42)
    args = p.parse_args()
    model_path = Path(args.model)
    if not model_path.is_file():
        print(f"error: model not found: {model_path}", file=sys.stderr)
        return 2

    print("=== PHASE 2 inventory ===")
    paths = discover_videos(ROOT)
    videos = [probe_video(v) for v in paths]
    inv = OUT / "dataset_inventory.csv"
    write_inventory(videos, inv)
    print(f"videos={len(videos)} → {inv}")

    if OUT.exists():
        # clean previous build outputs but keep structure
        for sub in ("raw", "yolo", "augmented"):
            d = OUT / sub
            if d.exists():
                shutil.rmtree(d)

    print("=== PHASE 3 extract ===")
    images, extract_stats = extract_frames(videos)
    print(extract_stats, f"saved={len(images)}")

    print("=== PHASE 4 annotate ===")
    ann_stats = annotate(images, model_path)
    print(ann_stats)

    print("=== PHASE 5 quality ===")
    quality = quality_filter()
    print(quality)

    print("=== PHASE 6 organize ===")
    split_counts = split_dataset(seed=args.seed)
    print(split_counts)

    aug_count = 0
    if not args.skip_augment:
        print("=== PHASE 7 augment ===")
        aug_count = augment()
        print(f"augmented={aug_count}")

    print("=== PHASE 8–10 docs ===")
    write_docs(videos, extract_stats, ann_stats, quality, split_counts, aug_count, model_path)

    # validate via existing script
    from training.validate_dataset import main as validate_main

    prev = sys.argv
    try:
        sys.argv = ["validate_dataset", "--data", str(OUT / "dataset.yaml")]
        code = validate_main()
    finally:
        sys.argv = prev
    print("validate exit", code)
    print("DONE →", OUT)
    return 0 if code == 0 else code


if __name__ == "__main__":
    raise SystemExit(main())
