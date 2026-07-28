"""Hostel ERP state — one JSON document in SQLite, seeded once, mutated via API."""

from __future__ import annotations

import json
import sqlite3
import threading
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "data" / "guardian.db"

# Seed matches former frontend dummyData shapes (warden console).
SEED: dict[str, Any] = {
    "currentUser": {
        "name": "Warden Desk",
        "email": "admin@guardian.ai",
        "room": "Office",
        "block": "Admin",
        "avatarColor": "#2563EB",
        "studentId": "WARDEN",
        "role": "Warden",
    },
    "statSummary": {
        "attendance": 92,
        "room": "B-204",
        "pendingComplaints": 2,
        "feeStatus": "Paid",
        "todayMenu": "Paneer Butter Masala",
        "laundryStatus": "Washing",
    },
    "roomInfo": [
        {"label": "Room Number", "value": "B-204"},
        {"label": "Hostel Block", "value": "Block B"},
        {"label": "Floor", "value": "2nd Floor"},
        {"label": "Room Type", "value": "Twin Sharing"},
        {"label": "Warden Name", "value": "Mrs. Kavita Rao"},
        {"label": "Caretaker", "value": "Mr. Suresh Nair"},
        {"label": "Contact Number", "value": "+91 98765 43210"},
    ],
    "roommates": [
        {"name": "Rohit Sharma", "course": "B.Tech CSE, 2nd Year"},
        {"name": "Aarav Mehta", "course": "B.Tech CSE, 2nd Year"},
    ],
    "attendanceLog": [
        {"date": "2026-07-20", "checkIn": "08:02 AM", "checkOut": "09:55 PM", "status": "Present", "method": "QR Code"},
        {"date": "2026-07-19", "checkIn": "08:10 AM", "checkOut": "09:40 PM", "status": "Present", "method": "QR Code"},
        {"date": "2026-07-18", "checkIn": "—", "checkOut": "—", "status": "Absent", "method": "—"},
        {"date": "2026-07-17", "checkIn": "07:58 AM", "checkOut": "10:02 PM", "status": "Present", "method": "Manual"},
        {"date": "2026-07-16", "checkIn": "08:20 AM", "checkOut": "09:30 PM", "status": "Present", "method": "QR Code"},
    ],
    "attendanceTrend": [
        {"day": "Mon", "pct": 100},
        {"day": "Tue", "pct": 100},
        {"day": "Wed", "pct": 0},
        {"day": "Thu", "pct": 100},
        {"day": "Fri", "pct": 100},
        {"day": "Sat", "pct": 100},
        {"day": "Sun", "pct": 100},
    ],
    "complaints": [
        {"id": "CMP-104", "category": "WiFi", "description": "Weak signal in room B-204", "status": "In Progress", "date": "2026-07-19"},
        {"id": "CMP-101", "category": "Electricity", "description": "Flickering tube light", "status": "Pending", "date": "2026-07-17"},
        {"id": "CMP-098", "category": "Cleaning", "description": "Washroom needs cleaning", "status": "Completed", "date": "2026-07-10"},
    ],
    "complaintCategories": [
        "Water Leakage", "Fan", "Electricity", "WiFi", "Cleaning", "Washroom", "Bullying", "Ragging", "Missing Item",
    ],
    "notices": [
        {"id": 1, "type": "Holiday", "title": "Independence Day — Mess closed after 8 PM", "date": "2026-08-15"},
        {"id": 2, "type": "Maintenance", "title": "Elevator maintenance in Block B", "date": "2026-07-24"},
        {"id": 3, "type": "Water Shutdown", "title": "Water supply off 2–4 PM tomorrow", "date": "2026-07-23"},
        {"id": 4, "type": "Exam Notice", "title": "Semester exam timetable released", "date": "2026-07-22"},
    ],
    "events": [
        {"id": 1, "title": "Cultural Night", "date": "2026-07-28"},
        {"id": 2, "title": "Sports Meet Finals", "date": "2026-08-02"},
    ],
    "feeStatus": {"paid": 42000, "pending": 0, "dueDate": "2026-08-10", "amount": 42000},
    "paymentHistory": [
        {"id": "PMT-2201", "date": "2026-01-05", "amount": 21000, "status": "Paid", "mode": "UPI"},
        {"id": "PMT-2205", "date": "2026-06-05", "amount": 21000, "status": "Paid", "mode": "Card"},
    ],
    "todayMenu": {
        "breakfast": "Idli, Sambar, Chutney",
        "lunch": "Rice, Dal, Paneer Butter Masala, Salad",
        "snacks": "Samosa & Tea",
        "dinner": "Chapati, Mixed Veg, Curd",
    },
    "mealTimings": {
        "breakfast": "7:30 AM – 9:00 AM",
        "lunch": "12:30 PM – 2:00 PM",
        "snacks": "5:00 PM – 6:00 PM",
        "dinner": "7:00 PM – 9:00 PM",
    },
    "laundrySlots": ["7:00 AM", "9:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"],
    "laundryTracking": [
        {"id": "LDY-3391", "item": "Bedsheet + 4 clothes", "status": "Washing", "qr": "LDY-3391-QR"},
    ],
    "lostAndFoundItems": [
        {"id": 1, "name": "Wallet", "location": "Mess Hall", "date": "2026-07-18"},
        {"id": 2, "name": "Phone Charger", "location": "Study Hall", "date": "2026-07-17"},
        {"id": 3, "name": "ID Card", "location": "Block B Lobby", "date": "2026-07-15"},
        {"id": 4, "name": "Keys", "location": "Laundry Room", "date": "2026-07-14"},
    ],
    "visitors": [
        {
            "id": "VIS-551",
            "name": "Rakesh Mehta",
            "relation": "Father",
            "phone": "98xxxxxx10",
            "entry": "10:00 AM",
            "exit": "11:30 AM",
            "date": "2026-07-19",
        },
    ],
    "inventory": [
        {"id": "INV-1", "item": "Bed", "qty": 1, "condition": "Good"},
        {"id": "INV-2", "item": "Chair", "qty": 1, "condition": "Good"},
        {"id": "INV-3", "item": "Table", "qty": 1, "condition": "Needs Repair"},
        {"id": "INV-4", "item": "Fan", "qty": 1, "condition": "Good"},
        {"id": "INV-5", "item": "Cupboard", "qty": 1, "condition": "Good"},
        {"id": "INV-6", "item": "Light", "qty": 2, "condition": "Good"},
        {"id": "INV-7", "item": "Window", "qty": 1, "condition": "Good"},
    ],
    "attendanceRoster": [
        {"id": "1", "name": "Sharan M", "regNo": "7176211001", "dept": "AIML", "block": "B-214", "status": "Present", "time": "08:15 AM"},
        {"id": "2", "name": "Akash K", "regNo": "7176211002", "dept": "CSE", "block": "A-201", "status": "Present", "time": "08:22 AM"},
        {"id": "3", "name": "Vignesh M", "regNo": "7176211003", "dept": "AI&DS", "block": "B-102", "status": "Late Entry", "time": "09:05 AM"},
        {"id": "4", "name": "Sanjay R", "regNo": "7176211004", "dept": "ECE", "block": "C-405", "status": "Absent", "time": "-"},
        {"id": "5", "name": "Hari Prasad", "regNo": "7176211005", "dept": "IT", "block": "B-110", "status": "Present", "time": "08:10 AM"},
        {"id": "6", "name": "Meena S", "regNo": "7176211006", "dept": "EEE", "block": "D-108", "status": "Present", "time": "08:30 AM"},
        {"id": "7", "name": "Priya Dharshini", "regNo": "7176211007", "dept": "Mechanical", "block": "D-215", "status": "Leave", "time": "-"},
        {"id": "8", "name": "Nithya S", "regNo": "7176211008", "dept": "AI&DS", "block": "D-112", "status": "Present", "time": "08:18 AM"},
    ],
    "laundryClaims": [
        {"id": "CLM-101", "student": "Sharan M (B-214)", "item": "1 Blue Denim Shirt", "batch": "LND-8821", "status": "Under Verification", "date": "Yesterday"},
        {"id": "CLM-098", "student": "Akash K (A-201)", "item": "1 Black Towel", "batch": "LND-8802", "status": "Found & Returned", "date": "3 days ago"},
    ],
    "mealPlan": {
        "breakfast": "Regular Non-Veg",
        "lunch": "Veg Special",
        "dinner": "Regular Non-Veg",
    },
    "messFeedback": [],
    "nextInspection": {"date": "2026-08-15", "block": "Block B", "notes": "Scheduled monthly inspection"},
    "notifications": [],
    "inspections": [
        {"id": 1, "date": "2026-06-15", "result": "Passed", "remarks": "Room tidy, no issues"},
        {"id": 2, "date": "2026-05-15", "result": "Warning", "remarks": "Table found damaged"},
    ],
    "leaveRequests": [
        {
            "id": "OUT-9921",
            "studentName": "Sharan M",
            "regNo": "7176211001",
            "room": "B-214",
            "dept": "AIML (Year 2)",
            "type": "Weekend Home Visit",
            "destination": "Coimbatore, Tamil Nadu",
            "reason": "Family event & weekend home visit",
            "outTime": "2026-07-24 05:00 PM",
            "inTime": "2026-07-26 08:00 PM",
            "travelMode": "Personal Bike / Bus",
            "parentPhone": "9842100000",
            "parentConfirmed": True,
            "status": "Pending Warden Permission",
            "appliedOn": "2026-07-22",
        },
        {
            "id": "OUT-9804",
            "studentName": "Akash K",
            "regNo": "7176211002",
            "room": "A-201",
            "dept": "CSE (Year 2)",
            "type": "Night Outpass",
            "destination": "TNPESU Hackathon Campus",
            "reason": "Participating in 24hr National Hackathon",
            "outTime": "2026-07-20 06:00 PM",
            "inTime": "2026-07-21 10:00 AM",
            "travelMode": "Train (Express)",
            "parentPhone": "9443200000",
            "parentConfirmed": True,
            "status": "Approved Pass",
            "appliedOn": "2026-07-18",
        },
    ],
    "notificationPrefs": {
        "complaintUpdates": True,
        "noticeAlerts": True,
        "feeReminders": True,
        "laundryReady": False,
        "messFeedback": False,
    },
    "emergencyContacts": [
        {"name": "Security Desk", "role": "Security", "phone": "+91 98765 43210"},
        {"name": "Chief Warden", "role": "Warden", "phone": "+91 98765 43211"},
        {"name": "Campus Clinic", "role": "Medical", "phone": "+91 98765 43212"},
    ],
    "sosEvents": [],
    "analytics": {
        "attendance": [
            {"month": "Feb", "value": 88},
            {"month": "Mar", "value": 90},
            {"month": "Apr", "value": 85},
            {"month": "May", "value": 93},
            {"month": "Jun", "value": 91},
            {"month": "Jul", "value": 92},
        ],
        "complaintsTrend": [
            {"month": "Feb", "count": 12},
            {"month": "Mar", "count": 9},
            {"month": "Apr", "count": 14},
            {"month": "May", "count": 7},
            {"month": "Jun", "count": 10},
            {"month": "Jul", "count": 6},
        ],
        "messRatings": [
            {"day": "Mon", "rating": 4.1},
            {"day": "Tue", "rating": 3.8},
            {"day": "Wed", "rating": 4.4},
            {"day": "Thu", "rating": 4.0},
            {"day": "Fri", "rating": 4.6},
            {"day": "Sat", "rating": 3.9},
            {"day": "Sun", "rating": 4.2},
        ],
        "occupancy": [
            {"name": "Occupied", "value": 312},
            {"name": "Vacant", "value": 28},
        ],
    },
}


class HostelStore:
    def __init__(self, path: Path | None = None) -> None:
        self.path = path or DEFAULT_DB
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._init()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path, check_same_thread=False)
        return conn

    def _init(self) -> None:
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS hostel_state (
                        id INTEGER PRIMARY KEY CHECK (id = 1),
                        payload TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                    """
                )
                row = conn.execute("SELECT payload FROM hostel_state WHERE id = 1").fetchone()
                if row is None:
                    now = datetime.now(timezone.utc).isoformat()
                    conn.execute(
                        "INSERT INTO hostel_state (id, payload, updated_at) VALUES (1, ?, ?)",
                        (json.dumps(SEED), now),
                    )
                    conn.commit()
            finally:
                conn.close()

    def get(self) -> dict[str, Any]:
        with self._lock:
            conn = self._connect()
            try:
                row = conn.execute("SELECT payload FROM hostel_state WHERE id = 1").fetchone()
            finally:
                conn.close()
        if not row:
            return deepcopy(SEED)
        state = json.loads(row[0])
        # Backfill new seed keys without wiping live mutations.
        changed = False
        for k, v in SEED.items():
            if k not in state:
                state[k] = deepcopy(v)
                changed = True
        inv = state.get("inventory")
        if isinstance(inv, list):
            for i, item in enumerate(inv):
                if isinstance(item, dict) and "id" not in item:
                    item["id"] = f"INV-{i + 1}"
                    changed = True
        if changed:
            self.save(state)
        return state

    def save(self, state: dict[str, Any]) -> dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO hostel_state (id, payload, updated_at) VALUES (1, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at
                    """,
                    (json.dumps(state), now),
                )
                conn.commit()
            finally:
                conn.close()
        return state

    def patch_list_item(self, key: str, item_id: str, updates: dict[str, Any]) -> dict[str, Any] | None:
        state = self.get()
        items = state.get(key)
        if not isinstance(items, list):
            return None
        for i, item in enumerate(items):
            if str(item.get("id")) == str(item_id):
                items[i] = {**item, **updates}
                state[key] = items
                self._refresh_summary(state)
                self.save(state)
                return items[i]
        return None

    def append(self, key: str, item: dict[str, Any]) -> dict[str, Any]:
        state = self.get()
        items = list(state.get(key) or [])
        items.insert(0, item)
        state[key] = items
        self._refresh_summary(state)
        self.save(state)
        return item

    def replace_key(self, key: str, value: Any) -> Any:
        state = self.get()
        state[key] = value
        self._refresh_summary(state)
        self.save(state)
        return value

    @staticmethod
    def _refresh_summary(state: dict[str, Any]) -> None:
        complaints = state.get("complaints") or []
        pending = sum(1 for c in complaints if c.get("status") == "Pending")
        summary = dict(state.get("statSummary") or {})
        summary["pendingComplaints"] = pending
        laundry = state.get("laundryTracking") or []
        if laundry:
            summary["laundryStatus"] = laundry[0].get("status", summary.get("laundryStatus"))
        menu = state.get("todayMenu") or {}
        if menu.get("lunch"):
            lunch = str(menu["lunch"])
            summary["todayMenu"] = lunch.split(",")[0].strip() if lunch else summary.get("todayMenu")
        roster = state.get("attendanceRoster") or []
        if roster:
            present = sum(1 for s in roster if s.get("status") in ("Present", "Late Entry"))
            summary["attendance"] = round(100 * present / len(roster)) if roster else summary.get("attendance", 0)
        state["statSummary"] = summary

    def push_notification(self, title: str, body: str, level: str = "info") -> dict[str, Any]:
        note = {
            "id": f"NTF-{int(datetime.now(timezone.utc).timestamp())}",
            "title": title,
            "body": body,
            "level": level,
            "read": False,
            "at": datetime.now(timezone.utc).isoformat(),
        }
        return self.append("notifications", note)
