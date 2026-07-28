# FEATURE_MATRIX — live product (feat/real-product)

**Product:** Trinity Engine hostel OS + GuardianAI CCTV  
**Auth:** SQLite users (PBKDF2) — Warden / Student / Laundry Staff

## REAL

| Feature | Evidence |
|---------|----------|
| Multi-user login | `backend/users.py` + `POST /api/auth/login` |
| Role-gated nav + routes | `frontend/src/navAccess.js`, `RequireRole.jsx` |
| Role-gated API | append/patch/replace + incidents/config require matching roles |
| Hostel state | `backend/hostel.py` → SQLite `hostel_state` |
| Attendance roster | PATCH `attendanceRoster` (Warden) |
| Leave apply / grant | Student append; Warden patch status |
| Complaints | append + Warden status patch |
| Mess meal plan + ratings | replace `mealPlan`; append `messFeedback` |
| Laundry book / claims / advance | append + patch (`Laundry Staff` + Warden) |
| Visitors entry / exit | Warden append + patch exit |
| Notices / events | Warden append |
| Inspection schedule + logs | replace `nextInspection`; append `inspections` |
| Inventory edit | Warden patch qty/condition |
| Fees + record payment | Warden append `paymentHistory` + replace `feeStatus` |
| SOS | `POST /api/hostel/sos` → event + critical incident + notification + WS |
| In-app notifications | Topbar bell ← `notifications` store |
| Security command center | stream, incidents, resolve, WS (Warden) |
| Runtime config edit | `PUT /api/config` hot-swaps thresholds (Warden) |
| Warden assistant | `POST /api/chat` over live data |
| Password change | `POST /api/auth/password` |

## LIMITS (not fake — just scoped)

| Item | Limit |
|------|-------|
| MJPEG stream | Unauthenticated (LAN `<img>`) |
| Chat | Keyword Q&A, not LLM |
| SMS / email | Not integrated |
| Payment gateway | Manual record only |
| Face recognition | Not claimed |

## DEFERRED

| Item | Notes |
|------|-------|
| `trinity-api/` Mongo | Not used by the console |

## Run

```powershell
.\scripts\setup.ps1
.\scripts\start.ps1
```
