# READY FOR REVIEW — HackSprint Final

**Branch:** `feat/real-product`  
**Status:** GO — stack verified 2026-07-31 morning

---

## Start (use this)

```powershell
cd D:\Hackathons\HACKSPRINT
powershell -ExecutionPolicy Bypass -File .\scripts\demo.ps1
```

Opens API `:8000` + UI `:5173` with D03 footage seeking to **180s** (people appear).

Webcam only:

```powershell
.\scripts\start.ps1
```

Open: **http://127.0.0.1:5173/login**

| Role | Email | Password |
|------|-------|----------|
| Warden | `admin@guardian.ai` | `Warden@2026` |
| Student | `student@hostel.local` | `Student@2026` |
| Laundry | `laundry@hostel.local` | `Laundry@2026` |

Warden login goes straight to **Security**.

---

## 2-minute demo script

1. **Login as Warden** → Security (stream + heartbeat + incidents)
2. If feed empty at start: set **Start at (sec) = 180** → click D03 clip / Play video
3. Point at zones (apron / flank), explainable incident card, **no faces**
4. **Sign out** → Student → **SOS**
5. Warden → Security → **Resolve** SOS
6. Stop. Do not deep-dive ERP.

---

## If something breaks

| Symptom | Fix |
|---------|-----|
| `start.ps1` parse error | Pull latest; scripts are ASCII-only now |
| Broken image / no video | Ctrl+F5; or Retry stream; or re-login |
| FPS ok but no people | Seek **180** on D03 |
| Port in use | Close old PowerShell API/frontend windows |
| `npm run dev` from repo root | Wrong — use scripts or `cd frontend` |

---

## Verified this morning

- Gate rules + integration + honesty tests: **PASS**
- Live RBAC / SOS / stream auth: **0 fails**
- Stream URL with `token` + `t`: **200 MJPEG**
- Camera online, frames processing

---

## Say to judges

> GuardianAI is privacy-first gate security intelligence. We detect behaviour events — not faces. Humans verify identity.

**Do not claim:** face recognition, real SMS, 99% accuracy, campus ERP integrations.
