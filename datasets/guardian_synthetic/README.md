# GuardianAI Synthetic CCTV Dataset

Auto-built from synthetic hostel corridor videos.

- **Detector used for labels:** `models\custom\yolov8s_v4_production.pt` (class 0 `item` → `person`)
- **YOLO root:** `yolo/` (train/val/test)
- **Raw frames:** `raw/images` + `raw/labels`
- **Augmented:** `augmented/` (photometric only; originals preserved)
- **Do not train until human spot-check** of `raw/previews/` and `validation_contact_sheet.jpg`

```powershell
python -m training.validate_dataset --data datasets/guardian_synthetic/dataset.yaml
python -m training.train --data datasets/guardian_synthetic/dataset.yaml --dry-run
```
