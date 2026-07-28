# Custom detector weights (optional)

Default product path uses **COCO `yolov8n.pt`** (auto-downloaded by Ultralytics on first run).

To use hostel-trained weights instead:

1. Place `yolov8s_v4_production.pt` here
2. Set in `.env`: `GUARDIAN_MODEL=models/custom/yolov8s_v4_production.pt`

Weights are **gitignored** (`*.pt`) — do not commit them.
