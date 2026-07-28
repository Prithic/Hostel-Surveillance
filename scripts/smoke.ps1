# Quick API smoke (API must already be running on :8000)
$ErrorActionPreference = "Stop"
$base = "http://127.0.0.1:8000"

function Post($path, $body, $token) {
  $headers = @{ "Content-Type" = "application/json" }
  if ($token) { $headers["Authorization"] = "Bearer $token" }
  Invoke-RestMethod -Uri "$base$path" -Method POST -Headers $headers -Body ($body | ConvertTo-Json)
}

Write-Host "Health..." -ForegroundColor Cyan
Invoke-RestMethod "$base/health" | Out-Null

Write-Host "Login warden..." -ForegroundColor Cyan
$login = Post "/api/auth/login" @{ email = "admin@guardian.ai"; password = "Warden@2026" } $null
$token = $login.token
if (-not $token) { throw "No token" }

Write-Host "Hostel state..." -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/hostel/state" -Headers @{ Authorization = "Bearer $token" } | Out-Null

Write-Host "SOS..." -ForegroundColor Cyan
Post "/api/hostel/sos" @{ note = "smoke"; location = "Lobby" } $token | Out-Null

Write-Host "SMOKE OK" -ForegroundColor Green
