# PROJECT_AUDIT.md

Date: 2026-07-22 · Auditor: Principal QA (adversarial)

## Structure

| Area | Status |
|------|--------|
| `ai/` pipeline modules | Present; demos + MVP pipeline |
| `backend/main.py` | FastAPI hub |
| `frontend/` | Vite React (sharan import) |
| `training/` | Dataset prep + train entrypoints |
| `datasets/guardian_synthetic/` | Built, small |

## Dead / stale / risky

| Item | Severity | Notes |
|------|----------|-------|
| README previously sold face recognition / attendance | CRITICAL (fixed) | Embarrassing for privacy pitch |
| `AIConfig.source=3` + broken model path | CRITICAL (fixed) | Wrong camera / missing weights |
| `backend/.gitkeep` with real backend | LOW (removed) | Noise |
| `ai/compare_videos.py` untracked | LOW | Scratch util |
| `ai/test_integration.py` shallow | MEDIUM | Does not prove E2E |
| Duplicate `/health` and `/api/status` | LOW | Intentional alias |
| Root zip `YOLOv8s_v4_production_*.zip` | MEDIUM | 75MB local; gitignored `*.zip` |
| Stale branches `sharan`/`tk` | INFO | Content imported; histories diverge from `prithic` |

## Dependencies

- Python: opencv, ultralytics, fastapi, uvicorn, lap, PyYAML — used
- Frontend: framer-motion, recharts, react-router — used (some pages still dummy)

## TODOs / FIXMEs

No explicit TODO/FIXME markers in core AI. Silent `except Exception: pass` in alert fan-out and WS cleanup (acceptable with comment).

## Circular imports

None found in import smoke tests.
