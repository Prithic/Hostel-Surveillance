"""Incident lifecycle: dedupe, open/update, serialize for API/alerts."""

from __future__ import annotations

import itertools
import threading
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta, timezone

from ai.rules import Incident, IncidentType, Severity


@dataclass
class StoredIncident:
    """Persisted incident view for the command center."""

    id: str
    camera_id: str
    incident_type: str
    severity: str
    reason: str
    timestamp: str
    track_ids: list[int]
    zone_ids: list[str]
    metadata: dict
    status: str = "open"
    last_seen: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


class IncidentEngine:
    """Debounce identical events so the dashboard is not spammed every frame.

    Key = (camera_id, incident_type, zone_ids, frozenset(track_ids for zone rules)).
    Crowd/night keys ignore volatile track sets and use type+camera only.
    """

    def __init__(self, cooldown_seconds: float = 8.0, store=None) -> None:
        self._cooldown = timedelta(seconds=cooldown_seconds)
        self._seq = itertools.count(1)
        self._lock = threading.Lock()
        self._active: dict[str, StoredIncident] = {}
        self._by_key: dict[tuple, str] = {}
        self._history: list[StoredIncident] = []
        self._store = store
        if store is not None:
            self._hydrate(store)

    def _hydrate(self, store) -> None:
        loaded = list(reversed(store.load_all(limit=500)))
        self._history = loaded
        max_n = 0
        for inc in loaded:
            self._active[inc.id] = inc
            if inc.id.startswith("INC-"):
                try:
                    max_n = max(max_n, int(inc.id.split("-")[1]))
                except ValueError:
                    pass
            key = (
                inc.camera_id,
                inc.incident_type,
                tuple(inc.zone_ids),
                tuple(sorted(inc.track_ids)),
            )
            if inc.incident_type in (
                IncidentType.CROWD_DETECTION.value,
                IncidentType.UNAUTHORIZED_NIGHT_MOVEMENT.value,
            ):
                key = (inc.camera_id, inc.incident_type)
            self._by_key[key] = inc.id
        self._seq = itertools.count(max_n + 1)

    def _persist(self, inc: StoredIncident) -> None:
        if self._store is not None:
            self._store.upsert(inc)

    def _key(self, camera_id: str, incident: Incident) -> tuple:
        itype = incident.incident_type
        if itype in (IncidentType.CROWD_DETECTION, IncidentType.UNAUTHORIZED_NIGHT_MOVEMENT):
            return (camera_id, itype.value)
        return (camera_id, itype.value, tuple(incident.zone_ids), tuple(sorted(incident.track_ids)))

    def ingest(self, camera_id: str, incidents: list[Incident]) -> list[StoredIncident]:
        """Return newly opened or re-alerted incidents (empty if still in cooldown)."""
        emitted: list[StoredIncident] = []
        now = datetime.now(timezone.utc)
        with self._lock:
            for inc in incidents:
                key = self._key(camera_id, inc)
                existing_id = self._by_key.get(key)
                if existing_id and existing_id in self._active:
                    stored = self._active[existing_id]
                    last = datetime.fromisoformat(stored.last_seen)
                    if now - last < self._cooldown:
                        # refresh presence without extending alert cadence incorrectly:
                        # only update last_seen when we would not emit anyway? keep presence clock
                        stored.reason = inc.reason
                        stored.track_ids = list(inc.track_ids)
                        continue
                    stored.last_seen = now.isoformat()
                    stored.reason = inc.reason
                    stored.track_ids = list(inc.track_ids)
                    # cooldown elapsed → re-emit as update
                    self._persist(stored)
                    emitted.append(stored)
                    continue

                sid = f"INC-{next(self._seq):05d}"
                cam = str(inc.metadata.get("camera_id", camera_id))
                stored = StoredIncident(
                    id=sid,
                    camera_id=cam,
                    incident_type=inc.incident_type.value,
                    severity=inc.severity.value if isinstance(inc.severity, Severity) else str(inc.severity),
                    reason=inc.reason,
                    timestamp=inc.timestamp.isoformat(),
                    track_ids=list(inc.track_ids),
                    zone_ids=list(inc.zone_ids),
                    metadata=dict(inc.metadata),
                    status="open",
                    last_seen=now.isoformat(),
                )
                self._active[sid] = stored
                self._by_key[key] = sid
                self._history.append(stored)
                if len(self._history) > 1000:
                    self._history.pop(0)
                self._persist(stored)
                emitted.append(stored)
        return emitted

    def list_incidents(self, limit: int = 50) -> list[StoredIncident]:
        with self._lock:
            return list(reversed(self._history[-limit:]))

    def list_open(self) -> list[StoredIncident]:
        with self._lock:
            return [i for i in self._active.values() if i.status == "open"]

    def resolve(self, incident_id: str) -> bool:
        """Mark an incident resolved. Returns False if not found."""
        with self._lock:
            inc = self._active.get(incident_id)
            if inc is None:
                # Check history for already-archived incidents
                for h in self._history:
                    if h.id == incident_id:
                        h.status = "resolved"
                        return True
                return False
            inc.status = "resolved"
            self._persist(inc)
            return True
