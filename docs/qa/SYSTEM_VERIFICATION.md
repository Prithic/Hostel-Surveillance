# SYSTEM_VERIFICATION.md

## Architecture chain

```
Camera/Video → YOLO/ByteTrack → Zones → Rules → Incidents → Alerts
 → FastAPI (REST + WS + MJPEG) → Security Dashboard + Chatbot
```

| Hop | Verified? | How |
|-----|-----------|-----|
| Webcam / MP4 | YES | OpenCV stream + synthetic MP4 read |
| RTSP | PARTIAL | Source parser accepts URL; no live RTSP in lab |
| Detection | YES | YOLO demos + pipeline |
| Tracking | YES | ByteTrack demo + lifecycle test |
| Zones | YES | PolygonZoneManager unit + JSON |
| Rules | YES | Edge zone, crowd, night, tailgate unit |
| Incidents | YES | Cooldown / dedupe tests |
| Backend REST | YES | TestClient |
| WebSocket | PARTIAL | Code path present; push on alert |
| MJPEG | YES | Endpoint exists; browser `<img>` |
| Frontend security page | YES | Wired to APIs + stream |
| Chatbot | YES | Keyword replies; no hallucination |

## Missing for “perfect” chain

- Loitering rule
- Auth
- Real RTSP soak test
- Night demo clock override UI
