"""Process N frames of real footage; assert pipeline does not crash."""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from ai.config import AIConfig
from ai.incidents import IncidentEngine
from ai.pipeline import GuardianPipeline


def main() -> int:
    video = ROOT / "Hostel footage" / "D03_20260729142351.mp4"
    if not video.is_file():
        print("SKIP no D03 clip")
        return 0
    os.environ.setdefault("GUARDIAN_MAX_WIDTH", "960")
    os.environ.setdefault("GUARDIAN_LOITER_S", "15")
    zones = ROOT / "datasets" / "zones" / "default_zones.json"
    cfg = AIConfig(
        source=str(video),
        camera_id="rc-D03",
        zones_path=str(zones) if zones.is_file() else None,
        device="cpu",
    )
    pipe = GuardianPipeline(config=cfg, incidents=IncidentEngine(cooldown_seconds=2.0))
    pipe.open()
    n = int(os.environ.get("GUARDIAN_RC_FRAMES", "40"))
    ok = 0
    people_peak = 0
    for i in range(n):
        fr = pipe.read()
        if fr is None:
            break
        ok += 1
        people_peak = max(people_peak, len(fr.tracks))
    pipe.close()
    incs = pipe.incidents.list_incidents(limit=50)
    print(f"frames={ok} people_peak={people_peak} incidents={len(incs)}")
    for inc in incs[:8]:
        print(f"  - {inc.incident_type} [{inc.severity}] {inc.reason[:90]}")
    assert ok > 5, "too few frames decoded"
    print("ai_footage_smoke: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
