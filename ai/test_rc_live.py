"""Live RC probe against a running GuardianAI API (http://127.0.0.1:8000)."""
from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8000"
FAIL = 0


def check(name: str, cond: bool, detail: str = "") -> None:
    global FAIL
    mark = "PASS" if cond else "FAIL"
    if not cond:
        FAIL += 1
    print(f"{mark}  {name}" + (f" â€” {detail}" if detail else ""))


def req(method: str, path: str, token: str | None = None, body: dict | None = None, timeout: float = 15.0):
    data = None
    headers = {"Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=timeout) as res:
            raw = res.read().decode("utf-8", errors="replace")
            try:
                payload = json.loads(raw) if raw else None
            except json.JSONDecodeError:
                payload = raw
            return res.status, payload
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else {"detail": raw}
        except json.JSONDecodeError:
            payload = {"detail": raw}
        return e.code, payload


def login(email: str, password: str) -> str:
    code, data = req("POST", "/api/auth/login", body={"email": email, "password": password})
    check(f"login {email}", code == 200, str(code))
    return (data or {}).get("token") or ""


def main() -> int:
    code, _ = req("GET", "/health", timeout=5)
    check("health", code == 200, str(code))
    if code != 200:
        print("API not up on :8000 â€” start backend first")
        return 2

    code, _ = req("POST", "/api/auth/login", body={"email": "bad", "password": "bad"})
    check("invalid login â†’ 401", code == 401)

    code, _ = req("GET", "/api/incidents")
    check("incidents no auth â†’ 401", code == 401)

    # stream: only headers (range first bytes via short timeout ok)
    try:
        r = urllib.request.Request(BASE + "/api/stream")
        with urllib.request.urlopen(r, timeout=3) as res:
            check("stream no auth â†’ should 401", False, f"got {res.status}")
    except urllib.error.HTTPError as e:
        check("stream no auth â†’ 401", e.code == 401, str(e.code))
    except TimeoutError:
        check("stream no auth â†’ 401", False, "timeout (open stream?)")

    wt = login("admin@guardian.ai", "Warden@2026")
    code, st = req("GET", "/api/status", token=wt)
    check("warden status", code == 200, json.dumps(st)[:140] if isinstance(st, dict) else str(st))

    code, _ = req("GET", "/api/incidents?limit=5", token=wt)
    check("warden incidents", code == 200)

    code, _ = req("GET", "/api/analytics", token=wt)
    check("warden analytics", code == 200)

    code, chat = req("POST", "/api/chat", token=wt, body={"message": "latest incident"})
    check("warden chat", code == 200 and isinstance(chat, dict) and "reply" in chat)

    code, vids = req("GET", "/api/videos", token=wt)
    check("warden videos list", code == 200 and isinstance(vids, list), f"n={len(vids) if isinstance(vids, list) else 0}")

    # authenticated stream briefly
    try:
        r = urllib.request.Request(BASE + f"/api/stream?token={wt}")
        with urllib.request.urlopen(r, timeout=4) as res:
            chunk = res.read(2048)
            check("stream with token", res.status == 200 and len(chunk) > 0, f"bytes={len(chunk)}")
    except Exception as e:  # noqa: BLE001
        check("stream with token", False, str(e))

    stok = login("student@hostel.local", "Student@2026")
    code, _ = req("GET", "/api/incidents", token=stok)
    check("student incidents â†’ 403", code == 403)
    code, _ = req("GET", "/api/analytics", token=stok)
    check("student analytics â†’ 403", code == 403)
    code, _ = req("POST", "/api/chat", token=stok, body={"message": "alerts"})
    check("student chat â†’ 403", code == 403)
    code, _ = req("POST", "/api/hostel/append", token=stok, body={"key": "sosEvents", "item": {"note": "x"}})
    check("student SOS append blocked", code in (400, 403), str(code))

    code, sos = req("POST", "/api/hostel/sos", token=stok, body={"note": "RC live SOS", "location": "Gate"})
    check("student SOS", code == 200, str((sos or {}).get("incident", {}).get("id")))
    sos_id = (sos or {}).get("incident", {}).get("id")

    code, leave = req(
        "POST",
        "/api/hostel/append",
        token=stok,
        body={
            "key": "leaveRequests",
            "item": {
                "id": f"OUT-RC-{int(time.time())}",
                "studentName": "RC Student",
                "status": "Pending Warden Permission",
                "reason": "RC",
            },
        },
    )
    check("student leave", code == 200, str((leave or {}).get("id")))

    code, _ = req(
        "POST",
        "/api/hostel/append",
        token=stok,
        body={"key": "complaints", "item": {"id": f"CMP-RC-{int(time.time())}", "category": "RC", "status": "Pending"}},
    )
    check("student complaint", code == 200)

    code, _ = req("PUT", "/api/hostel/key", token=stok, body={"key": "analytics", "value": {"x": 1}})
    check("student analytics replace deny", code in (400, 403))
    code, _ = req("PUT", "/api/hostel/key", token=stok, body={"key": "currentUser", "value": {"name": "Hacker"}})
    check("student currentUser replace deny", code in (400, 403))

    lt = login("laundry@hostel.local", "Laundry@2026")
    code, state = req("GET", "/api/hostel/state", token=lt)
    check("laundry state", code == 200)
    laundry = (state or {}).get("laundryTracking") or []
    if laundry:
        lid = laundry[0]["id"]
        code, row = req(
            "PATCH",
            "/api/hostel/item",
            token=lt,
            body={"key": "laundryTracking", "id": lid, "updates": {"status": "Washing"}},
        )
        check("laundry patch", code == 200, str((row or {}).get("status")))
    else:
        check("laundry patch", False, "empty laundryTracking")

    code, _ = req("GET", "/api/incidents", token=lt)
    check("laundry incidents â†’ 403", code == 403)

    if sos_id:
        code, _ = req("PATCH", f"/api/incidents/{sos_id}", token=wt)
        check("warden resolve SOS", code == 200)

    code, _ = req("POST", "/api/auth/login", body={"email": "admin@guardian.ai' OR '1'='1", "password": "x"})
    check("SQLi-ish login â†’ 401", code == 401)

    code, chat = req("POST", "/api/chat", token=wt, body={"message": "<script>alert(1)</script>"})
    reply = (chat or {}).get("reply") if isinstance(chat, dict) else ""
    check("chat XSS no crash", code == 200)
    check("chat no raw script echo", "<script>" not in (reply or "").lower())

    code, _ = req("POST", "/api/auth/logout", token=wt)
    check("logout", code == 200)
    code, _ = req("GET", "/api/incidents", token=wt)
    check("token dead after logout", code == 401)

    print("---")
    print("FAILS", FAIL)
    return 1 if FAIL else 0


if __name__ == "__main__":
    raise SystemExit(main())

