# Local hostel footage (mp4 gitignored)

## `Hostel footage/` — original Hikvision exports (this machine)

| File | Cam | Size | Length | Resolution |
|------|-----|------|--------|------------|
| `D03_20260729142351.mp4` | D03 | ~398 MB | ~22 min | 2560×1440 @ 20fps |
| `D06_20260729142351.mp4` | D06 | ~280 MB | ~22 min | 1920×1080 @ 25fps |
| `D03_20260728154217.mp4` | D03 | ~1 GB | ~51 min | 2560×1440 |
| `D03_20260728163314.mp4` | D03 | ~1 GB | ~51 min | 2560×1440 |
| `D06_20260728160235.mp4` | D06 | ~1 GB | ~76 min | 1920×1080 |

Matching `.txt` files are Hikvision export logs (camera connect events).

**Demo tip:** use the two `*142351` (~22 min) clips first — smaller and easier on CPU.

## How to play
1. `.\scripts\start.ps1`
2. Warden → **Security** → click a clip button (auto-listed) or **Play video**
3. Or: `.\scripts\start-video.ps1 -Video ".\Hostel footage\D03_20260729142351.mp4"`

Pipeline auto-downscales wide frames (default max width 1280) so 1440p footage still runs on CPU.
Videos loop. **Use webcam** switches back.
