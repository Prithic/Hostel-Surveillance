# Hackathon Readiness — GuardianAI v1.0.0 Final

Companion to `GO_NO_GO_DECISION.md` (Conditional GO).

## Demo day checklist

- [ ] `pip install -r requirements.txt`
- [ ] Weights present (`models/yolov8n.pt` or custom)
- [ ] Zones match camera (`datasets/zones/default_zones.json`)
- [ ] `uvicorn backend.main:app --host 127.0.0.1 --port 8000`
- [ ] `cd frontend && npm run dev` → :5173
- [ ] Admin login → **Security (GuardianAI)**
- [ ] Stream LIVE; walk restricted zone; incident + Resolve
- [ ] Do not demo face recognition / ERP fake stats as GuardianAI
- [ ] Tk bot = FAQ only; incident Q&A via Security list or `/api/chat`

## Ports

| Service | Port |
|---------|------|
| GuardianAI FastAPI | 8000 |
| Trinity Engine UI | 5173 |
| Trinity API (optional) | 5000 |

## Credentials (demo)

| System | Creds |
|--------|--------|
| Trinity admin UI gate | `@srishakthi.ac.in` + password ≥ 8 (mock if Node down) |
| GuardianAI API (auto on Security page) | `admin@guardian.ai` / `Warden@2026` |
