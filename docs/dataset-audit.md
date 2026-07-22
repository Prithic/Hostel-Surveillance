# Phase 1 — Dataset / Model Audit (GuardianAI)

Date: 2026-07-22

## Custom model (default for dataset prep)

| Field | Value |
|-------|--------|
| Archive | `YOLOv8s_v4_production_20260722-180642.zip` |
| Weights | `models/custom/yolov8s_v4_production.pt` (~89.6 MB) |
| Architecture | YOLOv8s detect |
| Class map | `{0: "item"}` → treat as **person** for hostel CCTV labels |
| Baseline (demo) | `models/yolov8n.pt` — leave Sprint demos unchanged |

## Existing training stack

- `training/train.py`, `evaluate.py`, `validate_dataset.py`
- `training/configs/yolov8s_person.yaml`
- `datasets/data.yaml` → `hostel_person/`

## Videos discovered

4× synthetic CCTV MP4 under `videos/synthetic/` (moved from repo root).

## Decision

Use **`models/custom/yolov8s_v4_production.pt`** as the auto-annotation detector.  
Map detections of class `0` → YOLO label class `0` (`person`) in the GuardianAI dataset.
