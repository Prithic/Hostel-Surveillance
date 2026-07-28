# GuardianAI — HackSprint '26

**Privacy-first hostel CCTV security for wardens**

> Detect suspicious behaviour (not faces), raise actionable incidents, prioritize, and resolve — without facial recognition.

---

## Product surface (honest)

| Route | What it is |
|-------|------------|
| `/` | Trinity Engine landing |
| `/login` | Warden sign-in → Guardian API |
| `/dashboard` | **Trinity Engine dashboard UI** (hostel overview shell + link to live security) |
| `/security` | GuardianAI command center: live feed, status, incidents, resolve, WebSocket alerts |
| `/analytics` | Live incident analytics from SQLite + pipeline |
| `/config` | Read-only runtime configuration |

Floating **Warden assistant** answers only from live incidents / status / config (`POST /api/chat`).

Hostel ERP sidebar pages (attendance, SOS, mess, …) were removed from navigation so we do not fake those workflows. The **Dashboard look your team loved is back** as the home screen after login.

See `PRODUCT_AUDIT.md` and `FEATURE_MATRIX.md`.

---

## Architecture

```
Camera / video file
  → YOLO + ByteTrack → zones → rules
  → SQLite incidents + alerts
  → FastAPI (REST + MJPEG + WebSocket)
  → Warden console
```

---

## Quick start (Windows PowerShell)

### Prerequisites
- Python 3.10+, Node.js 18+
- Webcam or demo `.mp4`
- Weights under `models/` (see `models/custom/README.md`)

### 1) Guardian API (`:8000`)

```powershell
pip install -r requirements.txt
copy .env.example .env
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Health: http://127.0.0.1:8000/health

Default warden credentials are set in server env (see `.env.example`). Change them for any shared demo.

### 2) Frontend (`:5173`)

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open http://127.0.0.1:5173 → **Warden login** → command center.

---

## Demo script

1. Start API + frontend.
2. Sign in with warden credentials.
3. Confirm LIVE stream, FPS, people count.
4. Trigger a restricted-zone / rule event (walk into polygon or use footage).
5. Watch incident appear (WebSocket) → **Resolve**.
6. Ask the Warden assistant: “What happened recently?” / “Camera status” / “Summary”.

---

## Repository layout

| Path | Role |
|------|------|
| `ai/` | Detection, tracking, zones, rules, pipeline |
| `backend/` | FastAPI auth, SQLite, stream, REST, WebSocket |
| `frontend/` | Warden console only |
| `datasets/zones/` | Zone polygons |
| `models/` | Weights (gitignored) |
| `trinity-api/` | **Deferred** — not part of the GuardianAI product UI |

---

## Behaviour rules

| Rule | Trigger |
|------|---------|
| Restricted zone entry | Person in restricted polygon |
| Crowd | Person count ≥ `GUARDIAN_CROWD` |
| Night movement | Person during night window |
| Tailgating | Multiple restricted entries in a short window |

---

## Known honest limits

- MJPEG `/api/stream` is open (needed for `<img>` tags on LAN demos).
- Chat is store-backed keyword Q&A, not a general LLM.
- Config UI is read-only; change env and restart the API.
