# Trinity Engine + GuardianAI

**Hostel OS + CCTV security** — pull, setup, run. Multi-user roles. Live SQLite hostel ops. Real SOS → critical incidents.

---

## Pull and run (2 steps)

### Windows (PowerShell)

```powershell
git clone https://github.com/Prithic/Hostel-Surveillance.git
cd Hostel-Surveillance
git checkout feat/real-product

powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

No webcam? Use `.\scripts\start.ps1 -NoCamera` (hostel ERP still works).

### macOS / Linux

```bash
git clone https://github.com/Prithic/Hostel-Surveillance.git
cd Hostel-Surveillance
git checkout feat/real-product

chmod +x scripts/*.sh
./scripts/setup.sh
./scripts/start.sh
```

No webcam? `./scripts/start.sh --no-camera`

Open **http://127.0.0.1:5173/login**

---

## Login accounts (created on first API start)

| Role | Email | Password |
|------|-------|----------|
| **Warden** | `admin@guardian.ai` | `Warden@2026` |
| **Student** | `student@hostel.local` | `Student@2026` |
| **Laundry Staff** | `laundry@hostel.local` | `Laundry@2026` |

Each role gets a filtered sidebar + matching API permissions.

---

## What works

| Area | Behavior |
|------|----------|
| **Security** (Warden) | Live MJPEG, incidents, resolve, WebSocket alerts, analytics, editable thresholds |
| **SOS** (all roles) | Persists event + critical `emergency_sos` incident + in-app notification + WS |
| **Hostel ERP** | Attendance, leave, complaints, mess, laundry, visitors, notices, fees, inspection, inventory — mutations hit SQLite |
| **Chat** | Keyword Q&A over live incidents/status (not an LLM) |

See `FEATURE_MATRIX.md` for the full map.

---

## Manual start (if you skip scripts)

**API** (`:8000`):

```powershell
pip install -r requirements.txt
copy .env.example .env
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**Frontend** (`:5173`):

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Health: http://127.0.0.1:8000/health

---

## Prerequisites

- Python **3.10+**
- Node.js **18+**
- Webcam optional (first YOLO run auto-downloads `yolov8n.pt` via Ultralytics)

Weights are gitignored. Default model is COCO `yolov8n` (good recall on webcam). Optional custom hostel weights: set `GUARDIAN_MODEL` in `.env` (see `models/custom/README.md`).

---

## Architecture

```
Webcam / video
  → YOLO + ByteTrack → zones → rules
  → SQLite (incidents + hostel_state + users)
  → FastAPI (:8000) REST + MJPEG + WebSocket
  → Trinity console (:5173)
```

`trinity-api/` (Nest/Mongo) is **not** required for this product.

---

## Demo checklist

1. Login as **Warden** → Security: stream + FPS + people.
2. Login as **Student** → apply leave, raise complaint, trigger SOS (no Security nav).
3. Login as **Laundry** → advance laundry status / claims (no leave grant / config).
4. Warden → resolve SOS incident; check topbar notifications.

---

## Known limits (honest)

- MJPEG `/api/stream` is open (needed for `<img>` on LAN).
- Chat is store-backed keywords, not a general LLM.
- No real SMS/email gateway or payment processor.
- QR outpass is a digital pass UI, not a gate scanner.
