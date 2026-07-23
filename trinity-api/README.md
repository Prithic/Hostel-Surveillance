# Trinity Engine API (Express + Mongo)

Hostel ERP auth/data API from the `frontend` branch (Trinity Engine).

**Not** the GuardianAI Python service. That stays in `/backend` (FastAPI :8000).

## Run

```powershell
cd trinity-api
copy .env.example .env
npm install
npm run seed
npm run dev
```

Default: `http://127.0.0.1:5000`

Pair with Trinity Engine UI:

```powershell
cd trinity-engine
npm install
npm run dev
```

UI: `http://127.0.0.1:5174`
