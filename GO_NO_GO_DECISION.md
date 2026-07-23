# GO / NO-GO Decision — GuardianAI v1.0.0 Final

**Date:** 2026-07-23  
**Branch:** `prithic`  
**Role:** Release Manager / Hackathon Judge  
**Code freeze:** YES — only release-blocker fixes applied after RC audit  

---

## Decision: **CONDITIONAL GO**

GuardianAI is **approved for HackSprint final presentation** under a fixed demo script.

It is **not** a production SOC platform. It **is** a demonstrable event-driven hostel CCTV assistant that reduces warden response time without facial recognition.

---

## Evidence summary

| Gate | Result | Evidence |
|------|--------|----------|
| Live backend health | PASS | `GET /health` → camera online, model present, SQLite path set, uptime > 30 min observed |
| Auth | PASS | Login issues Bearer; unauthenticated `/api/incidents` → 401 |
| Incidents API | PASS | List + analytics + chat grounded on store |
| MJPEG stream | PASS | `200 multipart/x-mixed-replace` |
| AI integration tests | PASS | `python -m ai.test_integration` — modules, chat logic, 500-frame stress |
| Live smoke | PASS | `LIVE SMOKE PASSED` (health/login/status/incidents/analytics/chat/stream/401) |
| Security UI loop | PASS (post-blocker fix) | `/security` shows stream + live incidents + resolve; sidebar + admin redirect |
| Privacy copy | PASS (post-blocker fix) | Dashboard no longer claims face recognition |
| Tk chatbot open | PASS | User confirmed after open-path fix |
| Trinity ERP pages | N/A for Guardian demo | Dummy hostel OS — keep off stage or label as ERP shell |
| 5× cold demo without human | NOT AUTOMATED | Requires rehearsed script (see below) — **condition** |

---

## Release-blocker fixes applied under freeze

1. **Security Command Center incomplete** → wired live status/incidents/resolve to Guardian API.  
2. **No path to `/security`** → sidebar + mobile nav + admin login redirects to `/security`.  
3. **Face-recognition copy on Dashboard** → replaced with privacy-safe wording.

No new features. No redesign. No architecture change.

---

## Architecture (verified)

```
Camera → OpenCV → YOLO+ByteTrack → Zones → Rules → Incidents(+SQLite)
       → Alerts → FastAPI (/api/stream, REST, WS) → Security Dashboard
```

Trinity Engine UI hosts the ERP shell; GuardianAI intelligence is the `/security` surface + Python `:8000`.

---

## Known limitations (document — do NOT fix under freeze)

| Item | Risk | Demo mitigation |
|------|------|-----------------|
| Floating **TkChatbot** is hostel FAQ, not `/api/chat` | Judge confusion | Say: “desk assistant = FAQ; incident Q&A = Security API / curl” |
| WebSocket `/ws/alerts` unused by UI | No push toasts | Polling every 4s on Security page |
| Night/crowd rules need clock/threshold | Silent rules | Prep `GUARDIAN_CROWD=2` or night hours / restricted-zone walk |
| Zones must match camera framing | Missed restricted alerts | Calibrate `default_zones.json` before stage |
| Dual auth (Trinity session + Guardian token) | Cred chaos | Demo: Admin → `/security`; Guardian auto-login `admin@guardian.ai` / `Warden@2026` |
| CPU FPS ~2–3 | Looks slow | Narrate “CPU demo; GPU optional via `GUARDIAN_DEVICE`” |
| Trinity ERP dummy data | Fake mess/fees | Do not linger on ERP pages |
| MJPEG unauthenticated | LAN sniff | Acceptable for local MVP; noted |
| Sessions in-memory | Lost on restart | Restart before demo once; SQLite keeps incidents |

---

## Demo script (must follow for GO)

1. Start API: `uvicorn backend.main:app --host 127.0.0.1 --port 8000`  
2. Start UI: `cd frontend && npm run dev` → http://127.0.0.1:5173  
3. Admin login (`@srishakthi.ac.in` + password ≥8, mock OK if Node down) → lands on **Security**.  
4. Show LIVE stream + person boxes/zones.  
5. Trigger **restricted zone** entry → incident appears → **Resolve**.  
6. Optional: `curl` chat `What happened recently?` to prove store-backed answers.  
7. Do **not** claim Tk floating bot reads incidents.  
8. Do **not** open Attendance and discuss face ID.

---

## Performance (observed)

| Metric | Observed | Notes |
|--------|----------|-------|
| FPS (CPU, webcam) | ~2.5 | Acceptable for demo narrative |
| Health latency | <100 ms | |
| Login + incidents | <300 ms local | |
| Stream | continuous MJPEG | |

No release-blocking performance defect for stage demo.

---

## Security (MVP honesty)

| Control | Status |
|---------|--------|
| Guardian API Bearer + cookie | Present |
| Protected incident/analytics/chat | Present |
| Open MJPEG | Intentional demo tradeoff |
| Trinity mock login fallback | Demo convenience — not production |
| Secrets in env | Defaults documented; override for real events |
| Rate limiting (Guardian) | Absent — MVP gap, not demo blocker |
| CORS | Localhost Vite origins only |

---

## Final justification

**GO because:**

- End-to-end detection pipeline runs live.  
- Warden can see stream, incidents, and resolve on `/security`.  
- Auth blocks anonymous API reads.  
- Integration + live smoke passed.  
- Privacy claim no longer contradicted on the default dashboard.

**CONDITIONAL because:**

- Presenter must follow the demo script (zones, no face claims, clarify two chatbots).  
- Five consecutive unattended automated full demos were not executed in CI; human rehearsal is mandatory.

---

## If judges ask “is this production ready?”

**Answer:** No. It is a **hackathon Final Release** of an event-driven hostel CCTV assistant (v1.0.0), with documented MVP security and dual-UI (Trinity ERP shell + GuardianAI security core).

---

**Signed:** Release Manager (automated audit + live smoke + blocker fixes)  
**Build:** GuardianAI **v1.0.0 Final (Conditional GO)**
