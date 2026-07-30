# SHIP_REPORT — GuardianAI Final (HackSprint'26)

**Date:** 2026-07-30  
**Branch:** `feat/real-product`  
**Mode:** FINAL SHIP — stability over features  

---

## Architecture Review (verdict)

GuardianAI is a **privacy-first gate/perimeter behaviour intelligence + SQLite hostel ops shell**.  
Spine: Hikvision/webcam → YOLO+ByteTrack → gate zones → rules → IncidentEngine → SQLite → FastAPI → WS/Dashboard.

**Ship as Security-led product.** ERP is seeded but mutations persist — narrate honestly.

---

## Bugs Fixed (this ship pass)

| Fix | Why |
|-----|-----|
| Explainable Security cards + gate rules (`group_entry`, loiter, camera_health) | Decision support |
| Gate-oriented zones (apron loiter + flank no-go) | Outdoor CCTV honesty |
| File-loop tracker/rule reset | Demo stability |
| Chat + widget Warden-only | Privacy / RBAC |
| Block SOS via generic hostel append | Only real SOS path creates incidents |
| Remove shared `currentUser` overwrite | Stop identity clobber across roles |
| Student cannot replace ERP `analytics` | Honesty |
| Authenticated MJPEG (`cookie` / `?token=`) | Close open stream |
| SOS single WS publish | No double alert flicker |
| Leave Pending ≠ “Denied” | Workflow honesty |
| Dashboard Security/Analytics warden-only | Role UX |
| Settings profile from login session | No seed overwrite |
| SOS `emergency_sos` labels + action | Explainability |

---

## Tests Executed

```text
python -m ai.test_gate_rules
python -m ai.test_integration
```

(Re-run after this pass before push.)

---

## Remaining Risks (accept for tomorrow)

| Risk | Mitigation |
|------|------------|
| Zone polygons approximate vs real D03 FOV | Recalibrate live if FP high; don't claim perfect calibration |
| Daytime Hikvision file ≠ night rule | Use Config night hours or narrate footage clock |
| Loiter default 45s | Set `GUARDIAN_LOITER_S=15` for short demo beat |
| Sessions in-memory | Don't restart API mid-demo |
| Hostel seed looks “fake” until mutated | Lead with Security + SOS mutation |
| Stale docs under `docs/qa/` | Prefer this file + FEATURE_MATRIX + JUDGE_BRIEFING |

---

## Technical Debt (DEFER — do not touch tomorrow morning)

- NotificationService channel abstraction (WhatsApp/SMS stubs)
- Rename `require_warden` → `require_session`
- Per-user hostel data partitions
- Persist sessions across restart
- Real QR generation for outpass
- Digital Twin / face / ALPR — **rejected forever for product law**

---

## Performance Summary

YOLO path unchanged. Extra loiter/health bookkeeping negligible. 1440p downscale via `GUARDIAN_MAX_WIDTH` remains.

---

## Demo Readiness

**GO** for HackSprint final with rehearsed script:

1. Warden login → Security → Play D03 `*142351`  
2. Show zones (apron yellow / flank red) + explainable incident card  
3. Student SOS → Warden resolves on Security  
4. Privacy line: behaviour, not faces  
5. Optional: leave apply / laundry advance  

---

## Judge Perspective

Win: “Warden decision support without invading privacy.”  
Lose: “YOLO boxes + hostel CRUD.”

---

## Next Priority

**Dress rehearsal only.** No feature work after this commit unless a showstopper appears.
