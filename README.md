# GuardianAI

Privacy-first **event-driven** AI hostel security monitoring for HackSprint '26.

> Help wardens detect, understand, prioritize and respond to security incidents faster — **without facial recognition or identity tracking.**

## Architecture

```
Camera / Video
    ↓
YOLO (YOLOv8) + ByteTrack
    ↓
Zone Manager (restricted polygons)
    ↓
Rule Engine (4 security rules)
    ↓
Incident Engine (dedup, cooldown, history)
    ↓
Alert Engine → WebSocket → Dashboard
    ↓
Chatbot (/api/chat) → Warden Decision
```

## Quick Start

```powershell
# 1. Install backend dependencies
pip install -r requirements.txt

# 2. Start backend (webcam)
uvicorn backend.main:app --host 127.0.0.1 --port 8000

# 3. Or use a video file instead of a webcam
$env:GUARDIAN_SOURCE="hostel footage 1.mp4"
uvicorn backend.main:app --host 127.0.0.1 --port 8000

# 4. Start frontend
cd frontend
copy .env.example .env   # edit credentials if needed
npm install
npm run dev
```

Open `http://localhost:5173` → Login → Sidebar: **AI Analytics**, **AI Assistant**, **Admin access → Security Dashboard**

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `GUARDIAN_SOURCE` | `0` | Webcam index, file path, or RTSP URL |
| `GUARDIAN_CAMERA_ID` | `webcam-0` | Camera label shown in dashboard |
| `GUARDIAN_DEVICE` | `cpu` | `cpu`, `cuda`, or `0` |
| `GUARDIAN_ENABLE_CAMERA` | `1` | Set to `0` to disable pipeline (API-only mode) |

Frontend env (`frontend/.env`):

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `` (same origin) | Backend URL |
| `VITE_ADMIN_EMAIL` | `admin@guardian.ai` | Security dashboard login |
| `VITE_ADMIN_PASSWORD` | — | Security dashboard password |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | System health + pipeline status |
| GET | `/api/status` | Camera + FPS + person count |
| GET | `/api/incidents` | Incident history (deduped) |
| PATCH | `/api/incidents/{incident_id}` | Resolve/close an incident |
| GET | `/api/alerts` | Recent alert buffer |
| GET | `/api/analytics` | Counts by severity + type |
| GET | `/api/config` | Runtime config (thresholds) |
| GET | `/api/stream` | MJPEG live stream |
| POST | `/api/chat` | AI warden chatbot |
| WS | `/ws/alerts` | Real-time incident push |

## Security Rules

| Rule | Trigger | Severity |
|---|---|---|
| Restricted Zone Entry | Person enters restricted polygon | HIGH |
| Crowd Detection | Person count ≥ threshold | MEDIUM/HIGH |
| Unauthorized Night Movement | Person present during night hours | HIGH |
| Tailgating | 2+ people enter restricted zone within 3s | CRITICAL |

## Privacy Guarantees

- No facial recognition
- No student identity stored
- Anonymous track IDs only (reset on pipeline restart)
- No biometric data of any kind

## Run Tests

```powershell
python -m ai.test_integration
```

## Guidelines

Development follows [AGENTS.md](AGENTS.md) (Ponytail — lazy senior dev mode).
