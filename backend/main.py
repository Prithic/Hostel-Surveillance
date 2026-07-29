"""GuardianAI FastAPI — auth, persistence, live annotated stream, warden APIs."""

from __future__ import annotations

import asyncio
import os
import threading
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Iterator

# Load root `.env` before reading GUARDIAN_* (optional dependency).
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
except ImportError:
    pass

import cv2
from fastapi import Depends, FastAPI, HTTPException, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ai.alerts import AlertEngine
from ai.config import AIConfig
from ai.incidents import IncidentEngine, StoredIncident
from ai.pipeline import GuardianPipeline
from backend.auth import Session, auth_service, require_role, require_warden
from backend.hostel import HostelStore
from backend.store import IncidentStore

ROOT = Path(__file__).resolve().parents[1]


def _parse_source(raw: str) -> str | int:
    raw = raw.strip()
    if raw.isdigit():
        return int(raw)
    return raw


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=200)
    password: str = Field(min_length=1, max_length=200)


class HostelAppendRequest(BaseModel):
    key: str = Field(min_length=1, max_length=64)
    item: dict[str, Any]


class HostelPatchRequest(BaseModel):
    key: str = Field(min_length=1, max_length=64)
    id: str = Field(min_length=1, max_length=64)
    updates: dict[str, Any]


class HostelReplaceRequest(BaseModel):
    key: str = Field(min_length=1, max_length=64)
    value: Any


class SosRequest(BaseModel):
    note: str = Field(default="", max_length=500)
    location: str = Field(default="Hostel campus", max_length=200)


class ConfigUpdateRequest(BaseModel):
    confidence_threshold: float | None = Field(default=None, ge=0.05, le=0.99)
    crowd_threshold: int | None = Field(default=None, ge=1, le=100)
    night_start_hour: int | None = Field(default=None, ge=0, le=23)
    night_end_hour: int | None = Field(default=None, ge=0, le=23)


class PasswordChangeRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=200)
    new_password: str = Field(min_length=8, max_length=200)


class SourceSwitchRequest(BaseModel):
    """Webcam index as digit string, or path to an .mp4/.avi/.mkv judge clip."""

    source: str = Field(min_length=1, max_length=500)
    camera_id: str = Field(default="judge-footage", min_length=1, max_length=64)


class Hub:
    def __init__(self) -> None:
        self.store = IncidentStore()
        self.hostel = HostelStore(path=self.store.path)
        self.incidents = IncidentEngine(store=self.store)
        self.alerts = AlertEngine()
        self.pipeline: GuardianPipeline | None = None
        self._clients: list[WebSocket] = []
        self._loop: asyncio.AbstractEventLoop | None = None
        self._jpeg_lock = threading.Lock()
        self._latest_jpeg: bytes | None = None
        self.started_at = time.time()

    def set_jpeg(self, frame) -> None:
        ok, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 72])
        if not ok:
            return
        with self._jpeg_lock:
            self._latest_jpeg = buf.tobytes()

    def get_jpeg(self) -> bytes | None:
        with self._jpeg_lock:
            return self._latest_jpeg

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
    asyncio.run_coroutine_threadsafe(
        hub.broadcast({"type": "alert", "incident": incident.to_dict()}),
        hub._loop,
    )


def _pipeline_loop(pipe: GuardianPipeline) -> None:
    try:
        pipe.open()
        while pipe.status.online:
            result = pipe.read()
            if result is None:
                # Live: wait for next cam frame. File: wait while clip loops/seeks.
                time.sleep(0.02)
                continue
            annotated = pipe.annotate(result.frame, result.tracks)
            hub.set_jpeg(annotated)
    except Exception as exc:  # noqa: BLE001
        pipe.status.last_error = str(exc)
        pipe.status.online = False
        hub.store.audit("pipeline_error", str(exc))
    finally:
        try:
            pipe.close()
        except Exception:  # noqa: BLE001
            pass


def _build_config(source: str | int | None = None) -> AIConfig:
    zones = ROOT / "datasets" / "zones" / "default_zones.json"
    env_model = os.environ.get("GUARDIAN_MODEL", "").strip()
    model = Path(env_model) if env_model else ROOT / "models" / "yolov8n.pt"
    if not model.is_file():
        model = ROOT / "models" / "custom" / "yolov8s_v4_production.pt"
    if not model.is_file():
        model = Path("yolov8n.pt")
    raw_source = source if source is not None else os.environ.get("GUARDIAN_SOURCE", "0")
    if not isinstance(raw_source, (int,)) and not (isinstance(raw_source, str) and raw_source.isdigit()):
        # Resolve relative video paths from repo root for judge USB clips.
        p = Path(str(raw_source))
        if not p.is_file() and not p.is_absolute():
            candidate = ROOT / p
            if candidate.is_file():
                raw_source = str(candidate)
    return AIConfig(
        source=_parse_source(str(raw_source)),
        model_path=model,
        zones_path=zones if zones.is_file() else None,
        camera_id=os.environ.get("GUARDIAN_CAMERA_ID", "webcam-0"),
        device=os.environ.get("GUARDIAN_DEVICE", "cpu"),
        confidence_threshold=float(os.environ.get("GUARDIAN_CONF", "0.5")),
        crowd_threshold=int(os.environ.get("GUARDIAN_CROWD", "5")),
        night_start_hour=int(os.environ.get("GUARDIAN_NIGHT_START", "22")),
        night_end_hour=int(os.environ.get("GUARDIAN_NIGHT_END", "5")),
    )


def _spawn_pipeline(cfg: AIConfig) -> GuardianPipeline:
    pipe = GuardianPipeline(config=cfg, incidents=hub.incidents, alerts=hub.alerts)
    hub.pipeline = pipe
    if os.environ.get("GUARDIAN_ENABLE_CAMERA", "1") != "0":
        threading.Thread(target=_pipeline_loop, args=(pipe,), daemon=True).start()
    return pipe


@asynccontextmanager
async def lifespan(app: FastAPI):
    hub._loop = asyncio.get_running_loop()
    hub.alerts.subscribe(_on_alert)
    cfg = _build_config()
    _spawn_pipeline(cfg)
    hub.store.audit("startup", f"source={cfg.source} model={cfg.model_path}")
    yield
    if hub.pipeline is not None:
        hub.pipeline.status.online = False
        hub.pipeline.close()


app = FastAPI(title="GuardianAI", version="0.3.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5174",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _clamp_limit(limit: int) -> int:
    return max(1, min(int(limit), 200))


@app.post("/api/auth/login")
def api_login(body: LoginRequest, response: Response) -> dict[str, Any]:
    session = auth_service.login(body.email, body.password)
    if session is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    response.set_cookie(
        key="guardian_token",
        value=session.token,
        httponly=True,
        samesite="lax",
        max_age=auth_service.ttl_seconds,
    )
    hub.store.audit("login", session.email)
    return {
        "token": session.token,
        "email": session.email,
        "role": session.role,
        "name": session.name,
        "room": session.room,
        "student_id": session.student_id,
    }


@app.post("/api/auth/logout")
def api_logout(response: Response, session: Session = Depends(require_warden)) -> dict[str, str]:
    auth_service.logout(session.token)
    response.delete_cookie("guardian_token")
    hub.store.audit("logout", session.email)
    return {"status": "ok"}


@app.get("/api/auth/me")
def api_me(session: Session = Depends(require_warden)) -> dict[str, str]:
    return {
        "email": session.email,
        "role": session.role,
        "name": session.name,
        "room": session.room,
        "student_id": session.student_id,
    }


@app.get("/api/auth/users")
def api_users(_session: Session = Depends(require_role("Warden"))) -> list[dict]:
    return auth_service.users.list_users()


@app.post("/api/auth/password")
def api_change_password(body: PasswordChangeRequest, session: Session = Depends(require_warden)) -> dict[str, str]:
    if auth_service.users.authenticate(session.email, body.current_password) is None:
        raise HTTPException(status_code=400, detail="Current password is wrong")
    if not auth_service.users.set_password(session.email, body.new_password):
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    hub.store.audit("password_change", session.email)
    return {"status": "ok"}


@app.get("/health")
def health() -> dict[str, Any]:
    st = hub.pipeline.status if hub.pipeline else None
    model_ok = bool(hub.pipeline and Path(hub.pipeline.config.model_path).is_file()) or bool(
        hub.pipeline and (ROOT / "models" / "yolov8n.pt").is_file()
    )
    return {
        "status": "ok" if st and st.online else "degraded",
        "uptime_s": round(time.time() - hub.started_at, 1),
        "camera_online": bool(st and st.online),
        "fps": st.fps if st else 0.0,
        "person_count": st.person_count if st else 0,
        "camera_id": st.camera_id if st else None,
        "last_error": st.last_error if st else "",
        "db": str(hub.store.path),
        "model_present": model_ok,
        "components": {
            "camera": "up" if st and st.online else "down",
            "ai": "up" if st and st.online and not st.last_error else "down",
            "database": "up",
            "websocket_clients": len(hub._clients),
        },
    }


@app.get("/api/status")
def api_status(_session: Session = Depends(require_warden)) -> dict[str, Any]:
    return health()


@app.get("/api/health")
def api_health(_session: Session = Depends(require_warden)) -> dict[str, Any]:
    return health()


@app.get("/api/incidents")
def api_incidents(limit: int = 50, _session: Session = Depends(require_role("Warden"))) -> list[dict[str, Any]]:
    return [i.to_dict() for i in hub.incidents.list_incidents(limit=_clamp_limit(limit))]


@app.patch("/api/incidents/{incident_id}")
def api_resolve_incident(
    incident_id: str,
    session: Session = Depends(require_role("Warden")),
) -> dict[str, Any]:
    ok = hub.incidents.resolve(incident_id)
    if not ok:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    hub.store.audit("resolve", f"{incident_id} by {session.email}")
    return {"id": incident_id, "status": "resolved"}


@app.get("/api/alerts")
def api_alerts(limit: int = 50, _session: Session = Depends(require_role("Warden"))) -> list[dict[str, Any]]:
    return [i.to_dict() for i in hub.alerts.recent(limit=_clamp_limit(limit))]


@app.get("/api/analytics")
def api_analytics(_session: Session = Depends(require_role("Warden"))) -> dict[str, Any]:
    all_incidents = hub.incidents.list_incidents(limit=500)
    open_ones = hub.incidents.list_open()
    st = hub.pipeline.status if hub.pipeline else None
    severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    type_counts: dict[str, int] = {}
    resolved = 0
    for inc in all_incidents:
        severity_counts[inc.severity.lower()] = severity_counts.get(inc.severity.lower(), 0) + 1
        type_counts[inc.incident_type] = type_counts.get(inc.incident_type, 0) + 1
        if inc.status == "resolved":
            resolved += 1
    return {
        "total_incidents": len(all_incidents),
        "open_incidents": len([i for i in open_ones if i.status == "open"]),
        "resolved_incidents": resolved,
        "active_alerts_count": len(hub.alerts.recent(limit=50)),
        "camera_online": bool(st and st.online),
        "fps": round(st.fps, 1) if st else 0.0,
        "person_count": st.person_count if st else 0,
        "camera_id": st.camera_id if st else "none",
        "incidents_by_severity": severity_counts,
        "incidents_by_type": type_counts,
    }


def _mjpeg() -> Iterator[bytes]:
    boundary = b"--frame\r\nContent-Type: image/jpeg\r\n\r\n"
    while True:
        jpeg = hub.get_jpeg()
        if jpeg:
            yield boundary + jpeg + b"\r\n"
        time.sleep(0.05)


@app.get("/api/stream")
def api_stream() -> StreamingResponse:
    """MJPEG for <img>. LAN demo: left open so browser img tags work without headers."""
    return StreamingResponse(_mjpeg(), media_type="multipart/x-mixed-replace; boundary=frame")


def _chat_reply(message: str) -> str:
    q = message.lower().strip()
    incidents = hub.incidents.list_incidents(limit=50)
    alerts = hub.alerts.recent(limit=10)
    open_ones = [i for i in hub.incidents.list_open() if i.status == "open"]
    st = hub.pipeline.status if hub.pipeline else None
    cfg = hub.pipeline.config if hub.pipeline else None

    if any(x in q for x in ["what happened", "latest incident", "last incident", "show latest", "recent"]):
        if not incidents:
            return "No incidents recorded yet. The camera pipeline is watching."
        latest = incidents[0]
        return (
            f"Latest: [{latest.severity.upper()}] {latest.reason} "
            f"(ID={latest.id}, status={latest.status}, camera={latest.camera_id}, at {latest.timestamp[:19]})"
        )
    if "current alert" in q or q == "alerts" or "show alert" in q or "any alert" in q:
        if not alerts and not open_ones:
            return "No active alerts right now."
        items = alerts or open_ones
        lines = [f"• [{a.severity.upper()}] {a.reason}" for a in items[:5]]
        return f"{len(items)} active alert(s):\n" + "\n".join(lines)
    if any(x in q for x in ["status", "camera", "fps", "online", "offline", "health", "people"]):
        if not st:
            return "Pipeline not started."
        return (
            f"Camera {st.camera_id} is {'online' if st.online else 'offline'}. "
            f"FPS={st.fps:.1f}, people={st.person_count}. "
            f"Incidents stored: {len(hub.incidents.list_incidents(limit=500))}."
        )
    if any(x in q for x in ["restricted", "zone", "unauthorized", "trespass", "entry", "intrus"]):
        zone_incs = [i for i in incidents if i.incident_type == "restricted_zone_entry"]
        if not zone_incs:
            return "No restricted zone entry incidents recorded."
        return f"{len(zone_incs)} restricted-zone incident(s). Latest: {zone_incs[0].reason}."
    if "tailgat" in q:
        tail = [i for i in incidents if i.incident_type == "tailgating"]
        return (
            "No tailgating incidents recorded."
            if not tail
            else f"{len(tail)} tailgating incident(s). Latest: {tail[0].reason}."
        )
    if "crowd" in q:
        crowd = [i for i in incidents if i.incident_type == "crowd_detection"]
        thr = cfg.crowd_threshold if cfg else "?"
        return (
            f"No crowd incidents. Threshold={thr}."
            if not crowd
            else f"{len(crowd)} crowd incident(s). Latest: {crowd[0].reason}."
        )
    if "night" in q or "curfew" in q:
        night = [i for i in incidents if i.incident_type == "unauthorized_night_movement"]
        hours = f"{cfg.night_start_hour}:00–{cfg.night_end_hour}:00" if cfg else "?"
        return (
            f"Night window {hours}. No night-movement incidents."
            if not night
            else f"Night window {hours}. {len(night)} night incident(s). Latest: {night[0].reason}."
        )
    if any(x in q for x in ["summary", "count", "total", "how many incident", "analytics"]):
        all_inc = hub.incidents.list_incidents(limit=500)
        by_type: dict[str, int] = {}
        for inc in all_inc:
            by_type[inc.incident_type] = by_type.get(inc.incident_type, 0) + 1
        if not by_type:
            return "No incidents logged yet."
        lines = [f"• {k.replace('_', ' ')}: {v}" for k, v in by_type.items()]
        return f"Incident summary ({len(all_inc)} total):\n" + "\n".join(lines)
    return (
        "Ask about: latest incident, alerts, restricted zones, tailgating, crowd, "
        "night movement, camera status, or summary. I only answer from live system data."
    )


@app.post("/api/chat")
def api_chat(body: ChatRequest, _session: Session = Depends(require_warden)) -> dict[str, str]:
    return {"reply": _chat_reply(body.message)}


@app.get("/api/config")
def api_config(_session: Session = Depends(require_role("Warden"))) -> dict[str, Any]:
    cfg = hub.pipeline.config if hub.pipeline else None
    if cfg is None:
        return {}
    return {
        "camera_id": cfg.camera_id,
        "confidence_threshold": cfg.confidence_threshold,
        "crowd_threshold": cfg.crowd_threshold,
        "night_start_hour": cfg.night_start_hour,
        "night_end_hour": cfg.night_end_hour,
        "device": cfg.device,
        "model_path": str(cfg.model_path),
        "source": str(cfg.source),
    }


@app.put("/api/config")
def api_config_update(body: ConfigUpdateRequest, session: Session = Depends(require_role("Warden"))) -> dict[str, Any]:
    if hub.pipeline is None:
        raise HTTPException(status_code=503, detail="Pipeline not started")
    cfg = hub.pipeline.update_runtime(
        confidence_threshold=body.confidence_threshold,
        crowd_threshold=body.crowd_threshold,
        night_start_hour=body.night_start_hour,
        night_end_hour=body.night_end_hour,
    )
    hub.store.audit("config_update", f"by {session.email}")
    return {
        "camera_id": cfg.camera_id,
        "confidence_threshold": cfg.confidence_threshold,
        "crowd_threshold": cfg.crowd_threshold,
        "night_start_hour": cfg.night_start_hour,
        "night_end_hour": cfg.night_end_hour,
        "device": cfg.device,
        "model_path": str(cfg.model_path),
        "source": str(cfg.source),
    }


@app.get("/api/videos")
def api_list_videos(_session: Session = Depends(require_role("Warden"))) -> list[dict[str, Any]]:
    """List local hostel / judge clips for the Security source picker."""
    folders = [ROOT / "videos", ROOT / "Hostel footage"]
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for folder in folders:
        if not folder.is_dir():
            continue
        for p in sorted(folder.glob("*.mp4")):
            key = str(p.resolve())
            if key in seen:
                continue
            seen.add(key)
            try:
                rel = str(p.relative_to(ROOT)).replace("\\", "/")
            except ValueError:
                rel = str(p)
            out.append(
                {
                    "name": p.name,
                    "path": rel,
                    "mb": round(p.stat().st_size / (1024 * 1024), 1),
                    "folder": folder.name,
                }
            )
    return out


@app.put("/api/source")
def api_switch_source(body: SourceSwitchRequest, session: Session = Depends(require_role("Warden"))) -> dict[str, Any]:
    """Hot-swap webcam ↔ judge video file without restarting the whole API."""
    src = body.source.strip().strip('"')
    # Allow relative paths under repo / videos / Hostel footage
    if src not in ("0", "1", "2") and not Path(src).is_file():
        candidates = [
            ROOT / src,
            ROOT / "videos" / Path(src).name,
            ROOT / "Hostel footage" / Path(src).name,
        ]
        found = next((str(c) for c in candidates if c.is_file()), None)
        if found is None:
            raise HTTPException(status_code=400, detail=f"Video/camera source not found: {body.source}")
        src = found

    old = hub.pipeline
    if old is not None:
        old.status.online = False
        try:
            old.close()
        except Exception:  # noqa: BLE001
            pass
        time.sleep(0.25)

    os.environ["GUARDIAN_CAMERA_ID"] = body.camera_id
    cfg = _build_config(src)
    from dataclasses import replace

    cfg = replace(cfg, camera_id=body.camera_id, source=_parse_source(src))
    pipe = _spawn_pipeline(cfg)
    hub.store.audit("source_switch", f"{src} by {session.email}")
    return {
        "status": "ok",
        "source": str(pipe.config.source),
        "camera_id": pipe.config.camera_id,
        "online": pipe.status.online,
    }


def _role_ok(session: Session, *roles: str) -> bool:
    return session.role in roles


def _deny_unless(session: Session, *roles: str) -> None:
    if not _role_ok(session, *roles):
        raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(roles)}")


@app.get("/api/hostel/state")
def hostel_state(_session: Session = Depends(require_warden)) -> dict[str, Any]:
    return hub.hostel.get()


@app.post("/api/hostel/append")
def hostel_append(body: HostelAppendRequest, session: Session = Depends(require_warden)) -> dict[str, Any]:
    # Who may create which records
    append_roles = {
        "complaints": ("Warden", "Student"),
        "leaveRequests": ("Warden", "Student"),
        "visitors": ("Warden",),
        "lostAndFoundItems": ("Warden", "Student", "Laundry Staff"),
        "notices": ("Warden",),
        "events": ("Warden",),
        "inspections": ("Warden",),
        "laundryTracking": ("Warden", "Student", "Laundry Staff"),
        "laundryClaims": ("Warden", "Student", "Laundry Staff"),
        "messFeedback": ("Warden", "Student"),
        "sosEvents": ("Warden", "Student", "Laundry Staff"),
        "paymentHistory": ("Warden",),
        "notifications": ("Warden",),
    }
    roles = append_roles.get(body.key)
    if roles is None:
        raise HTTPException(status_code=400, detail=f"Cannot append to {body.key}")
    _deny_unless(session, *roles)
    item = hub.hostel.append(body.key, body.item)
    if body.key == "complaints":
        hub.hostel.push_notification("New complaint", f"{item.get('category')}: {item.get('id')}", "warning")
    elif body.key == "leaveRequests":
        hub.hostel.push_notification("Outpass request", f"{item.get('studentName')} · {item.get('id')}", "info")
    elif body.key == "laundryClaims":
        hub.hostel.push_notification("Laundry claim", f"{item.get('item')} · {item.get('id')}", "warning")
    elif body.key == "notices":
        hub.hostel.push_notification("Notice posted", str(item.get("title") or item.get("id")), "info")
    hub.store.audit("hostel_append", f"{body.key} by {session.email}")
    return item


@app.patch("/api/hostel/item")
def hostel_patch(body: HostelPatchRequest, session: Session = Depends(require_warden)) -> dict[str, Any]:
    patch_roles = {
        "complaints": ("Warden",),
        "leaveRequests": ("Warden",),
        "visitors": ("Warden",),
        "lostAndFoundItems": ("Warden", "Laundry Staff"),
        "laundryTracking": ("Warden", "Laundry Staff"),
        "laundryClaims": ("Warden", "Laundry Staff"),
        "sosEvents": ("Warden",),
        "attendanceRoster": ("Warden",),
        "inventory": ("Warden",),
        "notifications": ("Warden", "Student", "Laundry Staff"),
        "inspections": ("Warden",),
    }
    roles = patch_roles.get(body.key)
    if roles is None:
        raise HTTPException(status_code=400, detail=f"Cannot patch {body.key}")
    _deny_unless(session, *roles)
    updated = hub.hostel.patch_list_item(body.key, body.id, body.updates)
    if updated is None:
        raise HTTPException(status_code=404, detail="Item not found")
    if body.key == "leaveRequests" and body.updates.get("status"):
        hub.hostel.push_notification(
            "Outpass updated",
            f"{updated.get('id')}: {body.updates.get('status')}",
            "info",
        )
    if body.key == "complaints" and body.updates.get("status"):
        hub.hostel.push_notification(
            "Complaint updated",
            f"{updated.get('id')}: {body.updates.get('status')}",
            "info",
        )
    hub.store.audit("hostel_patch", f"{body.key}/{body.id} by {session.email}")
    return updated


@app.put("/api/hostel/key")
def hostel_replace(body: HostelReplaceRequest, session: Session = Depends(require_warden)) -> dict[str, Any]:
    replace_roles = {
        "notificationPrefs": ("Warden", "Student", "Laundry Staff"),
        "todayMenu": ("Warden",),
        "mealTimings": ("Warden",),
        "mealPlan": ("Warden", "Student"),
        "feeStatus": ("Warden",),
        "statSummary": ("Warden",),
        "currentUser": ("Warden", "Student", "Laundry Staff"),
        "nextInspection": ("Warden",),
        "attendanceRoster": ("Warden",),
        "analytics": ("Warden", "Student"),
    }
    roles = replace_roles.get(body.key)
    if roles is None:
        raise HTTPException(status_code=400, detail=f"Cannot replace {body.key}")
    _deny_unless(session, *roles)
    value = hub.hostel.replace_key(body.key, body.value)
    hub.store.audit("hostel_replace", f"{body.key} by {session.email}")
    return {"key": body.key, "value": value}


@app.post("/api/hostel/sos")
async def hostel_sos(body: SosRequest, session: Session = Depends(require_warden)) -> dict[str, Any]:
    """Persist SOS + raise a critical alert into the live incident/alert stream."""
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc).isoformat()
    event = {
        "id": f"SOS-{int(time.time())}",
        "note": body.note or "Warden/student SOS triggered",
        "location": body.location,
        "by": session.email,
        "at": now,
        "status": "open",
    }
    hub.hostel.append("sosEvents", event)
    hub.hostel.push_notification("SOS ALERT", f"{event['location']}: {event['note']}", "critical")
    incident = hub.incidents.record_manual(
        incident_type="emergency_sos",
        severity="critical",
        reason=f"SOS: {event['note']} @ {event['location']}",
        camera_id="manual-sos",
        metadata={"source": "sos", "by": session.email, "sos_id": event["id"]},
    )
    hub.alerts.publish(incident)
    hub.store.audit("sos", f"{event['id']} by {session.email}")
    await hub.broadcast({"type": "alert", "incident": incident.to_dict()})
    return {"event": event, "incident": incident.to_dict()}


@app.websocket("/ws/alerts")
async def ws_alerts(ws: WebSocket) -> None:
    await ws.accept()
    token = ws.query_params.get("token") or ws.cookies.get("guardian_token")
    try:
        auth_service.validate(token)
    except HTTPException:
        await ws.close(code=4401)
        return
    hub._clients.append(ws)
    try:
        await ws.send_json({"type": "hello", "message": "GuardianAI alert stream"})
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        if ws in hub._clients:
            hub._clients.remove(ws)
