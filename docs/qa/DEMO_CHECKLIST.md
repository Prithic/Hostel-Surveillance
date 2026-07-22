# DEMO_CHECKLIST.md

## T-30 min

- [ ] `models/yolov8n.pt` or `models/custom/yolov8s_v4_production.pt` present  
- [ ] Webcam index known (`GUARDIAN_SOURCE=0`)  
- [ ] Zones visible in `demo_mvp` (top-right red polygon)  
- [ ] `pip install -r requirements.txt`  
- [ ] `cd frontend && npm install`  

## Start

```powershell
$env:GUARDIAN_ENABLE_CAMERA="1"
$env:GUARDIAN_SOURCE="0"
$env:GUARDIAN_DEVICE="cpu"   # or 0 for CUDA
uvicorn backend.main:app --host 127.0.0.1 --port 8000
# other terminal
cd frontend; npm run dev
```

Optional AI-only: `python -m ai.demo_mvp`

## Live script (90s)

1. Open `/security` — show live MJPEG + FPS/people  
2. Walk into red restricted zone — one HIGH alert  
3. Open `/chatbot` — “What happened?” / “Current alerts”  
4. Say privacy line: no faces, track IDs only  
5. Backup: `demo_track` if dashboard camera fails  

## Abort criteria

- Camera offline >15s → switch to `demo_mvp` file/webcam window  
- Chat invents incidents → stop chatbot, show `/api/incidents` JSON  

## Do not open

- Attendance / face-themed pages during judging  
