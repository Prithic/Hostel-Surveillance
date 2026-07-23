# Safe Delete Report — GuardianAI

**Date:** 2026-07-23  
**Rule:** Delete only with proof. No source/architecture changes.

---

## Deleted (executed)

| Path | Size | Proof | Impact |
|------|------|-------|--------|
| `ai/__pycache__/`, `backend/__pycache__/`, `training/__pycache__/` | small | Bytecode cache | Regenerated on import |
| `YOLOv8s_v4_production/` (incl. `best.pt`) | ~85 MB | SHA256 **identical** to `models/custom/yolov8s_v4_production.pt` | None — custom weights retained |
| `YOLOv8s_v4_production_20260722-180642.zip` | ~72 MB | Same weight archive; already gitignored | None — `models/custom/*.pt` remains |

**Post-delete verification:** `models/custom/yolov8s_v4_production.pt` and `models/yolov8n.pt` still present; `/health` still `model_present: true`; frontend HTTP 200.

---

## Not deleted (intentional)

| Path | Why kept |
|------|----------|
| `hostel footage *.mp4` | Demo inputs (gitignored) |
| `models/**/*.pt` | Runtime inference (gitignored) |
| `frontend/node_modules/` | Local install (gitignored) |
| `data/guardian.db` | Local incident history (gitignored) |
| `frontend/src/components/PagePlaceholder.jsx` | Unused-looking but not dependency-proven for delete this pass |
| `ai/demo*.py`, `compare_videos.py` | Manual QA tools |
| Tracked dataset sample JPGs | Demo/docs samples |
| `.cursor/rules/ponytail.mdc` | Still in git index historically — recommend untrack, not silent delete of content |

---

## Recommended next (needs your approval to stage)

1. Ensure `.gitignore` updates are committed (includes `.cursor/`, `YOLOv8s_v4_production/`, sqlite sidecars).  
2. `git rm -r --cached .cursor` so IDE files leave the index (files can remain locally).  
3. Do **not** force-add `*.pt` / `*.mp4` / `*.zip`.
