# Custom GuardianAI detector weights

Place production weights here:

- `yolov8s_v4_production.pt` (preferred)
- Fallback used by backend if missing: `models/yolov8n.pt`

Weights are **gitignored** (`*.pt`). Obtain from the team / training run — do not commit `.pt` files.

Class `0` may be named `item` in custom checkpoints; runtime treats it as person detection for the hostel pipeline.
