# Dead Code Report — GuardianAI

**Date:** 2026-07-23  
**Policy:** Do not delete unless dependency analysis is conclusive.

| Asset | Confidence unused | Referenced by | Action |
|-------|-------------------|---------------|--------|
| `frontend/src/components/PagePlaceholder.jsx` | **High** | Only `frontend/README.md` mention | **KEEP** this pass |
| `ai/demo.py`, `demo_track.py`, `demo_mvp.py` | Low (tools) | Manual CLI demos | **KEEP** |
| `ai/compare_videos.py` | Medium | Manual QA | **KEEP** |
| `ai/test_stream.py` | Low | Smoke helper | **KEEP** |
| `frontend/src/data/dummyData.js` | Low | Many Trinity ERP pages | **KEEP** (ERP shell) |
| `docs/qa/*` older reports | Low | Historical | **KEEP** |
| WebSocket client in frontend | N/A (missing feature) | Backend has `/ws/alerts` | Document debt — not dead file |
| `trinity-api` seed passwords | N/A | Seed script | **KEEP** |

No high-confidence dead **runtime** modules were deleted in this cleanup.

If a second pass is desired after the hackathon, start with `PagePlaceholder.jsx` only after confirming no dynamic import.
