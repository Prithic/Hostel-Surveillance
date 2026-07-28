#!/usr/bin/env bash
# Start API + frontend (Ctrl+C stops both)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NO_CAMERA=0
[[ "${1:-}" == "--no-camera" ]] && NO_CAMERA=1

[[ -f .env ]] || cp .env.example .env
[[ -f frontend/.env ]] || cp frontend/.env.example frontend/.env

export GUARDIAN_ENABLE_CAMERA=$([[ "$NO_CAMERA" == 1 ]] && echo 0 || echo 1)
export PYTHONUNBUFFERED=1

cleanup() {
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Guardian API  http://127.0.0.1:8000"
echo "Frontend      http://127.0.0.1:5173/login"
echo "Warden:  admin@guardian.ai / Warden@2026"
echo "Student: student@hostel.local / Student@2026"
echo "Laundry: laundry@hostel.local / Laundry@2026"

python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
sleep 2
(cd "$ROOT/frontend" && npm run dev -- --host 127.0.0.1 --port 5173) &
wait
