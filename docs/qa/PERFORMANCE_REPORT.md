# PERFORMANCE_REPORT.md

## Measured (CPU, this machine)

| Path | Observation |
|------|-------------|
| Webcam detect demo | ~8–12 FPS (yolov8n CPU) earlier sprint |
| ByteTrack blank/webcam | ~10 FPS / 30 frames |
| Dataset annotate 65 frames | ~30–40s wall with custom YOLOv8s |
| FastAPI `/health` concurrent ×40 | all 200 |
| Chat `/api/chat` | <50ms keyword path |
| MJPEG `/api/stream` | continuous; **do not** `response.text` in tests (infinite) |

## Bottlenecks

1. **YOLO+ByteTrack on CPU** — dominant cost; demo risk if judges expect 30 FPS.
2. **Full-frame MJPEG encode every frame** — extra CPU; quality 70 JPEG.
3. **Dashboard polls every 2s + WS** — fine for hackathon; not scaled.

## Recommendations

- Demo with `GUARDIAN_DEVICE=0` (CUDA) if available.
- Prefer `demo_mvp` window for AI proof; dashboard for alerts/chat.
- Est. GPU YOLOv8s 640: ~25–40 FPS single cam (hardware dependent).
