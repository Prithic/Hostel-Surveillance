"""Alert delivery: fan-out to in-process subscribers (WebSocket / logs)."""

from __future__ import annotations

import threading
from collections import deque
from typing import Callable

from ai.incidents import StoredIncident

AlertHandler = Callable[[StoredIncident], None]


class AlertEngine:
    """Receives opened incidents and notifies subscribers. Keeps a recent buffer."""

    def __init__(self, buffer_size: int = 100) -> None:
        self._handlers: list[AlertHandler] = []
        self._lock = threading.Lock()
        self._recent: deque[StoredIncident] = deque(maxlen=buffer_size)

    def subscribe(self, handler: AlertHandler) -> None:
        with self._lock:
            self._handlers.append(handler)

    def publish(self, incident: StoredIncident) -> None:
        with self._lock:
            self._recent.appendleft(incident)
            handlers = list(self._handlers)
        for h in handlers:
            try:
                h(incident)
            except Exception:  # noqa: BLE001 — never break the pipeline for a bad subscriber
                pass

    def recent(self, limit: int = 50) -> list[StoredIncident]:
        with self._lock:
            return list(self._recent)[:limit]
