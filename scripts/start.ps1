# Start API (:8000) + Vite (:5173) in two windows
# Usage:  .\scripts\start.ps1
# Optional:  .\scripts\start.ps1 -NoCamera

param(
  [switch]$NoCamera
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}
if (-not (Test-Path "frontend\.env")) {
  Copy-Item "frontend\.env.example" "frontend\.env"
}

$cam = if ($NoCamera) { "0" } else { "1" }

$apiCmd = @"
Set-Location '$Root'
`$env:GUARDIAN_ENABLE_CAMERA='$cam'
`$env:PYTHONUNBUFFERED='1'
Write-Host 'Guardian API http://127.0.0.1:8000' -ForegroundColor Cyan
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
"@

$webCmd = @"
Set-Location '$Root\frontend'
Write-Host 'Frontend http://127.0.0.1:5173' -ForegroundColor Cyan
npm run dev -- --host 127.0.0.1 --port 5173
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $apiCmd
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", $webCmd

Write-Host ""
Write-Host "Started API + frontend in new windows." -ForegroundColor Green
Write-Host "Open http://127.0.0.1:5173/login"
Write-Host "Accounts:"
Write-Host "  Warden   admin@guardian.ai     / Warden@2026"
Write-Host "  Student  student@hostel.local  / Student@2026"
Write-Host "  Laundry  laundry@hostel.local  / Laundry@2026"
if ($NoCamera) {
  Write-Host "(Camera disabled — hostel ERP still works; Security stream offline)" -ForegroundColor Yellow
}
