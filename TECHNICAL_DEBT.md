# Technical Debt — GuardianAI v1.0.0 (post freeze)

Document only. Do not fix unless it becomes a demo blocker.

1. TkChatbot FAQ ≠ Guardian `/api/chat` — unify or label in UI.
2. WebSocket alerts unused — Security page polls.
3. Dual auth (Trinity session + Guardian Bearer).
4. Trinity ERP pages use `dummyData.js`.
5. Night/crowd rules need env/clock for daytime demos.
6. Zone JSON must be recalibrated per camera.
7. MJPEG open on LAN.
8. No Guardian API rate limiting.
9. Alert buffer / sessions not durable across restart (incidents are).
10. Custom YOLOv8s zip not always unpacked to `models/custom/`.
11. `trinity-api` README still mentions old folder names.
12. CPU FPS low; GPU path unproven on stage hardware.
