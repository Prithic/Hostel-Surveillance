# Training pipeline

Reproducible YOLOv8s fine-tune path for GuardianAI.  
The Sprint 1 webcam demo (`python -m ai.demo` / `models/yolov8n.pt`) is **unchanged**.

## One-command fine-tune (when data is ready)

```powershell
cd D:\Hackathons\HACKSPRINT
python -m training.validate_dataset
python -m training.train
```

Dry-run (no training):

```powershell
python -m training.train --dry-run
```

Evaluate a checkpoint:

```powershell
python -m training.evaluate --weights runs/detect/hostel_person_yolov8s/weights/best.pt
```

## Commands

| Step | Command |
|------|---------|
| Download public COCO person sample | `python -m training.download_coco_person` |
| Full COCO person export (large) | `python -m training.download_coco_person --full` |
| Validate hostel dataset | `python -m training.validate_dataset` |
| Validate COCO export | `python -m training.validate_dataset --data datasets/coco_person.yaml` |
| Train YOLOv8s | `python -m training.train` |
| Train with overrides | `python -m training.train --data datasets/coco_person.yaml` |
| Evaluate | `python -m training.evaluate --weights path\to\best.pt` |

## Config

Hyperparameters: `training/configs/yolov8s_person.yaml`  
Active dataset: `datasets/data.yaml` → `datasets/hostel_person/`

After training, point a **new** detector at `runs/detect/…/best.pt` when you intentionally switch models. Do not overwrite the demo’s `yolov8n` path until you choose to.

## Recommended order

1. Label hostel images into `datasets/hostel_person/` (see `datasets/README.md`).
2. Optionally add a small COCO person sample for breadth.
3. `validate_dataset` → must print `OK`.
4. `train` once (GPU: set `device: 0` in the config yaml).
5. `evaluate` on val; only then wire weights into the live demo.

**Do not start a long train until validation passes and you have enough high-quality hostel labels.**
