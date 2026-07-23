"""SQLite persistence for incidents — survives backend restart."""

from __future__ import annotations

import json
import sqlite3
import threading
from pathlib import Path

from ai.incidents import StoredIncident

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "data" / "guardian.db"


class IncidentStore:
    """Thin SQLite wrapper. One table. No ORM."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = path or DEFAULT_DB
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._init()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self) -> None:
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS incidents (
                        id TEXT PRIMARY KEY,
                        camera_id TEXT NOT NULL,
                        incident_type TEXT NOT NULL,
                        severity TEXT NOT NULL,
                        reason TEXT NOT NULL,
                        timestamp TEXT NOT NULL,
                        track_ids TEXT NOT NULL,
                        zone_ids TEXT NOT NULL,
                        metadata TEXT NOT NULL,
                        status TEXT NOT NULL,
                        last_seen TEXT NOT NULL
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS audit_log (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        at TEXT NOT NULL,
                        action TEXT NOT NULL,
                        detail TEXT NOT NULL
                    )
                    """
                )
                conn.commit()
            finally:
                conn.close()

    def upsert(self, inc: StoredIncident) -> None:
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO incidents (
                        id, camera_id, incident_type, severity, reason, timestamp,
                        track_ids, zone_ids, metadata, status, last_seen
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
                    ON CONFLICT(id) DO UPDATE SET
                        reason=excluded.reason,
                        track_ids=excluded.track_ids,
                        status=excluded.status,
                        last_seen=excluded.last_seen
                    """,
                    (
                        inc.id,
                        inc.camera_id,
                        inc.incident_type,
                        inc.severity,
                        inc.reason,
                        inc.timestamp,
                        json.dumps(inc.track_ids),
                        json.dumps(inc.zone_ids),
                        json.dumps(inc.metadata),
                        inc.status,
                        inc.last_seen,
                    ),
                )
                conn.commit()
            finally:
                conn.close()

    def load_all(self, limit: int = 500) -> list[StoredIncident]:
        with self._lock:
            conn = self._connect()
            try:
                rows = conn.execute(
                    "SELECT * FROM incidents ORDER BY timestamp DESC LIMIT ?",
                    (limit,),
                ).fetchall()
            finally:
                conn.close()
        out: list[StoredIncident] = []
        for r in rows:
            out.append(
                StoredIncident(
                    id=r["id"],
                    camera_id=r["camera_id"],
                    incident_type=r["incident_type"],
                    severity=r["severity"],
                    reason=r["reason"],
                    timestamp=r["timestamp"],
                    track_ids=json.loads(r["track_ids"]),
                    zone_ids=json.loads(r["zone_ids"]),
                    metadata=json.loads(r["metadata"]),
                    status=r["status"],
                    last_seen=r["last_seen"],
                )
            )
        return out

    def audit(self, action: str, detail: str) -> None:
        from datetime import datetime, timezone

        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    "INSERT INTO audit_log (at, action, detail) VALUES (?,?,?)",
                    (datetime.now(timezone.utc).isoformat(), action, detail),
                )
                conn.commit()
            finally:
                conn.close()
