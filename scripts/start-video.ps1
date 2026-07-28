# Start stack with a judge/demo video file (loops forever)
# Usage:
#   .\scripts\start-video.ps1 -Video .\videos\judge_clip.mp4
#   .\scripts\start-video.ps1 -Video "D:\USB\hostel_gate.mp4"

param(
  [Parameter(Mandatory = $true)]
  [string]$Video
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Test-Path $Video)) {
  throw "Video not found: $Video"
}
$abs = (Resolve-Path $Video).Path

if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }
if (-not (Test-Path "frontend\.env")) { Copy-Item "frontend\.env.example" "frontend\.env" }

$apiCmd = @"
Set-Location '$Root'
`$env:GUARDIAN_SOURCE='$abs'
`$env:GUARDIAN_CAMERA_ID='judge-footage'
`$env:GUARDIAN_ENABLE_CAMERA='1'
`$env:PYTHONUNBUFFERED='1'
Write-Host "Guardian API — source=$abs" -ForegroundColor Cyan
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
Write-Host "Started with judge video:" -ForegroundColor Green
Write-Host "  $abs"
Write-Host "Open http://127.0.0.1:5173/login → Login as Warden → Security"
Write-Host "Clip loops automatically. Switch back to webcam from Security UI."
