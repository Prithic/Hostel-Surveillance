# Architecture audit (QA)

Target:

Camera → Detection → Tracking → Zone → Rules → Incidents → Backend → WS → Frontend → Chatbot

| Coupling risk | Finding |
|---------------|---------|
| Backend owns pipeline thread | Acceptable for MVP; hard to multi-cam |
| Rules → Incident → Alert | Clean; engines injectable |
| Chatbot reads IncidentEngine only | Good — cannot invent store rows |
| Dashboard polls + WS | Redundant but resilient |
| YOLO inside ByteTrack.track() | Detector module unused in MVP pipeline path |

**Shortcut found:** `GuardianPipeline` uses ByteTrack’s internal detect, not `YOLODetector`. Sprint 1 detector still used by `ai.demo`. Documented, not rewritten (working path).
