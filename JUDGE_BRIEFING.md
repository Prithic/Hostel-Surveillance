# HackSprint Judge & Teammate Briefing

**Product:** Trinity Engine (hostel OS) + GuardianAI (CCTV security)  
**Branch:** `feat/real-product`  
**Status:** Feature self-checks green; pull-and-run with webcam ready.

Use this doc to answer judges. Speak honestly about limits — that builds trust.

---

## 1. Elevator pitch (30 seconds)

> Hostels need two things: day-to-day operations (leave, mess, laundry, complaints) and safety monitoring. We built **one console** where students and staff run hostel workflows against a real SQLite store, and wardens get **privacy-first CCTV AI** — detect people and suspicious behaviour, raise incidents, resolve them — **without facial recognition**.

---

## 2. Problem → solution

| Pain | Our answer |
|------|------------|
| Paper / WhatsApp hostel ops | Live hostel ERP in the browser, role-based |
| CCTV is passive / hard to watch | YOLO + tracking + zone rules → incidents |
| Face recognition = privacy risk | Person detection only (bounding boxes, track IDs) |
| Fake hackathon demos | Mutations persist in SQLite; SOS hits the live alert stream |

---

## 3. Who uses it (3 roles)

| Role | Login | Can do | Cannot do |
|------|-------|--------|-----------|
| **Warden** | `admin@guardian.ai` / `Warden@2026` | Everything: security, config, grant leave, attendance, visitors | — |
| **Student** | `student@hostel.local` / `Student@2026` | Leave apply, complaints, mess, laundry book/claim, SOS | Security, config, grant leave, edit roster |
| **Laundry** | `laundry@hostel.local` / `Laundry@2026` | Laundry status/claims, L&F, SOS | Security, config, leave grant |

Sidebar and API both enforce roles (not UI-only theater).

---

## 4. End-to-end architecture

```
Webcam
  → OpenCV capture
  → YOLOv8n (person detect) + ByteTrack (IDs)
  → Polygon zones (JSON)
  → Rule engine (restricted / crowd / night / tailgate)
  → SQLite incidents + alert fan-out
  → FastAPI (:8000)  REST + MJPEG + WebSocket
       ├── hostel_state (ERP document)
       └── users (PBKDF2 passwords)
  → React/Vite console (:5173)
```

**SOS path:** Student taps SOS → hostel event saved → critical `emergency_sos` incident → in-app notification → WebSocket to Warden Security page.

---

## 5. Tech stack & “why this, not that?”

### Frontend

| Choice | Why | Alternative rejected | Why not |
|--------|-----|----------------------|---------|
| **React + Vite** | Fast DX, component UI, team already on it | Next.js | Overkill for SPA; no SSR need for LAN demo |
| **React Router** | Simple client routes + role guards | File-based Next routing | Same SPA reason |
| **Framer Motion / Tailwind** | Polish for demo UI | Heavy design system | Time; keep lean |
| **Recharts** | Simple mess/analytics charts | D3 | Too much code for bars |
| **Fetch + sessionStorage token** | Clear Bearer auth | Redux / React Query | YAGNI for hackathon scope |

### Backend / AI

| Choice | Why | Alternative rejected | Why not |
|--------|-----|----------------------|---------|
| **Python FastAPI** | Async, typed, perfect for CV + API in one process | Node-only backend | OpenCV/Ultralytics ecosystem is Python-first |
| **Ultralytics YOLOv8n** | Strong person detect, auto-download weights | Custom-only hostel `.pt` | Custom weights had poor webcam recall in testing |
| **ByteTrack** | Stable track IDs for rules (tailgate/crowd) | SORT alone / DeepSORT | ByteTrack is built into Ultralytics; less glue |
| **OpenCV** | Capture + annotate MJPEG | GStreamer | Heavier ops; OpenCV is enough |
| **SQLite** | Zero ops, one file, works offline after clone | Mongo / Postgres | Extra service for judges to install; Mongo lived in deferred `trinity-api/` |
| **PBKDF2 (stdlib)** | Real password hashing, no extra auth SaaS | JWT-only / plain text / Firebase Auth | Offline demo; stdlib = fewer deps |
| **MJPEG stream** | Works in plain `<img>` tags | WebRTC | Much harder to ship in a weekend |
| **WebSocket alerts** | Push incidents to Security UI live | Polling only | Latency feels “demo dead” |
| **Keyword chat** | Honest answers from live store | Fake LLM wrapper | Judges catch hallucination; we stay grounded |

### Product decisions

| Decision | Why |
|----------|-----|
| No face recognition | Privacy + hostel policy; product claim is behaviour, not identity |
| One Guardian API for ERP + CCTV | One login, one DB, fewer moving parts on teammate laptops |
| Role nav + API RBAC | UI hide alone is insecure; API must 403 |
| Seed data on first boot | Empty DB looks broken; seed ≠ fake success on mutations |

---

## 6. Feature map (what to demo)

### Security (Warden)
- Live annotated webcam, FPS, people count  
- Incidents list + Resolve  
- WebSocket toast/stream of new alerts  
- Config: live confidence / crowd / night hours (no restart)  
- Chat: “camera status”, “latest incident”, “summary”

### Hostel ERP (persisted)
- Attendance roster toggles (Warden)  
- Leave apply (Student) / grant-deny (Warden)  
- Complaints create + status  
- Mess meal plan + ratings  
- Laundry book, advance status, missing claims  
- Visitors entry/exit (Warden)  
- Notices/events, inspection, inventory, fees  
- SOS → Security incident  

### Auth
- 3 users, hashed passwords, password change in Settings  
- Wrong password → 401  

---

## 7. Demo script (5–7 minutes)

1. **Clone story:** “Two commands: setup + start; webcam on by default.”  
2. **Student login** → apply leave, raise complaint, **hit SOS**.  
3. **Logout → Warden** → Security: show stream + people; open incidents → find SOS critical → Resolve.  
4. **Notifications bell** → SOS alert visible.  
5. **Grant the leave**; toggle attendance; show Config change (crowd threshold).  
6. **Laundry login** → advance a laundry batch / claim.  
7. **Honest close:** “No face ID, no fake SMS — ops + behaviour AI that actually persists.”

---

## 8. Judge Q&A (practice answers)

### Product / problem

**Q: Why not just use existing CCTV software?**  
A: Commercial NVR tools rarely combine hostel ERP + privacy-first behaviour rules in one student-facing console. We target hostel workflows + warden alerts together.

**Q: Is this production-ready?**  
A: It’s a **working MVP**: real auth, RBAC, persistence, live pipeline. Not SaaS-complete (no SMS gateway, no HA cluster, MJPEG is open for LAN demo). We know the upgrade path.

**Q: Where is the data stored?**  
A: Local SQLite file `data/guardian.db` — users, incidents, hostel JSON document. Fine for campus LAN; Postgres later for multi-server.

### AI / privacy

**Q: Do you recognize students’ faces?**  
A: **No.** We detect the person class and track IDs. Incidents say “person entered restricted zone,” not “Rahul entered.”

**Q: Why YOLOv8n not a bigger model?**  
A: Latency on CPU laptops. n-model is enough for person boxes; we can swap weights via env without rewriting code.

**Q: How do zones work?**  
A: Polygon JSON scaled to frame size. Restricted polygons trigger entry rules.

**Q: False positives?**  
A: Tunable confidence + crowd threshold in Config. Night window is hour-based. We log incidents for human resolve — AI proposes, warden decides.

**Q: Why ByteTrack?**  
A: Rules like tailgating need identity across frames. Detection alone is flicker; tracks give temporal logic.

### Backend / security

**Q: How is auth secured?**  
A: PBKDF2-hashed passwords in SQLite, session tokens (Bearer + httpOnly cookie), TTL. Role checks on sensitive routes return 403.

**Q: Why is the video stream unauthenticated?**  
A: Browser `<img src>` cannot send Authorization headers easily. Tradeoff for LAN demo. Production: signed URLs or same-origin proxy.

**Q: SQL injection?**  
A: Parameterized SQLite queries; hostel mutations go through allowlisted keys.

**Q: Can a student approve their own leave via API?**  
A: No — leave status patch is Warden-only; we verified 403.

### Frontend / UX

**Q: Why one SPA for all roles?**  
A: Shared design, one deploy; `navAccess` + `RequireRole` filter routes; API enforces the same.

**Q: Offline?**  
A: Backend must run. After weights download, camera inference can run offline on LAN without cloud AI.

### Scope / honesty

**Q: Your chat claims to be AI — is it GPT?**  
A: No. It’s a **warden assistant** over live incident/status data. Keyword routing. We didn’t fake an LLM.

**Q: Payment / SMS?**  
A: Fee page records payments in DB. No Razorpay/Twilio — out of scope; architecture allows adding later.

**Q: What’s in `trinity-api/`?**  
A: Deferred Nest/Mongo experiment. **Not used** by the product UI. Single Guardian API is the system of record.

**Q: Biggest technical risk?**  
A: Camera index / OS permissions on unfamiliar laptops; first-run weight download. Mitigated by setup scripts and `-NoCamera` fallback for ERP-only.

**Q: What would you build next?**  
A: Authenticated stream proxy, Postgres, real notification channel (FCM/SMS), multi-camera, better zone editor UI, optional on-prem LLM for chat grounded on the same store.

---

## 9. Pull & run (teammate laptop + webcam)

```powershell
git clone https://github.com/Prithic/Hostel-Surveillance.git
cd Hostel-Surveillance
git checkout feat/real-product
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

Open http://127.0.0.1:5173/login  

Allow Windows camera permission. First start may download `yolov8n.pt`.

---

## 10. One-line ownership cheat sheet

| Area | Talk about |
|------|------------|
| AI pipeline | YOLO → ByteTrack → zones → rules → incidents |
| API | FastAPI, SQLite, auth, hostel CRUD, SOS, WS |
| Frontend | React roles, Security dashboard, hostel pages |
| Product honesty | What persists vs what we intentionally didn’t fake |

**Ready.** Features are implemented and checked; this briefing is the script for judges.
