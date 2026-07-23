# Gitignore Review — GuardianAI

**Date:** 2026-07-23

---

## Before → After

| Pattern | Before | After |
|---------|--------|-------|
| `__pycache__/`, `*.py[cod]`, `.venv/` | Yes | Yes |
| `.env` | Yes | Yes |
| `*.pt`, `*.mp4`, `*.zip`, `data/`, `runs/` | Yes | Yes (+ `models/**/*.pt`) |
| `node_modules/`, `dist/` | Yes | Yes (+ `build/`, `coverage/`) |
| `.pytest_cache/` | No | **Added** |
| `*.sqlite-shm`, `*.sqlite-wal` | No | **Added** |
| `.cursor/` | No (was tracked) | **Added** |
| `YOLOv8s_v4_production/` | No | **Added** |
| `*.log`, `*.tmp`, `tmp/`, `cache/` | No | **Added** |
| App `.env` paths | Partial | frontend + trinity-api |

---

## Verification

```
git check-ignore -v models/yolov8n.pt          → ignored
git check-ignore -v "hostel footage 1.mp4"   → ignored
git check-ignore -v data/guardian.db         → ignored
```

---

## Follow-up (manual, needs approval)

Tracked IDE files still in index:

- `.cursor/rules/ponytail.mdc`
- `.cursor/settings.json`

Recommended (when you approve staging):

```powershell
git rm -r --cached .cursor
```

Local files can remain; they will stop being committed.
