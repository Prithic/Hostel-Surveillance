# One-time setup after git pull (Windows PowerShell)
# Usage:  .\scripts\setup.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> Python deps" -ForegroundColor Cyan
python -m pip install -r requirements.txt
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example"
}

Write-Host "==> Frontend deps" -ForegroundColor Cyan
Set-Location "$Root\frontend"
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created frontend/.env from .env.example"
}
npm install
Set-Location $Root

Write-Host ""
Write-Host "Setup done. Start with:" -ForegroundColor Green
Write-Host "  .\scripts\start.ps1"
Write-Host "Then open http://127.0.0.1:5173/login"
