# Synthetic CCTV data (documentation only)

Use when real hostel footage is limited. **No generator code shipped yet** — this is the planned pipeline.

## Goals

- AI-generated corridor / gate scenes
- Synthetic frames with known person boxes
- Video augmentation (lighting, blur, compression)
- Frame extraction from MP4 → YOLO labels
- Optional auto-label assist (human review required)

## Planned flow

```
prompt / 3D scene → synthetic video
        ↓
frame extract (1–5 FPS)
        ↓
auto-label draft (YOLO pretrained) → human correct
        ↓
datasets/hostel_person/{images,labels}/{train,val}
        ↓
python -m training.validate_dataset
        ↓
python -m training.train
```

## Augmentations (real or synthetic)

| Op | Why |
|----|-----|
| Brightness / gamma | Day vs night hostel lighting |
| Motion blur | Walking subjects |
| H.264 re-encode | CCTV compression artifacts |
| Crop / letterbox | Different FOVs |

## Rules

1. Never train solely on synthetic — mix with real hostel frames.
2. Auto-labels must be reviewed before training.
3. No identity / face recognition labels.
4. Log synthetic vs real in filenames or a `manifest.csv` (`source=synthetic|real`).

## Next implementation (when requested)

- `training/extract_frames.py`
- `training/augment_video.py`
- `training/auto_label.py` (draft boxes only)
