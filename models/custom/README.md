# Custom GuardianAI detector weights

Place production weights here:

- `yolov8s_v4_production.pt` — extracted from `YOLOv8s_v4_production_*.zip` at repo root

Weights are gitignored (`*.pt`). Keep the zip or restore from team storage.

Class 0 is named `item` in the checkpoint; dataset prep maps it to YOLO class `person`.
