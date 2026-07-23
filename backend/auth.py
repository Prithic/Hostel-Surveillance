"""Warden session auth — token in memory + optional cookie. Stdlib only."""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import threading
import time
from dataclasses import dataclass

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

_bearer = HTTPBearer(auto_error=False)


@dataclass
class Session:
    token: str
    email: str
    role: str
    expires_at: float


class AuthService:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}
        self._lock = threading.Lock()
        self.admin_email = os.environ.get("GUARDIAN_ADMIN_EMAIL", "admin@guardian.ai")
        # ponytail: demo default — override via env for real events
        self.admin_password = os.environ.get("GUARDIAN_ADMIN_PASSWORD", "Warden@2026")
        self.ttl_seconds = int(os.environ.get("GUARDIAN_SESSION_TTL", "28800"))

    def login(self, email: str, password: str) -> Session | None:
        if not hmac.compare_digest(email.strip(), self.admin_email):
            return None
        if not hmac.compare_digest(password, self.admin_password):
            return None
        token = secrets.token_urlsafe(32)
        session = Session(
            token=token,
            email=self.admin_email,
            role="warden",
            expires_at=time.time() + self.ttl_seconds,
        )
        with self._lock:
            self._sessions[token] = session
        return session

    def logout(self, token: str | None) -> None:
        if not token:
            return
        with self._lock:
            self._sessions.pop(token, None)

    def validate(self, token: str | None) -> Session:
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        with self._lock:
            session = self._sessions.get(token)
            if session is None or session.expires_at < time.time():
                self._sessions.pop(token, None)
                raise HTTPException(status_code=401, detail="Session expired")
            return session


auth_service = AuthService()


def _token_from_request(
    request: Request,
    creds: HTTPAuthorizationCredentials | None,
) -> str | None:
    if creds and creds.scheme.lower() == "bearer":
        return creds.credentials
    return request.cookies.get("guardian_token")


def require_warden(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> Session:
    return auth_service.validate(_token_from_request(request, creds))


def password_fingerprint() -> str:
    """Non-reversible hint for health/debug — not the password."""
    return hashlib.sha256(auth_service.admin_password.encode()).hexdigest()[:8]
