# GuardianAI

Privacy-first **event-based** hostel security monitoring for HACKSPRINT '26.

Detect incidents early. Reduce response time. Assist wardens. **No facial recognition. No student identity.**

## Pipeline

```
Camera / Video → YOLO → ByteTrack → Zones → Rules → Incidents → Alerts
                                              ↓
                                    FastAPI + WebSocket → Dashboard + Chatbot
```

## Quick start

```powershell
# AI demos
python -m ai.demo
python -m ai.demo_track
python -m ai.demo_mvp

# API (camera on)
uvicorn backend.main:app --host 127.0.0.1 --port 8000

# Dashboard
cd frontend
npm install
npm run dev
```

Open `/security` and `/chatbot`. See `docs/runbook.md`.

## What we detect (events, not people)

- Restricted zone entry
- Crowd threshold
- Unauthorized night movement
- Tailgating (zone entry burst)

## Privacy

Person boxes and anonymous track IDs only. No attendance. No face ID.

## Guidelines

Development follows [AGENTS.md](AGENTS.md) (Ponytail).
