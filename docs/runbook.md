# Runbook — Trinity + GuardianAI

## Fast path

```powershell
.\scripts\setup.ps1
.\scripts\start.ps1
```

Open http://127.0.0.1:5173/login

## AI-only demos (optional)

```powershell
python -m ai.demo
python -m ai.demo_track
python -m ai.demo_mvp
```

## Self-checks

```powershell
python -m ai.test_product_working
python -m ai.test_product_honesty
```

## Key APIs

- `POST /api/auth/login` `{email,password}`
- `GET /api/hostel/state`
- `POST /api/hostel/append` / `PATCH /api/hostel/item` / `PUT /api/hostel/key`
- `POST /api/hostel/sos`
- `GET|PUT /api/config` (Warden)
- `GET /api/incidents` (Warden)
- `WS /ws/alerts?token=…`
