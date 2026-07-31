# One-command HackSprint demo (D03 gate footage + frontend)
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\demo.ps1
#   powershell -ExecutionPolicy Bypass -File .\scripts\demo.ps1 -StartSec 180

param(
  [double]$StartSec = 180,
  [string]$Video = "Hostel footage\D03_20260729142351.mp4"
)

$ErrorActionPreference = "Stop"
& "$PSScriptRoot\start-video.ps1" -Video $Video -StartSec $StartSec
