from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.deps import get_db, require_admin
from app.models import AdminSession, AdminUser
from app.schemas import LoginIn, TokenOut
from app.security import new_token, verify_password

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    admin = db.execute(
        select(AdminUser).where(AdminUser.username == payload.username)
    ).scalar_one_or_none()
    if admin is None or not verify_password(
        payload.password, admin.password_hash, admin.password_salt
    ):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    ttl = get_settings().session_ttl_hours
    session = AdminSession(
        token=new_token(),
        admin_id=admin.id,
        expires_at=datetime.utcnow() + timedelta(hours=ttl),
    )
    db.add(session)
    db.commit()
    return TokenOut(token=session.token, expires_at=session.expires_at)


@router.post("/logout")
def logout(
    authorization: str | None = Header(default=None), db: Session = Depends(get_db)
):
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        session = db.get(AdminSession, token)
        if session:
            db.delete(session)
            db.commit()
    return {"ok": True}


@router.get("/me")
def me(admin: AdminUser = Depends(require_admin)):
    return {"id": admin.id, "username": admin.username}
