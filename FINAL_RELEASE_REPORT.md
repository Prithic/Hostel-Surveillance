# FINAL_RELEASE_REPORT — GuardianAI (HackSprint'26)

**Date:** 2026-07-30 (final engineering session)  
**Branch:** `feat/real-product`  
**Reviewer stance:** External RC — attempt to break, not polish  
**Decision:** **GO**

---

## 1. Executive Summary

GuardianAI is a **privacy-first gate/perimeter behaviour intelligence** system with a real SQLite multi-role hostel ops shell. The CV spine (YOLO → ByteTrack → rules → incidents → FastAPI → WebSocket → Security dashboard) runs on real Hikvision D03/D06 footage. Auth and RBAC hold under probe. Explainable incident cards answer What / Where / When / Action.

One **demo blocker** was found and fixed in this RC: recommended D03 `*142351` has **~180s with zero people** at the start; waiting real-time would kill a 2-minute demo. Fix: `GUARDIAN_START_SEC` seek + `start-video.ps1 -StartSec 180`. After seek, live incidents fired on **`restricted_flank`** and **`group_entry`** (gate-honest zones).

**Not** a production SOC. **Is** a coherent hackathon-grade decision-support demo if the script below is followed.

---

## 2. Build Status

| Check | Result |
|-------|--------|
| Python 3.11 / Node 22 | Present |
| `models/yolov8n.pt` | Present (~6.5 MB) |
| `Hostel footage/` D03/D06 MP4s | Present (local; gitignored) |
| `python -m ai.test_gate_rules` | **PASS** |
| `python -m ai.test_integration` | **PASS** |
| `python -m ai.test_product_working` | **PASS** |
| `python -m ai.test_product_honesty` | **PASS** |
| `frontend` `npm run build` | **PASS** (chunk >500kB warning only) |
| API `:8000` + Vite `:5173` | **Started successfully** this session |
| Live RBAC probe `ai/test_rc_live.py` | **PASS (0 fails)** |

---

## 3. Test Results

### Automated
- Gate rules: group_entry, loitering, night, camera_health, zones JSON  
- Integration: modules, resolve, 500-frame history bound  
- Honesty: no Trinity mock client, no baked passwords, chat uses `/api/chat`, Security uses WS  

### Live API journeys (executed)
| Journey | Result |
|---------|--------|
| Invalid login | 401 |
| Unauthenticated incidents / stream | 401 |
| Warden login → status / incidents / analytics / chat / videos | 200 |
| Authenticated MJPEG (`?token=`) | 200, bytes received |
| Student denied incidents / analytics / chat | 403 |
| Student SOS append bypass | **400 blocked** |
| Student SOS → incident → Warden resolve | **PASS** |
| Student leave + complaint append | **PASS** |
| Student cannot replace `analytics` / `currentUser` | **PASS** |
| Laundry patch status | **PASS** |
| Laundry denied incidents | 403 |
| Logout invalidates token | **PASS** |
| SQLi-ish login string | 401 |
| Chat XSS payload | no crash, no raw `<script>` echo |

### AI on D03 (after seek 180s)
- FPS ~12, camera online  
- New incidents: `restricted_zone_entry` on **Restricted Flank / no-go**, **`group_entry`** (medium)  
- Confirms gate zone JSON is active (not stale `Restricted Area A` history)

---

## 4. Security Audit

| Area | Finding | Severity |
|------|---------|----------|
| Stream auth | Cookie or `?token=` required | Fixed earlier; verified |
| SOS append bypass | Blocked | Fixed earlier; verified |
| Shared `currentUser` overwrite | Replace denied | Fixed earlier; verified |
| Chat / incidents / analytics | Warden-only | Verified |
| WS alerts | Any authed role with token can subscribe | **Medium** — UI hides; API allows |
| `require_warden` naming | Means any session | **Low** (docs debt) |
| Full `/api/hostel/state` to all roles | Shared seed PII | **Medium** — demo-acceptable |
| Sessions in-memory | Restart kills tokens | **Medium** — do not restart mid-demo |
| Demo passwords on login UI | Intentional for hackathon | Accept; narrate |
| SQL injection via login | Parameterized / hashed path; rejected | Pass |
| XSS via chat | Keyword reply; no HTML shell | Pass |
| CSRF | Cookie + Bearer; SameSite=Lax LAN demo | Accept for local demo |

**No privilege escalation from Student → Warden security APIs found.**

---

## 5. UX Audit

| Item | Verdict |
|------|---------|
| Security explainable cards | Strong for judges |
| Leave Pending labeled Denied | **Fixed** previously |
| Dashboard Security buttons for students | **Fixed** previously |
| Settings profile vs shared seed | **Fixed** (session identity) |
| Chat widget | Warden-only |
| Outpass “QR” | Lucide icon theater — **do not claim scannable** |
| ERP seed names/phones | Looks demo — lead with Security |
| Loading / empty incidents | Acceptable (“pipeline is watching”) |
| Responsiveness | Adequate for laptop demo |
| Stale incident history (`Restricted Area A`) | Cosmetic; new events use flank/loiter names |

---

## 6. AI Audit

| Capability | Status |
|------------|--------|
| Person detect + track | Works on D03 after people appear (~180s) |
| Gate zones | Apron loiter + flank restricted — **verified live** |
| Group entry | Fires; labeled honestly (not badge tailgating) |
| Loitering | Implemented; dwell via `GUARDIAN_LOITER_S` (use 15 for demo) |
| Night / curfew | Footage clock from Hikvision filename; daytime clip won’t fire without Config tweak |
| Camera health | Implemented; not observed on healthy decode |
| Explainability metadata | `suggested_action` + UI fallbacks |
| False positives | Flank ROI + crowd can still FP outdoors — narrate thresholds |
| Identity | **None** — product law held |

**ByteTrack warm-up:** previously dropped all boxes when `boxes.id is None` → status people stuck at 0. **Fixed** this RC (ephemeral IDs).

---

## 7. Demo Audit

| Metric | Target | Notes |
|--------|--------|-------|
| Script length | 90–120s | Feasible with StartSec=180 |
| Awkward wait | Was 3+ min empty lead-in | **Mitigated by seek** |
| Backup | Webcam / Play video UI | Keep ready |
| Over-7-minute risk | High if ERP deep-dive | **Cut** laundry/fees unless asked |

### Recommended demo order (≤2 min)
1. Warden login → Security (stream + zones)  
2. Point at people / incident card / Resolve  
3. Privacy one-liner  
4. Student SOS → Warden Resolve  
5. Stop (optional 15s leave/laundry only if time)

---

## 8. Performance Audit

| Metric | Observed |
|--------|----------|
| D03 @ max_w 1280, CPU | ~11–13 FPS |
| Frontend prod bundle | ~827 kB JS (warning only) |
| Incident history | Bounded (1000) |
| HEVC | OpenCV POC warnings on seek — non-fatal |

Acceptable for laptop demo. Do not claim GPU SOC throughput.

---

## 9. Remaining Risks

1. Forgetting `GUARDIAN_START_SEC=180` → empty people for minutes  
2. API restart mid-demo → all sessions 401  
3. Daytime clip + night rule narrative mismatch  
4. Zone polygons approximate vs real FOV  
5. Stale docs under `docs/qa/` vs `SHIP_REPORT` / this file  
6. Student can still open WS with token (if they craft URL)  
7. HEVC decode quirks on some machines  

---

## 10. Go / No-Go Decision

# GO

**Why:** Core security path is real, RBAC holds under attack probes, frontend builds, AI produces gate-honest explainable incidents on real footage when seek is applied, SOS end-to-end works, and the only showstopper for tomorrow’s timing (empty D03 lead-in) has a concrete fix in scripts/env.

---

## 11. Final Score (/100)

| Dimension | Score |
|-----------|------:|
| Problem fit / privacy story | 18/20 |
| Engineering completeness | 16/20 |
| AI practicality (gate) | 15/20 |
| Demo reliability | 14/15 |
| UI / explainability | 12/15 |
| Ops honesty (ERP) | 7/10 |
| **Total** | **82/100** |

---

## 12. Critical Bugs

| Bug | Status |
|-----|--------|
| D03 empty ~180s lead-in kills live demo timing | **FIXED** — `GUARDIAN_START_SEC` + `start-video.ps1 -StartSec 180` |
| ByteTrack `id is None` → zero people even with detections | **FIXED** — ephemeral track ids |

*(No open criticals remaining for GO.)*

---

## 13. Medium Bugs

| Bug | Action |
|-----|--------|
| WS alerts not role-filtered | Document; don’t open WS from student UI |
| Shared hostel_state PII to all roles | Narrate as demo seed |
| In-memory sessions | Don’t restart API |
| Historical incidents still say `Restricted Area A` | Ignore / resolve old; new events correct |
| Play video from UI without START_SEC env | Prefer `start-video.ps1` cold start |

---

## 14. Minor Bugs

| Item |
|------|
| Vite chunk size warning |
| `require_warden` misnomer |
| Leave QR not scannable |
| Parent phone prefill looks verified |
| Dynamic import warning for `guardianApi` in Settings |

---

## 15. Nice-to-have (Post Hackathon)

- NotificationService (SMS/WhatsApp stubs)  
- Persist sessions  
- Per-user hostel isolation  
- Incident ack state machine  
- Zone calibration UI  
- Seek control in Security UI  
- Rename `require_warden` → `require_session`  

---

## 16. Top 25 Judge Questions (answer only from reality)

1. **What is GuardianAI?** Privacy-first hostel security decision support — behaviour events for wardens, not faces.  
2. **Why YOLO?** Fast person detection on CPU; swappable weights.  
3. **Why ByteTrack?** Stable IDs for dwell/group-entry over time — not for identity.  
4. **Why no face recognition?** Product law / privacy; identity via future QR/RFID, not CV.  
5. **How accurate?** Rule-based on tracks; not ML classifiers for behaviour; thresholds tunable.  
6. **False positives?** Outdoor gates FP on crowd/group-entry; severity demoted; warden resolves.  
7. **Why SQLite?** Single-laptop demo persistence; zero ops; enough for hackathon.  
8. **Why FastAPI?** Async WS + REST + MJPEG in one process Python team owns.  
9. **Why not Kubernetes?** Overkill; we optimize for 5-minute judge clone-and-run.  
10. **Offline?** Local stack; no cloud dependency for core path.  
11. **Power fail?** Process stops; SQLite retains incidents on disk.  
12. **Different from CCTV?** CCTV shows pixels; we raise explainable incidents + workflow.  
13. **Identity?** Login roles + future badge systems — never faces.  
14. **Tailgating?** We say **group entry** — two people into restricted ROI in 3s, not badge piggyback.  
15. **Zones?** Gate apron (loiter) + flank no-go — outdoor, not corridor rooms.  
16. **Night detection?** Footage wall-clock from Hikvision filename + Config hours.  
17. **SOS?** Real critical incident + notification + WS.  
18. **Chatbot LLM?** No — keyword Q&A over live store.  
19. **ERP real?** Mutations persist in SQLite; seed world is demo data.  
20. **Multi-camera?** Architecture has `camera_id`; demo is single stream.  
21. **Scale?** Not claimed; vertical for one hostel site first.  
22. **Commercial?** Possible as warden assist layer; needs auth hardening + channels.  
23. **Security of stream?** Auth via cookie/token; LAN demo assumption.  
24. **Laundry identity?** Human claim workflow — software doesn’t magically know clothes.  
25. **Why Trinity + Guardian?** One console: ops + security; Security is the hero for judging.

---

## 17. Recommended Demo Order

See §7. Lead Security → privacy → SOS. Cut ERP depth.

---

## 18. Recommended Speaker Allocation

| Role | Owner |
|------|-------|
| Pitch + privacy law | Product / PM voice |
| Live Security + footage | AI/CV speaker |
| SOS + roles | Backend / full-stack |
| Judge Q&A | Rotate; never invent roadmap as shipped |

---

## 19. Time Breakdown (suggested)

| Segment | Seconds |
|---------|--------:|
| Problem + privacy | 20 |
| Live Security + incident | 45 |
| SOS cross-role | 25 |
| Buffer / Q | 20–30 |
| **Total** | **~2:00** |

---

## 20. Final Confidence Level

**High (ship)** — contingent on using `start-video.ps1 -StartSec 180` (or equivalent env) and a rehearsed Security-first script.

---

## RC fixes applied this session (allowed: blockers only)

1. `GUARDIAN_START_SEC` seek in `ai/opencv_stream.py`  
2. ByteTrack warm-up ephemeral IDs in `ai/bytetrack.py`  
3. `scripts/start-video.ps1 -StartSec` default 180 + loiter 15  
4. `docs/qa/DEMO_CHECKLIST.md` updated  

---

## Absolute decision

# GO
