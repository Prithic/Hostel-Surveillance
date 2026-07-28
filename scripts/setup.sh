#!/usr/bin/env bash
# One-time setup after git pull
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Python deps"
python3 -m pip install -r requirements.txt
[[ -f .env ]] || cp .env.example .env

echo "==> Frontend deps"
cd "$ROOT/frontend"
[[ -f .env ]] || cp .env.example .env
npm install
cd "$ROOT"

echo ""
echo "Setup done. Start with:  ./scripts/start.sh"
echo "Then open http://127.0.0.1:5173/login"
