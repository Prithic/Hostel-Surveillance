"""Session auth backed by UserStore (PBKDF2). Stdlib only."""

from __future__ import annotations

import os
import secrets
import threading
import time
from dataclasses import dataclass

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.users import UserStore

_bearer = HTTPBearer(auto_error=False)


@dataclass
class Session:
    token: str
    email: str
    role: str
    name: str
    room: str
    student_id: str
    expires_at: float


class AuthService:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}
        self._lock = threading.Lock()
        self.users = UserStore()
        self.ttl_seconds = int(os.environ.get("GUARDIAN_SESSION_TTL", "28800"))

    def login(self, email: str, password: str) -> Session | None:
        user = self.users.authenticate(email, password)
        if user is None:
            return None
        token = secrets.token_urlsafe(32)
        session = Session(
            token=token,
            email=user.email,
            role=user.role,
            name=user.name,
            room=user.room,
            student_id=user.student_id,
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


def require_role(*roles: str):
    def _dep(session: Session = Depends(require_warden)) -> Session:
        if roles and session.role not in roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(roles)}")
        return session

    return _dep
