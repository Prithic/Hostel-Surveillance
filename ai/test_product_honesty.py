"""Honesty checks for the GuardianAI + Trinity hostel console (no network)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FE = ROOT / "frontend" / "src"


def test_no_trinity_mock_api():
    assert not (FE / "services" / "api.js").exists()


def test_app_has_full_nav_routes():
    app = (FE / "App.jsx").read_text(encoding="utf-8")
    for path in ("/dashboard", "/security", "/attendance", "/sos", "/mess", "/leave", "/complaints"):
        assert path in app, path
    assert "AdminLogin" not in app
    assert "dummyData" not in app


def test_pages_use_hostel_context_not_dummy_imports():
    dash = (FE / "pages" / "Dashboard.jsx").read_text(encoding="utf-8")
    assert "useHostel" in dash
    assert "dummyData" not in dash
    assert (FE / "hostel" / "HostelContext.jsx").exists()


def test_guardian_client_has_no_baked_password():
    src = (FE / "services" / "guardianApi.js").read_text(encoding="utf-8")
    assert "Warden@" not in src
    assert "login(email, password)" in src


def test_backend_hostel_module_exists():
    assert (ROOT / "backend" / "hostel.py").exists()
    main = (ROOT / "backend" / "main.py").read_text(encoding="utf-8")
    assert "/api/hostel/state" in main
    assert "/api/hostel/sos" in main


def test_warden_chat_uses_api_chat():
    chat = (FE / "components" / "WardenChat.jsx").read_text(encoding="utf-8")
    assert "/api/chat" in chat


def test_security_uses_websocket():
    sec = (FE / "pages" / "SecurityDashboard.jsx").read_text(encoding="utf-8")
    assert "alertsWsUrl" in sec or "/ws/alerts" in sec


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            print("ok", name)
    print("all honesty checks passed")
