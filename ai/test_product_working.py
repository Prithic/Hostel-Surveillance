"""Self-check: multi-user auth + hostel mutations + config replace."""

from __future__ import annotations

import tempfile
from dataclasses import replace
from pathlib import Path

from ai.config import AIConfig
from backend.hostel import HostelStore, SEED
from backend.users import UserStore


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "t.db"
        users = UserStore(path=db)
        assert users.authenticate("admin@guardian.ai", "Warden@2026")
        assert users.authenticate("student@hostel.local", "Student@2026")
        assert users.authenticate("admin@guardian.ai", "wrong") is None
        assert users.set_password("student@hostel.local", "Student@9999")
        assert users.authenticate("student@hostel.local", "Student@9999")

        hostel = HostelStore(path=db)
        state = hostel.get()
        assert "attendanceRoster" in state
        assert "laundryClaims" in state
        assert "mealPlan" in state
        assert all("id" in i for i in state["inventory"])

        hostel.patch_list_item("attendanceRoster", "1", {"status": "Absent", "time": "-"})
        assert any(r["id"] == "1" and r["status"] == "Absent" for r in hostel.get()["attendanceRoster"])

        hostel.append("laundryClaims", {"id": "CLM-T", "item": "Sock", "status": "Under Verification"})
        hostel.push_notification("Test", "body", "info")
        assert any(n["title"] == "Test" for n in hostel.get()["notifications"])

        assert "mealPlan" in SEED
        hostel.replace_key("mealPlan", {"breakfast": "X", "lunch": "Y", "dinner": "Z"})
        assert hostel.get()["mealPlan"]["breakfast"] == "X"

    cfg = AIConfig(confidence_threshold=0.5, crowd_threshold=5)
    cfg2 = replace(cfg, confidence_threshold=0.7, crowd_threshold=8, night_start_hour=21)
    assert cfg2.confidence_threshold == 0.7 and cfg2.crowd_threshold == 8

    print("product_working: ok")


if __name__ == "__main__":
    main()
