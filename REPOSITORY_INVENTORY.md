# Repository Inventory — GuardianAI

**Date:** 2026-07-23  
**Scope:** Full tree scan for public collaboration readiness  
**Policy:** KEEP unless proven safe to remove  

Approximate working tree size after cleanup (excl. `.git` / `node_modules`): **~126.5 MB** (mostly local weights + demo MP4s, both gitignored).

---

## Top-level

| Path | Size (approx) | Purpose | Decision | Reason |
|------|---------------|---------|----------|--------|
| `ai/` | 0.2 MB | YOLO/ByteTrack/rules/pipeline | **KEEP** | Core AI |
| `backend/` | 0.1 MB | FastAPI GuardianAI API | **KEEP** | Core backend |
| `frontend/` | ~98 MB on disk (mostly `node_modules`) | Trinity Engine UI + Security | **KEEP** source; ignore `node_modules` | Product UI |
| `trinity-api/` | 0.1 MB | Nest/Trinity Express API | **KEEP** | ERP auth companion |
| `datasets/` | ~17 MB | Zones, synthetic docs/samples | **KEEP** tracked docs/zones/samples | Demo + training docs |
| `models/` | ~92 MB local | Weights (gitignored `.pt`) | **KEEP** dir + README; ignore `.pt` | Runtime needs local weights |
| `training/` | 0.1 MB | Train/eval scripts | **KEEP** | Development |
| `docs/` | <0.1 MB | Runbooks / QA / chatbot notes | **KEEP** | Documentation |
| `videos/` | empty+gitkeep | Video drop folder | **KEEP** | Demo input path |
| `data/` | local SQLite | Incident DB | **KEEP** locally; **IGNORE** in git | Runtime state |
| `.cursor/` | tiny | Cursor rules | **REVIEW→IGNORE** | IDE; tracked historically — stop tracking |
| `AGENTS.md` | tiny | Dev policy | **KEEP** | Required |
| `README.md` | tiny | Startup | **KEEP** | Required |
| `requirements.txt` | tiny | Python deps | **KEEP** | Required |
| `GO_NO_GO_DECISION.md` | tiny | Release decision | **KEEP** | Hackathon |
| `HACKATHON_READINESS.md` | tiny | Demo checklist | **KEEP** | Hackathon |
| `TECHNICAL_DEBT.md` | tiny | Known debt | **KEEP** | Honesty |
| `hostel footage 1.mp4` / `2.mp4` | ~7 MB | Demo videos | **KEEP** locally; **IGNORE** git | Needed for offline demo |
| `YOLOv8s_v4_production/` | was 85 MB | Extracted duplicate weights | **REMOVE** (done) | SHA256 identical to `models/custom/*.pt` |
| `YOLOv8s_v4_production_*.zip` | was 72 MB | Zip of same weights | **REMOVE** (done) | Duplicate; gitignored |
| `.env.example` | tiny | Env template | **KEEP** (added) | Collaborator onboarding |
| `LICENSE` | — | License file | **MISSING** | Recommend add later (not blocking) |

---

## Generated / cache (never commit)

| Path | Decision | Reason |
|------|----------|--------|
| `**/node_modules/` | IGNORE | Reinstall via npm |
| `**/__pycache__/` | REMOVE locally (done) + IGNORE | Regenerable |
| `data/*.db` | IGNORE | Local runtime DB |
| `*.pt` / `*.mp4` / `*.zip` | IGNORE | Large binaries; obtain separately |
| `dist/` `build/` `coverage/` | IGNORE | Build outputs |

---

## Frontend (`frontend/src`)

| Area | Decision | Reason |
|------|----------|--------|
| Pages (Dashboard…Security) | **KEEP** | Trinity + Guardian Security |
| `public/tk-chatbot/` | **KEEP** | Live assistant |
| `widget-preview.html` | **KEEP** | tk preview |
| `PagePlaceholder.jsx` | **REVIEW** | No runtime import (docs mention only) — keep for now |
| `node_modules/` | IGNORE | Not for git |

---

## AI modules

| Module | Decision | Reason |
|--------|----------|--------|
| `pipeline.py`, `rule_engine.py`, `incidents.py`, … | **KEEP** | Production path |
| `demo.py`, `demo_track.py`, `demo_mvp.py`, `compare_videos.py` | **KEEP** | Manual demos / QA |
| `test_integration.py`, `test_stream.py` | **KEEP** | Tests |

---

## Decision legend

- **KEEP** — required for develop / test / run / docs / demo  
- **REMOVE** — proven safe (duplicate or regenerable)  
- **REVIEW** — unused-looking; keep until dependency proof  
- **IGNORE** — must stay out of git (local only)
