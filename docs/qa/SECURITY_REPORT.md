# SECURITY_REPORT.md

| Check | Result | Action |
|-------|--------|--------|
| Secrets / API keys in repo | None found | OK |
| `.env` committed | No | OK |
| CORS | Was `*` + credentials (**bad**); now localhost Vite origins | Fixed |
| Input validation | Chat requires non-empty message; limits clamped | Improved |
| AuthN/AuthZ | **None** | Accept for hackathon LAN demo; block public deploy |
| Path traversal | Zone JSON from trusted path only | OK |
| Dependency vulns | Not scanned with `pip-audit` this pass | TODO pre-prod |
| Webcam/index injection | Source env parsed safely as int or string | Fixed |
| Chatbot invents incidents | Rejected adversarial prompts | OK |
| Privacy | README no longer sells face ID | Fixed |

## Residual risk

Anyone on LAN can POST chat / read incidents. Label demo network as trusted.
