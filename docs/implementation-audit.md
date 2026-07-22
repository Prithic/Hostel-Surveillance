# Phase 0 — Implementation Audit (GuardianAI)

Date: 2026-07-22  
Branch: `prithic`  
Role: Lead Software Engineer

## Folder structure

| Path | Status |
|------|--------|
| `ai/` | Working: stream, YOLO, ByteTrack, demos; contracts for zones/rules |
| `training/` | Present (uncommitted): download/validate/train/eval — not auto-run |
| `datasets/` | YOLO layout + COCO person script; empty hostel labels |
| `backend/` | **Empty** (`.gitkeep` only) |
| `frontend/` | **Empty** locally; full Vite app on `origin/sharan` (`src/`) |
| `models/` | `yolov8n.pt` present (gitignored) |
| `docs/` | Training pipeline notes |

## Implementation status

| Capability | Status |
|------------|--------|
| Webcam VideoStream (threaded MJPG) | Done |
| YOLO person detect + Sprint 1 demo | Done |
| ByteTrack + Sprint 2 demo | Done |
| Zone Manager (polygon) | Contract only |
| Rule Engine (zone/crowd/night/tailgate) | Contract only |
| Incident / Alert engines | Missing |
| FastAPI + WebSocket | Missing |
| Dashboard live/alerts | On `sharan` (dummy data) |
| Chatbot | On `sharan` (dummy) |
| Full training run | Prepared, **not** started |

## Branch map (after fetch)

| Branch | Tip | Contents vs `prithic` |
|--------|-----|------------------------|
| `origin/prithic` | AI pipeline | Current work |
| `origin/main` | Merged PRs from prithic | Behind latest AI fixes |
| `origin/sharan` | Hostel AI Vite frontend + chatbot pages | No overlap with `ai/` |
| `origin/tk` | `widget-preview.html` | Isolated preview |

No remote branches named `frontend` / `backend` / `chatbot` / `ai`.

## Risks / notes

- Local uncommitted: training package, dataset docs, `.gitignore`, `requirements.txt`, `ai/config.py` (source default `3` — should be `0` for portability).
- `ai/test_stream.py` is a manual webcam smoke script.
- Teammate frontend includes Attendance / Login — out of privacy MVP scope; keep pages but wire **Security + Chatbot** to real APIs first.
- Do **not** rewrite working `opencv_stream`, `yolo_detector`, `bytetrack`, demos.

## Build / deps

- Python: opencv, ultralytics, torch, lap, PyYAML — OK for AI demos.
- Frontend deps: only on `sharan` (`package.json`) — need install after merge.
- Backend: no FastAPI app yet.

## Audit verdict

**Proceed** with: commit WIP → merge `sharan`/`tk` safely into layout → implement missing AI engines + thin FastAPI → wire SecurityDashboard/Chatbot → dataset manifest → docs. No architecture rewrite.
