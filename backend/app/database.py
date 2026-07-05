import os

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import get_settings


@event.listens_for(Engine, "connect")
def _register_sqlite_unicode_lower(dbapi_conn, _rec):
    """SQLite's built-in lower() is ASCII-only; make it Unicode-aware so
    Cyrillic case-insensitive search works in dev/test (Postgres handles it
    natively in prod)."""
    if hasattr(dbapi_conn, "create_function"):  # sqlite3 connections only
        dbapi_conn.create_function(
            "lower", 1, lambda s: s.lower() if s is not None else None
        )


class Base(DeclarativeBase):
    pass


def _resolve_url() -> str:
    """Postgres via DATABASE_URL in prod; local SQLite file as dev fallback."""
    url = get_settings().database_url.strip()
    if not url:
        return "sqlite:///./dev.db"
    # Heroku/Railway style postgres:// → postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


DATABASE_URL = os.environ.get("DATABASE_URL_OVERRIDE") or _resolve_url()

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
