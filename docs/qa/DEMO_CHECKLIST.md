# DEMO_CHECKLIST.md — HackSprint final (feat/real-product)

## T-30 min

- [ ] `git checkout feat/real-product && git pull`
- [ ] `powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1` (once)
- [ ] Prefer judge clip: `Hostel footage/D03_*142351.mp4` (shorter)
- [ ] Optional: `$env:GUARDIAN_LOITER_S="15"` for faster loiter beat
- [ ] YOLO weights present or allow first-run download

## Start

```powershell
# Preferred: D03 with seek past empty lead-in (~3 min until people appear)
powershell -ExecutionPolicy Bypass -File .\scripts\start-video.ps1 -Video "Hostel footage\D03_20260729142351.mp4" -StartSec 180

# Webcam:
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

Or manual:

```powershell
$env:GUARDIAN_SOURCE="Hostel footage\D03_20260729142351.mp4"
$env:GUARDIAN_START_SEC="180"
$env:GUARDIAN_LOITER_S="15"
$env:GUARDIAN_ENABLE_CAMERA="1"
```

Open http://127.0.0.1:5173/login  
Warden: `admin@guardian.ai` / `Warden@2026`

## Live script (90–120s)

1. **Security** — annotated feed, FPS, people (>0 within ~15s if StartSec=180); yellow apron + red flank  
2. Show **explainable incident** card (What/Where/When/Action)  
3. Privacy line: **behaviour events, no faces, no identity**  
4. **Student** login → SOS → back to Warden Security → Resolve  
5. Optional: Leave apply / Laundry advance (SQLite mutations)

## Abort criteria

- Camera offline >15s / people stuck at 0 → confirm `GUARDIAN_START_SEC=180` or Play video again from Security  
- Chat invents → stop; show live incidents only (chat is keyword, not LLM)

## Do not claim

- Facial recognition / student ID from video  
- Real SMS/WhatsApp delivery  
- Campus ERP integrations  
- Corridor “restricted room” surveillance (footage is gate/outdoor)

## Accounts

| Role | Email | Password |
|------|-------|----------|
| Warden | admin@guardian.ai | Warden@2026 |
| Student | student@hostel.local | Student@2026 |
| Laundry | laundry@hostel.local | Laundry@2026 |
