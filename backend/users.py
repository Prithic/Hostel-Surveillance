"""Multi-user auth store — PBKDF2 password hashes in SQLite (stdlib only)."""

from __future__ import annotations

import hashlib
import hmac
import secrets
import sqlite3
import threading
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "data" / "guardian.db"

# Bootstrap accounts (first run only). Change passwords via API after login.
BOOTSTRAP_USERS = [
    {
        "email": "admin@guardian.ai",
        "password": "Warden@2026",
        "role": "Warden",
        "name": "Chief Warden",
        "room": "Office",
        "student_id": "WARDEN-01",
    },
    {
        "email": "student@hostel.local",
        "password": "Student@2026",
        "role": "Student",
        "name": "Sharan M",
        "room": "B-214",
        "student_id": "7176211001",
    },
    {
        "email": "laundry@hostel.local",
        "password": "Laundry@2026",
        "role": "Laundry Staff",
        "name": "Laundry Desk",
        "room": "Service",
        "student_id": "LAUNDRY-01",
    },
]


def _hash_password(password: str, salt: bytes | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return salt.hex(), digest.hex()


def _verify(password: str, salt_hex: str, hash_hex: str) -> bool:
    salt = bytes.fromhex(salt_hex)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return hmac.compare_digest(digest.hex(), hash_hex)


@dataclass
class UserRecord:
    email: str
    role: str
    name: str
    room: str
    student_id: str


class UserStore:
    def __init__(self, path: Path | None = None) -> None:
        self.path = path or DEFAULT_DB
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._init()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self) -> None:
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        email TEXT PRIMARY KEY,
                        password_salt TEXT NOT NULL,
                        password_hash TEXT NOT NULL,
                        role TEXT NOT NULL,
                        name TEXT NOT NULL,
                        room TEXT NOT NULL,
                        student_id TEXT NOT NULL
                    )
                    """
                )
                count = conn.execute("SELECT COUNT(*) AS c FROM users").fetchone()["c"]
                if count == 0:
                    for u in BOOTSTRAP_USERS:
                        salt, pw_hash = _hash_password(u["password"])
                        conn.execute(
                            """
                            INSERT INTO users (email, password_salt, password_hash, role, name, room, student_id)
                            VALUES (?,?,?,?,?,?,?)
                            """,
                            (u["email"].lower(), salt, pw_hash, u["role"], u["name"], u["room"], u["student_id"]),
                        )
                conn.commit()
            finally:
                conn.close()

    def authenticate(self, email: str, password: str) -> UserRecord | None:
        email = email.strip().lower()
        with self._lock:
            conn = self._connect()
            try:
                row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            finally:
                conn.close()
        if row is None:
            return None
        if not _verify(password, row["password_salt"], row["password_hash"]):
            return None
        return UserRecord(
            email=row["email"],
            role=row["role"],
            name=row["name"],
            room=row["room"],
            student_id=row["student_id"],
        )

    def get(self, email: str) -> UserRecord | None:
        email = email.strip().lower()
        with self._lock:
            conn = self._connect()
            try:
                row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            finally:
                conn.close()
        if row is None:
            return None
        return UserRecord(
            email=row["email"],
            role=row["role"],
            name=row["name"],
            room=row["room"],
            student_id=row["student_id"],
        )

    def list_users(self) -> list[dict]:
        with self._lock:
            conn = self._connect()
            try:
                rows = conn.execute(
                    "SELECT email, role, name, room, student_id FROM users ORDER BY role, email"
                ).fetchall()
            finally:
                conn.close()
        return [dict(r) for r in rows]

    def set_password(self, email: str, new_password: str) -> bool:
        if len(new_password) < 8:
            return False
        email = email.strip().lower()
        salt, pw_hash = _hash_password(new_password)
        with self._lock:
            conn = self._connect()
            try:
                cur = conn.execute(
                    "UPDATE users SET password_salt=?, password_hash=? WHERE email=?",
                    (salt, pw_hash, email),
                )
                conn.commit()
                return cur.rowcount > 0
            finally:
                conn.close()

    def upsert_user(
        self,
        *,
        email: str,
        password: str,
        role: str,
        name: str,
        room: str = "",
        student_id: str = "",
    ) -> UserRecord:
        email = email.strip().lower()
        salt, pw_hash = _hash_password(password)
        with self._lock:
            conn = self._connect()
            try:
                conn.execute(
                    """
                    INSERT INTO users (email, password_salt, password_hash, role, name, room, student_id)
                    VALUES (?,?,?,?,?,?,?)
                    ON CONFLICT(email) DO UPDATE SET
                        password_salt=excluded.password_salt,
                        password_hash=excluded.password_hash,
                        role=excluded.role,
                        name=excluded.name,
                        room=excluded.room,
                        student_id=excluded.student_id
                    """,
                    (email, salt, pw_hash, role, name, room, student_id),
                )
                conn.commit()
            finally:
                conn.close()
        return UserRecord(email=email, role=role, name=name, room=room, student_id=student_id)
