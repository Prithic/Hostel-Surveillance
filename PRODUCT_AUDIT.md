# PRODUCT_AUDIT.md — GuardianAI

**Date:** 2026-07-25  
**Mission:** Hostel security monitoring for wardens (detect → understand → prioritize → respond).  
**Rule:** Feature must be REAL for the security product, or removed from the UI.

## Legend

| Class | Meaning |
|-------|---------|
| REAL | Live backend + UI + live data |
| PARTIAL | Works with honest limits |
| MOCK | dummyData / local theater |
| BROKEN | Claims security/auth it does not deliver |
| ORPHAN | Code exists, unused by product UI |
| REMOVE | Does not serve security mission → strip from product |

---

## Inventory (pre-remediation)

| Feature | Owner | Backend | Frontend | Data source | Class | Recommendation |
|---------|-------|---------|----------|-------------|-------|----------------|
| Live CCTV stream | Guardian | `GET /api/stream` | Security | Pipeline JPEG | PARTIAL | Keep; document open MJPEG for `<img>` |
| Camera status / FPS / people | Guardian | `GET /api/status` | Security | Pipeline | REAL | Keep; WS + light poll |
| Incident list | Guardian | `GET /api/incidents` | Security | SQLite | REAL | Keep |
| Resolve incident | Guardian | `PATCH /api/incidents/{id}` | Security | SQLite + audit | REAL | Keep |
| Guardian login | Guardian | `POST /api/auth/login` | Security auto-login | In-memory sessions | BROKEN UX | Replace with explicit warden login; no baked SPA password |
| Guardian logout / me | Guardian | `/api/auth/logout`, `/me` | Unused | Sessions | ORPHAN | Wire |
| Analytics API | Guardian | `GET /api/analytics` | ERP Analytics (dummy) | SQLite + status | ORPHAN API / MOCK UI | New live Analytics page |
| Config API | Guardian | `GET /api/config` | None | Pipeline env | ORPHAN | New live Config page |
| Alerts API | Guardian | `GET /api/alerts` | None | AlertEngine | ORPHAN | Merge into Security via WS |
| WebSocket alerts | Guardian | `WS /ws/alerts` | None | AlertEngine | ORPHAN | Wire to Security |
| Chat API | Guardian | `POST /api/chat` | Tk FAQ widget | Live store | ORPHAN / MOCK UI | Replace Tk with store-backed Warden Assistant |
| Restricted / crowd / night / tailgate rules | AI | pipeline | via incidents | Live | REAL | Keep |
| Trinity student login | Trinity | `:5000` passwordless | Login.jsx + mock fallback | Mongo/mock | BROKEN | REMOVE from product |
| Trinity admin login | Trinity | `:5000` passwordless | AdminLogin + mock | Mongo/mock | BROKEN | REMOVE; use Guardian auth |
| Hostel Dashboard | ERP | unused `/api/data` | Dashboard.jsx | dummyData | MOCK | REMOVE |
| Room / Attendance / Leave / Notices / Fees | ERP | unused | pages | dummyData | MOCK | REMOVE |
| Complaints / Mess / Laundry / L&F / Visitors | ERP | unused | pages | dummyData | MOCK | REMOVE |
| SOS | ERP | none | SOS.jsx | setTimeout lie | BROKEN | REMOVE |
| Inspection / Inventory / Settings | ERP | none | pages | dummyData | MOCK | REMOVE |
| ERP Analytics charts | ERP | none | Analytics.jsx | dummyData | MOCK | REPLACE with Guardian analytics |
| Command palette / notif center / floating admin bar | ERP | none | components | hardcoded | MOCK | REMOVE |
| Topbar “Aarav” identity | ERP | none | Topbar | dummyData | MOCK | REPLACE with warden email from `/me` |
| Tk chatbot FAQ | tk | none | TkChatbot | hardcoded FAQ | MOCK | REMOVE |
| trinity-api Express | Trinity | `:5000` | unused by security | seed/Mongo | ORPHAN | DEFER out of product surface |
| Face recognition (Attendance copy) | ERP | none | dummy rows | fake | BROKEN claim | REMOVE with Attendance |

---

## Product surface (target)

| Route | Purpose | Backend |
|-------|---------|---------|
| `/` | Honest landing | static |
| `/login` | Warden sign-in | Guardian auth |
| `/security` | Command center | status, stream, incidents, WS |
| `/analytics` | Incident analytics | `/api/analytics` |
| `/config` | Runtime thresholds (read-only) | `/api/config` |

All other former Trinity ERP routes: **removed from navigation and routing**.

---

## Remediation status (2026-07-25)

Completed in-repo:

- ERP mock pages, `dummyData.js`, Trinity mock `api.js`, Tk FAQ chatbot removed from product UI
- Single Guardian warden auth (`/login`) — no SPA baked password auto-login
- Live Analytics + Config pages; WebSocket alerts on command center; store-backed Warden assistant
- Docs: this audit, `FEATURE_MATRIX.md`, honest `README.md`
- Check: `python -m ai.test_product_honesty`

---

## Auth decision

**One flow:** GuardianAI warden email/password → Bearer token (+ cookie).  
No Trinity JWT, no mock tokens, no auto-login with embedded passwords.
