# DATASET.md — GuardianAI

## Summary

| Item | Value |
|------|-------|
| Total videos | 4 |
| Frames extracted (pre-QC) | 65 |
| Images after QC | 18 |
| Annotations (boxes) | 24 |
| Train/Val/Test | 12 / 3 / 3 |
| Augmented extras | 54 |
| YOLO images on disk (incl. aug in train) | 72 |
| Dataset folder size | 16.8 MB |
| Model used | `models\custom\yolov8s_v4_production.pt` |
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
