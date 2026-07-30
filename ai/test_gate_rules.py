"""Self-check: gate behaviour rules (group entry, loiter, night, camera health)."""

from __future__ import annotations

import sys
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ai.config import AIConfig
from ai.detector import BoundingBox, Detection
from ai.polygon_zones import PolygonZoneManager
from ai.rule_engine import CameraHealthRule, LoiteringRule, NightMovementRule, TailgatingRule
from ai.rules import IncidentType, RuleContext
from ai.tracker import Track
from ai.zone import Point, Zone


def _track(tid: int, cx: float, cy: float) -> Track:
    return Track(
        track_id=tid,
        detection=Detection(
            bbox=BoundingBox(cx - 5, cy - 5, cx + 5, cy + 5),
            class_id=0,
            class_name="person",
            confidence=0.9,
        ),
    )


def _ctx(tracks, zones, ts, cfg=None) -> RuleContext:
    return RuleContext(
        tracks=tracks,
        zones=zones,
        config=cfg or AIConfig(),
        frame_index=0,
        timestamp=ts,
        camera_id="cam-test",
    )


def test_group_entry_not_critical_tailgating():
    z = Zone(
        "restricted_flank",
        "Flank",
        (Point(0, 0), Point(100, 0), Point(100, 100), Point(0, 100)),
        restricted=True,
    )
    zones = PolygonZoneManager([z])
    rule = TailgatingRule(window_seconds=3.0)
    t0 = datetime(2026, 7, 29, 14, 0, 0)
    # enter first person
    a1 = rule.evaluate(_ctx([_track(1, 50, 50)], zones, t0))
    assert a1 == []
    # second person within window
    a2 = rule.evaluate(_ctx([_track(1, 50, 50), _track(2, 40, 40)], zones, t0 + timedelta(seconds=1)))
    assert len(a2) == 1
    assert a2[0].incident_type == IncidentType.GROUP_ENTRY
    assert a2[0].severity.value == "medium"
    assert a2[0].metadata.get("rule") == "group_entry"
    print("group_entry: ok")


def test_loitering_dwell():
    z = Zone(
        "loiter_gate_apron",
        "Apron",
        (Point(0, 0), Point(100, 0), Point(100, 100), Point(0, 100)),
        restricted=False,
        loiter=True,
    )
    zones = PolygonZoneManager([z])
    rule = LoiteringRule(dwell_seconds=5.0)
    t0 = datetime(2026, 7, 29, 14, 0, 0)
    assert rule.evaluate(_ctx([_track(7, 50, 50)], zones, t0)) == []
    hit = rule.evaluate(_ctx([_track(7, 50, 50)], zones, t0 + timedelta(seconds=6)))
    assert len(hit) == 1
    assert hit[0].incident_type == IncidentType.LOITERING
    # once only
    assert rule.evaluate(_ctx([_track(7, 50, 50)], zones, t0 + timedelta(seconds=8))) == []
    print("loitering: ok")


def test_night_uses_timestamp_hour():
    zones = PolygonZoneManager([])
    rule = NightMovementRule()
    cfg = AIConfig(night_start_hour=22, night_end_hour=5)
    day = datetime(2026, 7, 29, 14, 30, 0)
    night = datetime(2026, 7, 29, 23, 10, 0)
    assert rule.evaluate(_ctx([_track(1, 10, 10)], zones, day, cfg)) == []
    n = rule.evaluate(_ctx([_track(1, 10, 10)], zones, night, cfg))
    assert len(n) == 1
    assert n[0].incident_type == IncidentType.UNAUTHORIZED_NIGHT_MOVEMENT
    print("night_movement: ok")


def test_camera_health_black_streak():
    zones = PolygonZoneManager([])
    rule = CameraHealthRule(black_mean_max=8.0, streak=5)
    t0 = datetime(2026, 7, 29, 14, 0, 0)
    for _ in range(4):
        rule.note_frame(1.0)
        assert rule.evaluate(_ctx([], zones, t0)) == []
    rule.note_frame(1.0)
    hit = rule.evaluate(_ctx([], zones, t0))
    assert len(hit) == 1
    assert hit[0].incident_type == IncidentType.CAMERA_HEALTH
    assert rule.evaluate(_ctx([], zones, t0)) == []  # one-shot until clear
    rule.note_frame(40.0)
    rule.note_frame(1.0)
    assert rule.evaluate(_ctx([], zones, t0)) == []  # streak reset
    print("camera_health: ok")


def test_default_zones_json_loads():
    path = ROOT / "datasets" / "zones" / "default_zones.json"
    mgr = PolygonZoneManager.from_json(path, frame_size=(1280, 720))
    ids = {z.zone_id for z in mgr.zones()}
    assert "loiter_gate_apron" in ids
    assert "restricted_flank" in ids
    apron = next(z for z in mgr.zones() if z.zone_id == "loiter_gate_apron")
    assert apron.loiter is True and apron.restricted is False
    print("default_zones: ok")


if __name__ == "__main__":
    test_group_entry_not_critical_tailgating()
    test_loitering_dwell()
    test_night_uses_timestamp_hour()
    test_camera_health_black_streak()
    test_default_zones_json_loads()
    print("All gate-rule checks PASSED.")
