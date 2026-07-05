from datetime import datetime

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AdminSession, AdminUser

__all__ = ["get_db", "require_admin"]


def require_admin(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Validate `Authorization: Bearer <token>` against a live admin session."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    token = authorization.split(" ", 1)[1].strip()
    session = db.get(AdminSession, token)
    if session is None:
        raise HTTPException(status_code=401, detail="Недействительный токен")
    if session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Сессия истекла")
    admin = db.get(AdminUser, session.admin_id)
    if admin is None:
        raise HTTPException(status_code=401, detail="Админ не найден")
    return admin
