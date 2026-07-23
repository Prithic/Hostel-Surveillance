# Secret Audit — GuardianAI

**Date:** 2026-07-23  
**Severity model:** Critical / High / Medium / Low / Info  

---

## Findings

| Severity | Location | What | Assessment |
|----------|----------|------|------------|
| **Medium** | `backend/auth.py` | Default `GUARDIAN_ADMIN_PASSWORD=Warden@2026` | Demo default; override via env. Documented. |
| **Medium** | `frontend/src/pages/SecurityDashboard.jsx` + `frontend/.env.example` | Default Guardian password in client bundle path | Demo convenience; use env for real events. |
| **Medium** | `frontend/src/auth.js` | `ADMIN_PASSWORD = 'Warden@2026'` | Client-side gate; not production auth. |
| **Medium** | `trinity-api/utils/generateTokens.js` | Fallback JWT secrets `nestos_super_secret_*` | Must set `JWT_SECRET` in real deploys. |
| **Medium** | `trinity-api/seed/seedData.js` | Seed passwords `siet@2727`, `admin@2026` (hashed at seed) | Demo seed data — expected for hackathon. |
| **Low** | `trinity-api/.env.example` | Placeholder `EMAIL_PASS`, Mongo URI localhost | Example only — OK. |
| **Info** | Docs / GO_NO_GO | Repeat demo credentials | Expected for judges. |
| **Info** | No live `.env` files found in tree | — | Good. |

**Not found:** cloud API keys, AWS keys, private SSH keys, certificates, production connection strings with embedded passwords.

---

## `.env` hygiene

| File | Status |
|------|--------|
| Root `.env.example` | **Added** this cleanup |
| `frontend/.env.example` | Present |
| `trinity-api/.env.example` | Present |
| `.env` in `.gitignore` | Yes |
| `frontend/.env` / `trinity-api/.env` ignored | Yes |

---

## History cleanup (do NOT auto-rewrite)

If demo passwords or JWT fallbacks were ever committed (they are in source as defaults), **rotating** them for any post-hackathon public deploy is enough for MVP.

Full `git filter-repo` / BFG history rewrite is **not** required for HackSprint submission unless the team published real private keys (none found).

**If you later must purge secrets from history:**

1. Rotate all credentials first.  
2. Use `git filter-repo` (or BFG) on a fresh clone.  
3. Force-push only with explicit team approval.  
4. Never run history rewrite casually on `main` during the hackathon.

---

## Required for collaborators

```powershell
copy .env.example .env
copy frontend\.env.example frontend\.env
copy trinity-api\.env.example trinity-api\.env
# edit passwords before any shared hosting
```
