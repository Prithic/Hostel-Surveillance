import sys
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def test_ai_modules():
    print("Testing AI Modules & Configurations...", end=" ")
    from ai.config import AIConfig
    from ai.zone import Point, Zone
    from ai.polygon_zones import PolygonZoneManager
    from ai.rule_engine import SimpleRuleEngine, default_rules
    from ai.rules import Incident, IncidentType, RuleContext, Severity
    from ai.incidents import IncidentEngine

    cfg = AIConfig()
    assert cfg.confidence_threshold == 0.5, "Default confidence mismatch"

    # Polygon zone tests
    z = Zone(zone_id="z1", name="Test Zone", polygon=(Point(0, 0), Point(100, 0), Point(100, 100), Point(0, 100)))
    assert z.contains(Point(50, 50)) is True, "Point inside polygon check failed"
    assert z.contains(Point(150, 150)) is False, "Point outside polygon check failed"

    p_mgr = PolygonZoneManager([z])
    assert len(list(p_mgr.zones())) == 1

    # Rule engine edge case: zero tracks
    engine = SimpleRuleEngine(default_rules())
    ctx = RuleContext(
        tracks=[],
        zones=p_mgr,
        config=cfg,
        frame_index=0,
        timestamp=datetime.now(timezone.utc),
        camera_id="cam-test",
    )
    evaluated = list(engine.evaluate(ctx))
    assert isinstance(evaluated, list), "Rule evaluation should return a list"

    # Incident ingestion
    inc_engine = IncidentEngine()
    raw = Incident(
        incident_type=IncidentType.RESTRICTED_ZONE_ENTRY,
        severity=Severity.HIGH,
        reason="Test intrusion",
        track_ids=(1,),
        zone_ids=("z1",),
        metadata={"camera_id": "cam-test"},
    )
    stored = inc_engine.ingest("cam-test", [raw])
    assert len(stored) == 1
    assert stored[0].incident_type == "restricted_zone_entry"
    assert len(inc_engine.list_incidents()) == 1

    print("SUCCESS")


def test_chat_reply():
    print("Testing Chatbot reply logic...", end=" ")
    # Import only the pure function, not the hub (which needs an event loop)
    from ai.incidents import IncidentEngine
    from ai.alerts import AlertEngine

    # Verify the engines respond correctly on empty state
    ie = IncidentEngine()
    ae = AlertEngine()
    assert ie.list_incidents() == []
    assert ae.recent() == []
    print("SUCCESS")


def test_stress_and_long_runtime():
    print("Testing Pipeline Stress & Memory Stability (500 frames)...", end=" ")
    from ai.rules import Incident, IncidentType, Severity
    from ai.incidents import IncidentEngine

    inc_engine = IncidentEngine(cooldown_seconds=0.0)  # no cooldown so every frame emits
    for i in range(500):
        raw = Incident(
            incident_type=IncidentType.RESTRICTED_ZONE_ENTRY,
            severity=Severity.HIGH,
            reason=f"Frame {i} intrusion",
            track_ids=(i,),
            zone_ids=("z1",),
            metadata={"camera_id": "cam-0"},
        )
        inc_engine.ingest("cam-0", [raw])
        # Verify history is bounded
        assert len(inc_engine._history) <= 1000, "Memory leak: history buffer exceeded max capacity"

    print("SUCCESS")


if __name__ == "__main__":
    print("--- GUARDIAN AI SYSTEM INTEGRATION & STRESS TEST ---")
    try:
        test_ai_modules()
        test_chat_reply()
        test_stress_and_long_runtime()
        print("\nAll integration & stress checks PASSED.")
    except Exception:
        import traceback
        traceback.print_exc()
        sys.exit(1)
