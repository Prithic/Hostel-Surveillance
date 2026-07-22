# GuardianAI — runbook (review MVP)

## Demos (AI only)

```powershell
python -m ai.demo          # Sprint 1 detect
python -m ai.demo_track    # Sprint 2 ByteTrack
python -m ai.demo_mvp      # full pipeline overlay + console alerts
```

## Backend + dashboard

```powershell
pip install -r requirements.txt
$env:GUARDIAN_ENABLE_CAMERA="1"   # set 0 to API-only
uvicorn backend.main:app --host 127.0.0.1 --port 8000

cd frontend
npm install
npm run dev
```

Open: http://127.0.0.1:5173/security and /chatbot

## APIs

- `GET /health` / `GET /api/status`
- `GET /api/incidents` / `GET /api/alerts`
- `POST /api/chat` `{"message":"What happened?"}`
- `WS /ws/alerts`
