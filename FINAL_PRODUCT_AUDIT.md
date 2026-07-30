# FINAL_PRODUCT_AUDIT — GuardianAI (Judge Mode)

**Date:** 2026-07-30  
**Branch:** `feat/real-product`  
**Method:** Live run (`:8000` + `:5173`), RBAC probe (`ai/test_rc_live.py` = 0 fails), code + UX walkthrough  
**Stance:** First-time HackSprint judge / production QA  

---

## Judge verdict (5 minutes)

| Question | Answer |
|----------|--------|
| Professional? | **Mostly yes** on Security + login; ERP is denser / seed-looking |
| Reliable? | **Yes** if started with `start-video.ps1 -StartSec 180` |
| Modern? | **Yes** — glass UI, motion, live WS |
| Useful? | **Yes** for warden gate awareness + SOS |
| Real? | **Security path is real**; hostel seed is demo data that *persists* |
| Student project? | **No** if demo stays Security-first; **risk yes** if you tour every ERP page |

**Overall product score: 8.2 / 10** for hackathon Security Intelligence.

---

## Live verification this session

| Check | Result |
|-------|--------|
| Frontend `/login` | HTTP 200 |
| API health / RBAC / SOS / laundry | **PASS (0 fails)** |
| Stream auth | 401 without token; 200 with token |
| Model present | true |
| Camera online + FPS ~11 | true (D03) |

---

## Screen scores (/10)

| Screen | Score | Problems | Severity | Suggested fix | Time | Risk | Judge impact |
|--------|------:|----------|----------|---------------|------|------|--------------|
| **Landing** | 7 | Dual brand (Trinity vs Guardian); campus-specific copy | Low | Lead with GuardianAI in speech | 0 (script) | None | Confusion if ERP-first |
| **Login** | 9 | Demo passwords visible (intentional) | Low | Narrate “demo accounts” | 0 | None | Positive for speed |
| **Dashboard** | 7.5 | Dense seed widgets; some stats navigate nowhere useful | Low | Skip deep ERP in demo | 0 | None | Medium if lingered |
| **Security** | 9 | Empty feed used to feel “dead”; polish applied | — | Heartbeat + monitoring empty state **done** | 15m | Low | **High** |
| **Analytics** | 8 | Empty charts felt blank; polish applied | — | Health-framed empty copy **done** | 5m | Low | Medium |
| **Config** | 8 | Technical; fine for warden | Low | Keep off primary script | 0 | None | Low |
| **SOS** | 8.5 | Empty list soft; polish applied | — | Quiet-campus empty state **done** | 5m | Low | High for demo beat |
| **Leave / Outpass** | 8 | QR is Lucide icon theater | Medium | Don’t claim scannable QR | 0 | None | Trust hit if overclaimed |
| **Complaints** | 8 | Seed list looks “fake” until mutate | Low | Apply one live complaint in demo | 30s | None | Medium |
| **Laundry** | 8 | Works; seed batch IDs | Low | Show one status advance | 30s | None | Medium |
| **Visitors** | 7.5 | Warden-only; fine | Low | Optional | 0 | None | Low |
| **Attendance** | 7 | Roster seed | Low | Skip in 5-min judging | 0 | None | Low |
| **Fees** | 7 | Seed money | Low | Skip | 0 | None | Low |
| **Mess** | 7.5 | Seed menu | Low | Skip | 0 | None | Low |
| **Notices** | 8 | Fine | Low | Optional | 0 | None | Low |
| **Inspection** | 7.5 | Fine | Low | Skip | 0 | None | Low |
| **Inventory** | 7.5 | Fine | Low | Skip | 0 | None | Low |
| **Lost & Found** | 7.5 | Fine | Low | Skip | 0 | None | Low |
| **Room Details** | 7 | Seed roommates | Low | Skip | 0 | None | Low |
| **Settings** | 8.5 | Profile from login (good); prefs honest about no SMS | — | Keep | 0 | None | Positive honesty |
| **Student nav** | 8.5 | Correctly hides Security | — | Keep | 0 | None | Trust |
| **Laundry nav** | 8.5 | Scoped menus | — | Keep | 0 | None | Trust |

---

## UX review (confused first-time user)

| Friction | Severity | Low-risk action |
|----------|----------|-----------------|
| “What product is this — Trinity or Guardian?” | Medium | Say: “GuardianAI security inside Trinity hostel console” |
| Too many sidebar items for a security pitch | Medium | Demo only Security → SOS → one ops mutation |
| Quiet CCTV = “AI broken?” | **Critical (was)** | Heartbeat strip + “waiting for activity” empty state **shipped** |
| Leave “Digital Pass” looks like real QR | Medium | Call it “pass preview” verbally |
| Chat is keyword not LLM | Low | One honest line if asked |
| Switching video without `START_SEC` | Medium | Always cold-start via `start-video.ps1 -StartSec 180` |

**Clicks for core demo:** Login → Security (~2) → optional SOS logout/login (~4). Acceptable.

---

## Backend review

| Area | Verdict |
|------|---------|
| Auth | PBKDF2 users; cookie + Bearer; logout kills session |
| Authorization | Security APIs Warden-only; hostel keyed maps; SOS append blocked |
| Validation | Pydantic bodies; password min length |
| Errors | HTTPException with clear detail |
| Status codes | 401/403/400/404 used correctly under probe |
| Logging | Audit table for login/SOS/resolve/config |
| Response time | Local LAN fine for demo |
| Consistency | `require_warden` = any authed (misnamed) — document only |
| Broken endpoints | None found in live probe |
| Security gaps | WS not role-filtered; shared hostel_state — accept for demo |

---

## Database review

| Item | Verdict |
|------|---------|
| Schema | `incidents`, `audit_log`, `users`, `hostel_state` (JSON blob) |
| Foreign keys | Not used (document-oriented hostel blob) — OK for demo |
| Indexes | PK only on incidents — fine at demo scale |
| Persistence | Verified across SOS / leave / laundry |
| Transactions | Per-statement SQLite; no multi-step bank transfers |
| Consistency | Shared `hostel_state` last-write-wins under concurrency |
| Invalid records | Seed theater until mutated — narrate honesty |

---

## AI / empty-state review

| Need | Before | After (this polish) |
|------|--------|---------------------|
| Camera / AI / model heartbeat | Partial (4 stats) | **Heartbeat strip** on Security |
| Empty incidents | “No incidents yet” | **Monitoring active** checklist |
| Empty analytics | Flat “No data” | **Healthy / waiting** framing |
| Empty SOS | “No SOS events yet” | **Campus quiet** + reminder |
| Frames processed | Not shown | Uses `frame_index` when API exposes it (`?? 0` fallback) |
| Quiet FOV | Looked broken | Framed as **expected** |

**Remember:** empty CCTV is normal. Security must always look *alive*.

---

## Problems backlog (do **not** implement tonight unless marked done)

### Critical
| ID | Problem | Status |
|----|---------|--------|
| C1 | Quiet Security felt dead | **DONE** — empty-state + heartbeat |
| C2 | D03 empty lead-in | **DONE** earlier (`START_SEC`) |

### Medium
| ID | Problem | Fix risk |
|----|---------|----------|
| M1 | Dual branding Trinity/Guardian | Script only |
| M2 | Leave QR overclaim | Script only |
| M3 | WS any-role subscribe | Defer |
| M4 | Play video without START_SEC | Prefer start-video.ps1 |

### Minor
| ID | Problem |
|----|---------|
| m1 | Dashboard dead-end stat clicks |
| m2 | Vite chunk size warning |
| m3 | `require_warden` naming |
| m4 | Historical `Restricted Area A` rows in DB |

---

## Polish applied this review (low risk only)

1. Security: system heartbeat strip + monitoring empty state  
2. Analytics: healthy empty copy  
3. SOS: quiet-campus empty copy  
4. Status API already includes `frame_index` / `model_present` for UI  

No architecture changes. No new features.

---

## Expected judge impact

| Change | Impact |
|--------|--------|
| Security heartbeat + empty state | **High** — quiet footage no longer looks broken |
| Analytics / SOS empty copy | Medium — professionalism |
| Skipping ERP deep-dive | **High** — avoids “student CRUD” impression |

---

## Final recommendation

**Ship.** Maximize confidence by:

1. `start-video.ps1 -StartSec 180`  
2. Open **Security** first — point at heartbeat + feed  
3. Privacy line  
4. Student **SOS** → Resolve  
5. Stop  

Do **not** add features before morning.
