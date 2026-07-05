import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.deps import get_db
from app.routers import (
    admin_auth,
    admin_catalog,
    admin_orders,
    admin_settings,
    catalog,
    delivery,
    orders,
)

settings = get_settings()
app = FastAPI(title="BONE BOUILLON API", version="1.0.0")

_origins = settings.cors_origin_list
_allow_all = "*" in _origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all else _origins,
    # Wildcard origins can't be combined with credentials; we use Bearer tokens,
    # not cookies, so disabling credentials in that mode is safe.
    allow_credentials=not _allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded product photos at /media
os.makedirs(settings.media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.media_dir), name="media")

for r in (
    catalog.router,
    delivery.router,
    orders.router,
    admin_auth.router,
    admin_catalog.router,
    admin_orders.router,
    admin_settings.router,
):
    app.include_router(r)


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db_ok = True
    try:
        db.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001
        db_ok = False
    return {"status": "ok", "db": db_ok}
