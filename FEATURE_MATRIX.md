# FEATURE_MATRIX.md — GuardianAI + Trinity Engine console

**Date:** 2026-07-25  
**Product:** Warden console — live CCTV security + live hostel ops (SQLite).

## REAL

| Feature | Evidence |
|---------|----------|
| Warden login | Guardian `POST /api/auth/login` — `admin@guardian.ai` / `Warden@2026` |
| Full sidebar nav | All Trinity hostel pages restored in `App.jsx` + `Sidebar.jsx` |
| Hostel data store | `backend/hostel.py` → SQLite `hostel_state` via `/api/hostel/*` |
| Dashboard / rooms / notices / fees / mess / inventory / inspection | Read live from `/api/hostel/state` |
| Complaints create | `POST /api/hostel/append` |
| Leave apply + grant/deny | append + patch on `leaveRequests` |
| Visitors / Lost & Found report | append to live store |
| Laundry slot book | append `laundryTracking` |
| SOS | `POST /api/hostel/sos` → persists event + critical Guardian incident + WS |
| Security command center | stream, status, incidents, resolve, WebSocket |
| Analytics / Config | Guardian `/api/analytics`, `/api/config` |
| Warden assistant | `POST /api/chat` (live store only) |

## PARTIAL

| Feature | Limit |
|---------|-------|
| Attendance roster mark sheet | Toggle UI is local; attendance **log** rows come from live store |
| Mess meal-plan selector | Choice is local; menu + ratings chart are live |
| Laundry missing-claims board | Local list; bookings persist |
| MJPEG stream | Open (needed for `<img>`) |
| Chat | Keyword Q&A over live data, not an LLM |

## REMOVED

| Item | Reason |
|------|--------|
| Trinity Express mock login / `services/api.js` | Password theater |
| Tk FAQ chatbot | Not store-backed |
| Face-recognition attendance labels | False claim — seed uses QR/Manual |

## DEFERRED

| Item | Notes |
|------|-------|
| `trinity-api/` Mongo ERP | Not required; hostel state lives in Guardian SQLite |
| Auth on MJPEG | Signed URL / same-origin proxy later |

## How to run

1. `uvicorn backend.main:app --port 8000`
2. `cd frontend && npm run dev` → http://127.0.0.1:5173
3. Login → full nav is live against the same API
