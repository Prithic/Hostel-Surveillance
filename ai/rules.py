"""Rule-based incident contracts.

YOLO finds objects. Rules decide whether they are *suspicious*.

MVP scenarios (to be implemented later against these interfaces):

* Restricted zone entry — person inside a restricted polygon
* Unauthorized night movement — person present during configured night hours
* Crowd detection — person count exceeds threshold
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Sequence

from ai.config import AIConfig
from ai.tracker import Track
from ai.zone import ZoneManager


class Severity(str, Enum):
    """Alert priority for the command center."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentType(str, Enum):
    """Canonical MVP (and future) incident kinds."""

    RESTRICTED_ZONE_ENTRY = "restricted_zone_entry"
    UNAUTHORIZED_NIGHT_MOVEMENT = "unauthorized_night_movement"
    CROWD_DETECTION = "crowd_detection"
    TAILGATING = "tailgating"
    # Future: CAMERA_TAMPERING, FIRE, SMOKE


@dataclass(frozen=True)
class Incident:
    """One explainable security event produced by the rule engine.

    Attributes:
        incident_type: Which scenario fired.
        severity: Priority for warden triage.
        reason: Short human-readable explanation (shown in the alert panel).
        timestamp: UTC time the rule evaluated true.
        track_ids: Tracks involved (empty for count-only rules).
        zone_ids: Zones involved (empty if not zone-related).
        metadata: Optional extra context (counts, hours, …) — never identities.
    """

    incident_type: IncidentType
    severity: Severity
    reason: str
    timestamp: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    track_ids: tuple[int, ...] = ()
    zone_ids: tuple[str, ...] = ()
    metadata: dict[str, str | int | float | bool] = field(default_factory=dict)


@dataclass(frozen=True)
class RuleContext:
    """Everything a rule may inspect for one frame evaluation.

    Attributes:
        tracks: Active tracks after the tracker update.
        zones: Zone manager for spatial queries.
        config: Pipeline thresholds and schedules.
        frame_index: Monotonic frame counter from the video source.
        timestamp: Wall-clock (or video) time for this frame.
        camera_id: Source camera id for multi-cam incidents.
    """

    tracks: Sequence[Track]
    zones: ZoneManager
    config: AIConfig
    frame_index: int
    timestamp: datetime
    camera_id: str = "webcam-0"


class Rule(ABC):
    """One detection scenario.

    Rules are independent; the engine runs all of them and merges incidents.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Stable rule name for logs and config toggles."""

    @abstractmethod
    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        """Return zero or more incidents for this frame."""


class RuleEngine(ABC):
    """Orchestrates registered rules over each frame's tracks."""

    @abstractmethod
    def register(self, rule: Rule) -> None:
        """Add a rule. Duplicate names should raise or replace — implementer's choice."""

    @abstractmethod
    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        """Run all rules and return the combined incident list."""
