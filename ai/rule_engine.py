"""Concrete security rules + simple rule engine."""

from __future__ import annotations

import os
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
                        metadata={
                            "camera_id": context.camera_id,
                            "rule": "restricted_zone",
                            "suggested_action": "Review live feed; send guard if zone is a no-go flank",
                        },
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
                metadata={
                    "count": n,
                    "camera_id": context.camera_id,
                    "rule": "crowd",
                    "suggested_action": "Assess gathering at gate; prepare crowd control if bottleneck forms",
                },
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
                metadata={
                    "camera_id": context.camera_id,
                    "person_count": len(context.tracks),
                    "rule": "night_movement",
                    "suggested_action": "Confirm curfew/outpass; challenge via intercom or guard if unexplained",
                },
            )
        ]


class TailgatingRule(Rule):
    """Two+ tracks enter the same restricted zone within a short window.

    Outdoor-gate honesty: this is **group entry**, not badge piggybacking.
    Severity stays medium so rush-hour friends do not bury the warden in CRITICAL.
    """

    def __init__(self, window_seconds: float = 3.0) -> None:
        self._window = timedelta(seconds=window_seconds)
        self._inside: dict[str, set[int]] = defaultdict(set)
        self._entries: dict[str, deque[tuple[datetime, int]]] = defaultdict(deque)

    @property
    def name(self) -> str:
        return "group_entry"

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
                        incident_type=IncidentType.GROUP_ENTRY,
                        severity=Severity.MEDIUM,
                        reason=(
                            f"Group entry at '{zone.name}': "
                            f"{len(ids)} people entered within {self._window.total_seconds():.0f}s "
                            f"(not identity-verified tailgating)"
                        ),
                        timestamp=now,
                        track_ids=tuple(sorted(ids)),
                        zone_ids=(zid,),
                        metadata={
                            "camera_id": context.camera_id,
                            "rule": "group_entry",
                            "suggested_action": "Review stream; verify with guard if barrier policy requires single-file entry",
                        },
                    )
                )
            self._inside[zid] = set(curr)
        return out


class LoiteringRule(Rule):
    """Person remains inside a loiter_* zone longer than threshold (gate apron)."""

    def __init__(self, dwell_seconds: float = 60.0) -> None:
        self._dwell = timedelta(seconds=dwell_seconds)
        self._since: dict[tuple[str, int], datetime] = {}
        self._alerted: set[tuple[str, int]] = set()

    @property
    def name(self) -> str:
        return "loitering"

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        out: list[Incident] = []
        now = context.timestamp
        present: set[tuple[str, int]] = set()
        for track in context.tracks:
            pt = _track_point(track)
            for zone in context.zones.zones_containing(pt):
                if not (zone.loiter or str(zone.zone_id).startswith("loiter")):
                    continue
                key = (zone.zone_id, track.track_id)
                present.add(key)
                if key not in self._since:
                    self._since[key] = now
                elapsed = now - self._since[key]
                if elapsed >= self._dwell and key not in self._alerted:
                    self._alerted.add(key)
                    out.append(
                        Incident(
                            incident_type=IncidentType.LOITERING,
                            severity=Severity.MEDIUM,
                            reason=(
                                f"Loitering: track {track.track_id} in '{zone.name}' "
                                f"for {int(elapsed.total_seconds())}s"
                            ),
                            timestamp=now,
                            track_ids=(track.track_id,),
                            zone_ids=(zone.zone_id,),
                            metadata={
                                "camera_id": context.camera_id,
                                "rule": "loitering",
                                "dwell_s": int(elapsed.total_seconds()),
                                "suggested_action": "Check if person is waiting for transport/guard; dispatch if needed",
                            },
                        )
                    )
        for key in list(self._since):
            if key not in present:
                self._since.pop(key, None)
                self._alerted.discard(key)
        return out


class CameraHealthRule(Rule):
    """Black / near-empty frames suggest cover, IR failure, or signal loss."""

    def __init__(self, black_mean_max: float = 8.0, streak: int = 45) -> None:
        self._black_mean_max = black_mean_max
        self._streak_need = streak
        self._black_streak = 0
        self._fired = False

    @property
    def name(self) -> str:
        return "camera_health"

    def note_frame(self, mean_luma: float) -> None:
        if mean_luma < self._black_mean_max:
            self._black_streak += 1
        else:
            self._black_streak = 0
            self._fired = False

    def evaluate(self, context: RuleContext) -> Sequence[Incident]:
        if self._black_streak < self._streak_need or self._fired:
            return []
        self._fired = True
        return [
            Incident(
                incident_type=IncidentType.CAMERA_HEALTH,
                severity=Severity.CRITICAL,
                reason=(
                    f"Camera health: near-black frames for {self._black_streak} consecutive checks "
                    f"(possible cover / disconnect)"
                ),
                timestamp=context.timestamp,
                metadata={
                    "camera_id": context.camera_id,
                    "rule": "camera_health",
                    "suggested_action": "Verify camera power/lens; send guard to inspect FOV",
                },
            )
        ]


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

    def get(self, name: str) -> Rule | None:
        for rule in self._rules:
            if rule.name == name:
                return rule
        return None


def default_rules() -> list[Rule]:
    return [
        RestrictedZoneRule(),
        CrowdRule(),
        NightMovementRule(),
        TailgatingRule(),
        LoiteringRule(dwell_seconds=float(os.environ.get("GUARDIAN_LOITER_S", "45"))),
        CameraHealthRule(),
    ]
