"""GuardianAI FastAPI backend — health, incidents, alerts, chat, WebSocket."""

from __future__ import annotations

import asyncio
import threading
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai.alerts import AlertEngine
from ai.config import AIConfig
from ai.incidents import IncidentEngine, StoredIncident
from ai.pipeline import GuardianPipeline

ROOT = Path(__file__).resolve().parents[1]


class ChatRequest(BaseModel):
    message: str


class Hub:
    def __init__(self) -> None:
        self.incidents = IncidentEngine()
        self.alerts = AlertEngine()
        self.pipeline: GuardianPipeline | None = None
        self._clients: list[WebSocket] = []
        self._lock = asyncio.Lock()
        self._loop: asyncio.AbstractEventLoop | None = None

    async def broadcast(self, payload: dict[str, Any]) -> None:
        dead: list[WebSocket] = []
        for ws in list(self._clients):
            try:
                await ws.send_json(payload)
            except Exception:  # noqa: BLE001
                dead.append(ws)
        for ws in dead:
            if ws in self._clients:
                self._clients.remove(ws)


hub = Hub()


def _on_alert(incident: StoredIncident) -> None:
    if hub._loop is None:
        return
    payload = {"type": "alert", "incident": incident.to_dict()}
    asyncio.run_coroutine_threadsafe(hub.broadcast(payload), hub._loop)


def _pipeline_loop(pipe: GuardianPipeline) -> None:
    try:
        pipe.open()
        while pipe.status.online:
            result = pipe.read()
            if result is None:
                break
    except Exception as exc:  # noqa: BLE001
        pipe.status.last_error = str(exc)
        pipe.status.online = False
    finally:
        try:
            pipe.close()
        except Exception:  # noqa: BLE001
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    import os

    hub._loop = asyncio.get_running_loop()
    hub.alerts.subscribe(_on_alert)
    zones = ROOT / "datasets" / "zones" / "default_zones.json"
    cfg = AIConfig(
        source=int(os.environ.get("GUARDIAN_SOURCE", "0")),
        model_path=ROOT / "models" / "yolov8n.pt",
        zones_path=zones if zones.is_file() else None,
        camera_id=os.environ.get("GUARDIAN_CAMERA_ID", "webcam-0"),
        device=os.environ.get("GUARDIAN_DEVICE", "cpu"),
    )
    pipe = GuardianPipeline(config=cfg, incidents=hub.incidents, alerts=hub.alerts)
    hub.pipeline = pipe
    if os.environ.get("GUARDIAN_ENABLE_CAMERA", "1") != "0":
        thread = threading.Thread(target=_pipeline_loop, args=(pipe,), daemon=True)
        thread.start()
    yield
    if hub.pipeline is not None:
        hub.pipeline.status.online = False
        hub.pipeline.close()


app = FastAPI(title="GuardianAI", version="0.2.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    st = hub.pipeline.status if hub.pipeline else None
    return {
        "status": "ok",
        "camera_online": bool(st and st.online),
        "fps": st.fps if st else 0.0,
        "person_count": st.person_count if st else 0,
        "camera_id": st.camera_id if st else None,
        "last_error": st.last_error if st else "",
    }


@app.get("/api/status")
def api_status() -> dict[str, Any]:
    return health()


@app.get("/api/incidents")
def api_incidents(limit: int = 50) -> list[dict[str, Any]]:
    return [i.to_dict() for i in hub.incidents.list_incidents(limit=limit)]


@app.get("/api/alerts")
def api_alerts(limit: int = 50) -> list[dict[str, Any]]:
    return [i.to_dict() for i in hub.alerts.recent(limit=limit)]


def _chat_reply(message: str) -> str:
    q = message.lower().strip()
    incidents = hub.incidents.list_incidents(limit=20)
    alerts = hub.alerts.recent(limit=10)
    open_ones = hub.incidents.list_open()
    st = hub.pipeline.status if hub.pipeline else None

    if "what happened" in q or "latest incident" in q or "last incident" in q:
        if not incidents:
            return "No incidents recorded yet. The camera pipeline is watching."
        latest = incidents[0]
        return (
            f"Latest incident {latest.id}: {latest.reason} "
            f"(severity={latest.severity}, camera={latest.camera_id}, "
            f"tracks={latest.track_ids}, at {latest.timestamp})"
        )
    if "current alert" in q or "alerts" in q:
        if not alerts and not open_ones:
            return "No current alerts."
        lines = [f"- {a.id}: {a.reason} [{a.severity}]" for a in (alerts or open_ones)[:5]]
        return "Current alerts:\n" + "\n".join(lines)
    if "status" in q or "camera" in q or "fps" in q:
        if not st:
            return "Pipeline not started."
        return (
            f"Camera {st.camera_id}: {'online' if st.online else 'offline'}, "
            f"FPS={st.fps:.1f}, people={st.person_count}"
        )
    if "crowd" in q:
        crowd = [i for i in incidents if i.incident_type == "crowd_detection"]
        return f"Crowd incidents: {len(crowd)}. Latest: {crowd[0].reason if crowd else 'none'}."
    if "night" in q:
        night = [i for i in incidents if i.incident_type == "unauthorized_night_movement"]
        return f"Night-movement incidents: {len(night)}."
    return (
        "I can answer: 'What happened?', 'Show latest incident', "
        "'Current alerts', or camera status. Ask one of those."
    )


@app.post("/api/chat")
def api_chat(body: ChatRequest) -> dict[str, str]:
    return {"reply": _chat_reply(body.message)}


@app.websocket("/ws/alerts")
async def ws_alerts(ws: WebSocket) -> None:
    await ws.accept()
    hub._clients.append(ws)
    try:
        await ws.send_json({"type": "hello", "message": "GuardianAI alert stream"})
        while True:
            # keep alive; clients may send pings
            await ws.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if ws in hub._clients:
            hub._clients.remove(ws)
