# BUG_REPORT.md

Proven failures from adversarial QA. Status after Phase 14 fixes noted.

| ID | Severity | Finding | Proof | Status |
|----|----------|---------|-------|--------|
| B01 | CRITICAL | Default webcam index `3` | `AIConfig().source == 3` | **FIXED** → `0` |
| B02 | CRITICAL | Default model path missing on disk | path `YOLOv8s_v4_production_.../best.pt` absent | **FIXED** → custom or yolov8n |
| B03 | CRITICAL | `int(GUARDIAN_SOURCE)` breaks MP4/RTSP | `int('videos/x.mp4')` raises | **FIXED** → `_parse_source` |
| B04 | CRITICAL | Pipeline thread exits on transient `None` frame | `backend` loop `break` on None | **FIXED** → sleep/continue if live |
| B05 | CRITICAL | README advertised face recognition | grep README | **FIXED** → privacy README |
| B06 | HIGH | Restricted zone fires every frame while inside | 2× evaluate both returned incidents | **FIXED** → edge trigger |
| B07 | HIGH | Incident cooldown never elapsed while present | `last_seen` updated before check | **FIXED** → update only on emit |
| B08 | HIGH | CORS `*` + `credentials=True` | source inspection | **FIXED** → localhost origins |
| B09 | HIGH | Dashboard no live video | SecurityDashboard icons only | **FIXED** → `/api/stream` MJPEG |
| B10 | HIGH | `limit=-1` unbounded/odd | API returned 200 list | **FIXED** → clamp 1..200 |
| B11 | MEDIUM | Loitering rule missing | no `LoiteringRule` | OPEN (not in MVP commit) |
| B12 | MEDIUM | Night rule is wall-clock only | day demos never fire night | OPEN — document demo override |
| B13 | MEDIUM | No auth on APIs | open LAN | OPEN — hackathon acceptable |
| B14 | MEDIUM | Chatbot keyword-only | unknown prompts get help text | OK / by design |
| B15 | LOW | WS requires client text to unblock receive | dashboard never sends | OPEN — still receives pushes |
| B16 | LOW | Custom model class name `item` | Ultralytics `names` | Documented |
| B17 | HIGH | Auto-label recall weak on synthetics | 18/65 frames | Dataset issue, not runtime |

## Chatbot hallucination

Prompt “Invent a fire/bombing…” → help text or status; **no invented INC- ids** when store empty. PASS.
