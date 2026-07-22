"""Concrete security rules + simple rule engine."""

from __future__ import annotations

from collections import defaultdict, deque
from datetime import datetime, timedelta
from typing import Sequence

from ai.rules import (
    Incident,
    IncidentType,
    Rule,
    RuleContext,
    RuleEngine,
    Severity,
)
from ai.zone import Point


def _is_night(ts: datetime, start_hour: int, end_hour: int) -> bool:
    h = ts.hour
    if start_hour == end_hour:
        return False
    if start_hour < end_hour:
        return start_hour <= h < end_hour
    return h >= start_hour or h < end_hour


def _track_point(track) -> Point:
    cx, cy = track.detection.bbox.center()
    return Point(cx, cy)


class RestrictedZoneRule(Rule):
    """Person center *enters* a restricted polygon (edge-triggered)."""

    def __init__(self) -> None:
        self._inside: dict[str, set[int]] = defaultdict(set)

    @property
    def name(self) -> str:
        return "restricted_zone"

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        out: list[Incident] = []
        present: dict[str, set[int]] = defaultdict(set)
        for track in context.tracks:
            pt = _track_point(track)
            for zone in context.zones.zones_containing(pt):
                if zone.restricted:
                    present[zone.zone_id].add(track.track_id)

        for zone in context.zones.zones():
            if not zone.restricted:
                continue
            zid = zone.zone_id
            prev = self._inside[zid]
            curr = present.get(zid, set())
            for tid in curr - prev:
                out.append(
                    Incident(
                        incident_type=IncidentType.RESTRICTED_ZONE_ENTRY,
                        severity=Severity.HIGH,
                        reason=f"Person track {tid} entered restricted zone '{zone.name}'",
                        timestamp=context.timestamp,
                        track_ids=(tid,),
                        zone_ids=(zid,),
                        metadata={"camera_id": context.camera_id},
                    )
                )
            self._inside[zid] = set(curr)
        return out


class CrowdRule(Rule):
    """Active person count exceeds configured threshold."""

    @property
    def name(self) -> str:
        return "crowd"

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        n = len(context.tracks)
        if n < context.config.crowd_threshold:
            return []
        return [
            Incident(
                incident_type=IncidentType.CROWD_DETECTION,
                severity=Severity.MEDIUM if n < context.config.crowd_threshold + 3 else Severity.HIGH,
                reason=f"Crowd detected: {n} people (threshold {context.config.crowd_threshold})",
                timestamp=context.timestamp,
                track_ids=tuple(t.track_id for t in context.tracks),
                metadata={"count": n, "camera_id": context.camera_id},
            )
        ]


class NightMovementRule(Rule):
    """Any person present during configured night hours."""

    @property
    def name(self) -> str:
        return "night_movement"

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        if not context.tracks:
            return []
        if not _is_night(
            context.timestamp,
            context.config.night_start_hour,
            context.config.night_end_hour,
        ):
            return []
        return [
            Incident(
                incident_type=IncidentType.UNAUTHORIZED_NIGHT_MOVEMENT,
                severity=Severity.HIGH,
                reason=(
                    f"Unauthorized night movement: {len(context.tracks)} person(s) "
                    f"between {context.config.night_start_hour}:00–{context.config.night_end_hour}:00"
                ),
                timestamp=context.timestamp,
                track_ids=tuple(t.track_id for t in context.tracks),
                metadata={"camera_id": context.camera_id},
            )
        ]


class TailgatingRule(Rule):
    """Two+ distinct tracks enter the same restricted zone within a short window.

    ponytail: O(tracks×zones) per frame; fine for hostel single-cam MVP.
    Upgrade: zone entry-edge detector with explicit gate topology.
    """

    def __init__(self, window_seconds: float = 3.0) -> None:
        self._window = timedelta(seconds=window_seconds)
        self._inside: dict[str, set[int]] = defaultdict(set)
        self._entries: dict[str, deque[tuple[datetime, int]]] = defaultdict(deque)

    @property
    def name(self) -> str:
        return "tailgating"

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        out: list[Incident] = []
        now = context.timestamp
        present: dict[str, set[int]] = defaultdict(set)
        for track in context.tracks:
            pt = _track_point(track)
            for zone in context.zones.zones_containing(pt):
                if zone.restricted:
                    present[zone.zone_id].add(track.track_id)

        for zone in context.zones.zones():
            if not zone.restricted:
                continue
            zid = zone.zone_id
            prev = self._inside[zid]
            curr = present.get(zid, set())
            newly = curr - prev
            q = self._entries[zid]
            for tid in newly:
                q.append((now, tid))
            while q and now - q[0][0] > self._window:
                q.popleft()
            ids = {tid for _, tid in q}
            if len(ids) >= 2 and newly:
                out.append(
                    Incident(
                        incident_type=IncidentType.TAILGATING,
                        severity=Severity.CRITICAL,
                        reason=(
                            f"Possible tailgating at '{zone.name}': "
                            f"{len(ids)} people entered within {self._window.total_seconds():.0f}s"
                        ),
                        timestamp=now,
                        track_ids=tuple(sorted(ids)),
                        zone_ids=(zid,),
                        metadata={"camera_id": context.camera_id},
                    )
                )
            self._inside[zid] = set(curr)
        return out


class SimpleRuleEngine(RuleEngine):
    """Runs registered rules in order; concatenates incidents."""

    def __init__(self, rules: Sequence[Rule] | None = None) -> None:
        self._rules: list[Rule] = list(rules or [])

    def register(self, rule: Rule) -> None:
        self._rules = [r for r in self._rules if r.name != rule.name]
        self._rules.append(rule)

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        out: list[Incident] = []
        for rule in self._rules:
            out.extend(rule.evaluate(context))
        return out


def default_rules() -> list[Rule]:
    return [
        RestrictedZoneRule(),
        CrowdRule(),
        NightMovementRule(),
        TailgatingRule(),
    ]
