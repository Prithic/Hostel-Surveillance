# GuardianAI — HackSprint '26

**Team Trinity** · Privacy-first hostel CCTV security

> Wardens cannot watch every camera continuously. GuardianAI detects **suspicious behaviour** (not faces), raises actionable incidents, and helps wardens respond faster — **without facial recognition or identity tracking.**

---

## What to review (judges)

| Priority | Where | What you will see |
|----------|--------|-------------------|
| 1 | **Security (GuardianAI)** → `/security` | Live annotated CCTV, incidents, resolve |
| 2 | Backend `http://127.0.0.1:8000/health` | Camera / AI / DB status |
| 3 | Pipeline | YOLO → ByteTrack → zones → rules → incidents |
| 4 | Trinity Engine UI | Hostel OS shell (ERP pages); Security is the AI core |

**Privacy:** no face recognition, no student IDs, anonymous track IDs only.

**Floating chat (bottom-right):** hostel FAQ assistant (branch `tk`).  
**Incident Q&A:** use the Security incident list, or `POST /api/chat` on the Python API (store-backed).

---

## Architecture

```
Camera / video file
    → YOLO (person detect) + ByteTrack
    → Zone evaluation (polygons)
    → Rule engine (restricted / crowd / night / tailgating)
    → Incident store (SQLite) + alerts
    → FastAPI REST + MJPEG + WebSocket
    → Trinity UI → Security Command Center → Warden action
```

---

## Quick start (Windows PowerShell)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Webcam **or** a demo `.mp4` (place at repo root or set path)
- Model weights (gitignored): copy `yolov8n.pt` and/or `yolov8s_v4_production.pt` into `models/` / `models/custom/` — see `models/custom/README.md`

### 1) Python API (GuardianAI)

```powershell
pip install -r requirements.txt
copy .env.example .env

# Webcam (default)
uvicorn backend.main:app --host 127.0.0.1 --port 8000

# Or video file
$env:GUARDIAN_SOURCE="hostel footage 1.mp4"
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Health check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 2) Frontend (Trinity Engine + Security)

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173)

1. **Admin** → `/admin-login`  
   - Email: any `@srishakthi.ac.in`  
   - Password: 8+ characters (mock login works if Trinity Node API is not running)
2. You land on **Security (GuardianAI)** — live stream + incidents.
3. Sidebar → **Security (GuardianAI)** anytime.

Guardian API auto-login on that page uses (`frontend/.env.example`):

- `admin@guardian.ai` / `Warden@2026`

### 3) Optional — Trinity ERP API

```powershell
cd trinity-api
copy .env.example .env
npm install
npm run seed
npm run dev
```

Port **5000**. Not required for the GuardianAI security demo.

---

## Demo script (5 minutes)

1. Start API + frontend (above).
2. Open Security — confirm **LIVE** stream and FPS/people stats.
3. Walk into a **restricted zone** (or play footage that crosses the polygon in `datasets/zones/default_zones.json`).
4. Watch an incident appear → click **Resolve**.
5. Optional:  
   `Invoke-RestMethod -Method POST http://127.0.0.1:8000/api/auth/login -ContentType application/json -Body '{"email":"admin@guardian.ai","password":"Warden@2026"}'`  
   then call `/api/chat` with `"What happened recently?"`
6. Do **not** treat ERP Attendance / mess pages as the AI product.

---

## Repository layout

| Path | Role |
|------|------|
| `ai/` | Detection, tracking, zones, rules, incidents, pipeline |
| `backend/` | FastAPI — auth, SQLite store, stream, REST, WebSocket |
| `frontend/` | Trinity Engine UI + Guardian Security page |
| `trinity-api/` | Optional Express/Mongo hostel ERP API |
| `datasets/zones/` | Restricted-zone polygons |
| `models/` | Weights (local only; `*.pt` gitignored) |
| `docs/` | Runbooks / chatbot notes |
| `GO_NO_GO_DECISION.md` | Release decision & known limits |
| `HACKATHON_READINESS.md` | Demo checklist |

---

## Behaviour rules

| Rule | Trigger | Severity |
|------|---------|----------|
| Restricted zone entry | Person enters restricted polygon | HIGH |
| Crowd | Person count ≥ threshold (default 5) | MEDIUM/HIGH |
| Night movement | Person present in night window (default 22:00–05:00) | HIGH |
| Tailgating | 2+ entries to restricted zone within ~3s | CRITICAL |

Tune via env: `GUARDIAN_CROWD`, `GUARDIAN_NIGHT_START`, `GUARDIAN_NIGHT_END`, `GUARDIAN_CONF`.

---

## Main API (port 8000)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/health` | No | System health |
| GET | `/api/stream` | No* | MJPEG live feed (*open for `<img>` demo) |
| POST | `/api/auth/login` | No | Warden session |
| GET | `/api/incidents` | Yes | Incident list |
| PATCH | `/api/incidents/{id}` | Yes | Resolve |
| GET | `/api/analytics` | Yes | Counts |
| POST | `/api/chat` | Yes | Store-backed warden Q&A |
| WS | `/ws/alerts` | Token | Live alert push |

---

## Tests

```powershell
python -m ai.test_integration
```

---

## Privacy & ethics

- No facial recognition  
- No biometric storage  
- No attendance-by-face claims in the GuardianAI product path  
- Events and anonymous tracks only  

---

## Docs for deeper review

- [GO_NO_GO_DECISION.md](GO_NO_GO_DECISION.md) — conditional GO, demo conditions  
- [HACKATHON_READINESS.md](HACKATHON_READINESS.md) — day-of checklist  
- [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) — known MVP limits  
- [AGENTS.md](AGENTS.md) — engineering rules (Ponytail)

---

HackSprint '26 · Team Trinity · GuardianAI v1.0.0
