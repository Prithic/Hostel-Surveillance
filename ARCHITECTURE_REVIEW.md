# ARCHITECTURE REVIEW — GuardianAI Final Evolution

**Date:** 2026-07-29  
**Branch:** `feat/real-product`  
**Mode:** Understanding-only (no implementation in this milestone)  
**Stance:** Combined Product / AI / Security / Systems / UX / Judge review

---

## 1. One-sentence product truth

**GuardianAI is a privacy-first warden decision-support system for gate/perimeter CCTV behaviour events**, with a secondary multi-role hostel ops shell on SQLite. It is **not** a face-surveillance product, **not** a finished SOC, and **not** a production hostel ERP.

---

## 2. What the system actually is (verified)

```
Camera / Hikvision file
  → OpenCV (loop files; downscale wide frames)
  → YOLOv8 person + ByteTrack IDs
  → Polygon zones (scaled JSON)
  → Rules: zone entry / crowd / night / group-entry(“tailgating”)
  → IncidentEngine (SQLite + 8s cooldown)
  → AlertEngine → WebSocket
  → FastAPI (:8000) + React (:5173)
```

**Real & staging-grade**
- Auth (PBKDF2 users), role menu + many role API gates
- Live stream, video hot-swap, incidents, resolve, analytics, config
- SOS → critical incident + in-app notification + WS
- Hostel mutations persist in `hostel_state` JSON document
- Footage clock for Hikvision `YYYYMMDDHHMMSS` filenames

**Not production / still theater-adjacent**
- Hostel seed world (B-204 names, menus, fees) labeled “live”
- Chat = keyword Q&A, not reasoning AI
- No outbound SMS/WhatsApp/email (prefs are toggles only)
- Zones still generic 640×480 rectangles — **not drawn for D03/D06 gate geometry**
- `trinity-api/` Express+Mongo is **dead to product** (do not run)

---

## 3. Critical strategic mismatch (must fix narrative + rules)

| Assumption we built for | Reality of footage |
|-------------------------|--------------------|
| Indoor corridor / restricted room | **Outdoor gate / entrance / vehicle approach** |
| “Restricted zone” = unauthorized space | Gate ROI is **normal pedestrian traffic** |
| “Tailgating” = badge piggyback | Code = **2 people enter ROI in 3s** (friends = CRITICAL FP) |
| Digital Twin / full ERP OS | Judges buy **security intelligence**, not laundry semantics |

**Judge-safe mission statement**
> Help wardens notice and triage gate/perimeter anomalies faster — without identifying students.

Identity (QR / RFID / fingerprint) is an **explicit future join**, not a CV claim.

---

## 4. Idea evaluation (integrate / defer / reject)

| Idea | Verdict | Why |
|------|---------|-----|
| Behaviour-first events (What/Where/When/Why/Confidence/Action) | **INTEGRATE** | Highest judge ROI; mostly UX + metadata already in API |
| Explainable incidents (tracks, zones, thresholds) | **INTEGRATE** | Fields exist server-side; Security UI hides them |
| Gate-calibrated zones | **INTEGRATE** | Demo blocker if we claim real CCTV |
| Rename/demote “tailgating” → “group entry” or disable for gate demos | **INTEGRATE** | Semantic honesty |
| Camera offline / freeze / black-frame health incident | **INTEGRATE (small)** | Realistic + impressive |
| Loitering (dwell in apron ROI) | **INTEGRATE if time** | Feasible with track age in zone |
| Curfew = night rule with footage clock | **KEEP** | Already improved for Hikvision names |
| Notification channel abstraction (in-app + stub SMS) | **INTEGRATE thin interface** | Architecture yes; Twilio no |
| Guard role | **DEFER** | Hackathon scope; Warden covers stage |
| Parent role | **REJECT for now** | No real data partition |
| Hostel Digital Twin | **REJECT** | Over-engineered; dilutes demo |
| Full event-sourcing rewrite | **REJECT** | Months of work |
| Wrong-direction / running | **DEFER** | Needs calibrated geometry; high FP outdoors |
| Face / re-ID | **REJECT forever (product law)** | Privacy mission |

---

## 5. Architecture Review (severity-ranked)

### P0 — Demo credibility / product law
1. **Zones ≠ gate.** Default polygons invent “restricted” on approach path → FP story for judges with real footage.  
2. **Tailgating label is overclaim.** Group walk ≠ piggybacking.  
3. **ERP visually competes with Security.** Dual brand (Trinity vs Guardian) confuses judges; Security must be the hero surface.  
4. **Docs drift.** `PRODUCT_AUDIT.md`, `TECHNICAL_DEBT.md`, `HACKATHON_READINESS.md`, `GO_NO_GO` still describe old Trinity mock / WS unused / Tk chatbot — **wrong vs `feat/real-product`**. Misleads teammates.

### P1 — Security intelligence quality
5. Incident cards omit `track_ids`, `zone_ids`, `metadata`, `last_seen` — explainability gap.  
6. No camera-health incident (offline / frozen / black).  
7. Crowd + night on outdoor peaks will spam without time-of-day / zone-local thresholds.  
8. File loop does not reset tracker/rule state → glitchy re-alerts on clip loop.  
9. MJPEG `/api/stream` open; WS token in query string — note as LAN demo tradeoff.

### P2 — Auth / RBAC hygiene
10. `require_warden` means “any authed user” — dangerous naming.  
11. Any role can `GET /api/hostel/state` (full seed + phones) and use Security chat.  
12. Quick-login passwords in SPA — OK for hackathon if narrated as demo seed; not for public deploy.

### P3 — Hostel ops honesty
13. Seed labeled Live; Laundry identity workflow not solved by software alone (human tagging).  
14. Parent consent / QR pass / image upload are UI theater — keep but never claim as integrations.  
15. Notification prefs don’t send — need channel interface or remove false promise.

---

## 6. Target architecture (evolution, not rewrite)

Keep the spine. Harden the **meaning layer**.

```
Observation (stream)
  → Perception (person tracks only)
  → Situation (zones + time + dwell + health)
  → Security Event (typed, scored, explained)
  → Decision Support (recommended action)
  → Human Action (ack / resolve / escalate / SOS link)
  → Resolution (audit trail)
```

**Event schema (every alert must fill)**

| Field | Source today | Gap |
|-------|--------------|-----|
| What | `incident_type` + `reason` | Rename types for gate language |
| Where | `camera_id`, `zone_ids` | Show in UI; redraw zones |
| When | footage clock / local now | Done for Hikvision names |
| Why | rule + thresholds in metadata | Partially missing in UI |
| Confidence | absent | Add 0–1 heuristic or “rule-fired” certainty band |
| Warden action | absent | Suggested actions per type |

**Notification architecture (clean, not fake)**

```
IncidentEngine → NotificationService.dispatch(event, channels=[in_app, ...])
  in_app → hostel.notifications (exists)
  sms/whatsapp/email → Provider stubs (log-only for demo)
```

Do **not** claim delivered SMS.

---

## 7. Recommended gate rule set (hackathon)

| Keep | Change | Add if time |
|------|--------|-------------|
| Person detect + track | — | — |
| Night / curfew on gate FOV | Use footage clock (done) + Config | Schedule exceptions later |
| Crowd | Raise threshold / make zone-local | — |
| Zone entry | Only on **true no-go ROI** (side yard / barrier), not main path | Tripwire IN/OUT later |
| “Tailgating” | **Rename to Group Entry** or disable for outdoor demos | — |
| SOS | Keep | Link to nearest camera id |
| — | — | Camera offline / freeze / black |
| — | — | Loiter in gate apron (60–120s dwell) |

**Do not build for stage:** vehicle OCR, face, wrong-way without calibration, Digital Twin, parent app.

---

## 8. Role system target

| Role | Primary job | See |
|------|-------------|-----|
| **Warden** | Security OS + approvals | Security hero + full ops |
| **Student** | Request leave / complain / SOS | Thin ops; **no** incident chat |
| **Laundry** | Claims / batch advance | Laundry + L&F only |
| Guard (future) | Acknowledge + patrol notes | Security subset |
| Parent (future) | Outpass consent | Isolated data |

---

## 9. Real hostel operations (software + human)

| Workflow | Software today | Required human / future |
|----------|----------------|-------------------------|
| Laundry ownership | Claim tickets | Tag/RFID; staff verify |
| Attendance | Roster toggle | QR/RFID at gate (join CV events later) |
| Outpass | Apply / grant | Guard scans QR at gate; CV explains anomalies |
| Visitors | Entry/exit log | ID check at desk |
| Complaints | Ticket lifecycle | Facilities assignee |
| Emergency | SOS + CCTV critical | Security call tree (notify channels) |
| Fees | Manual ledger | Payment gateway later |

CV should **annotate gate risk**; access systems **authorize people**.

---

## 10. Test / quality reality

**Have:** honesty tests, product_working self-check, smoke scripts, integration-ish AI tests.  
**Missing for “intelligence platform” claim:** 
- Outdoor-gate rule regression on D03/D06 fixtures  
- Loitering / health rules tests  
- WS auth negative tests  
- RBAC matrix automated  
- File-loop reset tests  
- Load / long-video memory  

---

## 11. Demo readiness (judge lens)

| Criterion | Status |
|-----------|--------|
| Solves stated problem (faster warden response, no face ID) | **Strong if Security-led** |
| Real pipeline + real footage | **Yes** |
| Explainable | **Improved (Sprint A UI cards)** |
| Outdoor-gate honesty | **Improved (gate zones + group_entry + loiter)** |
| No fake data on security path | **Good** |
| ERP distraction | **Managed (Security hero)** |
| Production-looking polish | **Medium–high** |

**GO for final demo** after Sprint A+B landed on `feat/real-product`.

---

## 12. Implementation order (when coding is allowed)

### Sprint A — Narrative + explainability — DONE
1. Security incident card: What / Where / When / Why / Action  
2. Rename demote Tailgating → `group_entry` (medium)  
3. Chat Warden-only (API + UI)  
4. Docs: this file updated; stale PRODUCT_AUDIT still superseded by FEATURE_MATRIX  

### Sprint B — Gate adaptation — DONE (MVP)
5. Gate-oriented `default_zones.json` (apron loiter + flank no-go)  
6. Loitering + camera health rules  
7. Reset tracker/rules on file loop; source switch already respawns pipeline  

### Sprint C — Ops glue (next)
9. NotificationService interface + in_app + log stub providers  
10. Tighten hostel/state field exposure  
11. Incident ack state (open → acknowledged → resolved)  

### Explicit non-goals until after demo
Digital Twin, event-sourcing rewrite, parent app, real SMS, face, vehicle ALPR.

---

## 13. Remaining risks

| Risk | Mitigation |
|------|------------|
| HEVC decode glitches on Hikvision | Prefer shorter `*142351` clips; note CPU |
| Daytime demo, empty night | Use footage clock or Config night window for staged hour |
| Zone polygon still approximate | Recalibrate on stage FOV if flank FP high |
| Judges ask “is ERP real campus?” | “SQLite ops shell; Security is the product” |
| CPU FPS low | Narrate CPU; downscale already on |

---

## 14. Next priority

Sprint C thin notification stubs **or** live zone vertex tweak during dress rehearsal — whichever demo risk is higher.

---

## 15. Judge perspective (how we want to be scored)

We win if judges say:  
> “This helps a warden understand gate anomalies without invading privacy.”

We lose if judges say:  
> “This is a YOLO box demo with hostel CRUD.”

Every subsequent change must serve the first sentence.

---

## 16. Milestone report — Sprint A+B (2026-07-29)

### Architecture Review
Spine unchanged. Meaning layer hardened: typed events (`group_entry`, `loitering`, `camera_health`), explainable cards, gate zones.

### Bugs Fixed
- `IncidentType.TAILGATING` referred after enum rename → now `GROUP_ENTRY`
- Chat + floating widget available to non-wardens → Warden-only
- Corridor zones as “restricted path” → apron = loiter (not restricted)

### Tests Executed
- `python -m ai.test_gate_rules`
- `python -m ai.test_integration` (regression)

### Remaining Risks
Approximate zone vertices; crowd spam; MJPEG auth open on LAN.

### Technical Debt
Stale PRODUCT_AUDIT / GO_NO_GO docs; NotificationService not built; confidence score heuristic not added.

### Performance Summary
No change to YOLO path; extra O(tracks×zones) loiter bookkeeping negligible.

### Demo Readiness
**High** for Security-led narrative with D03 footage + explainable card.

### Judge Perspective
Lead with gate behaviour events + privacy; demote ERP depth.

### Next Priority
Dress-rehearse zones; optional NotificationService stub.
