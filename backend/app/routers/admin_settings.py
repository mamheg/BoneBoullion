from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import crud
from app.deps import get_db, require_admin
from app.models import DeliverySlot, Setting
from app.schemas import SettingIn, SlotGenerateIn

router = APIRouter(
    prefix="/api/admin", tags=["admin-settings"], dependencies=[Depends(require_admin)]
)


# ── Settings ───────────────────────────────────────────────────────────────
@router.get("/settings")
def list_settings(db: Session = Depends(get_db)):
    rows = db.execute(select(Setting)).scalars().all()
    return {row.key: row.value for row in rows}


@router.put("/settings")
def update_setting(payload: SettingIn, db: Session = Depends(get_db)):
    crud.set_setting(db, payload.key, payload.value)
    db.commit()
    return {"key": payload.key, "value": payload.value}


# ── Delivery slots management ──────────────────────────────────────────────
def _parse_window(win: str) -> tuple[time, time]:
    try:
        a, b = win.split("-")
        return (
            datetime.strptime(a.strip(), "%H:%M").time(),
            datetime.strptime(b.strip(), "%H:%M").time(),
        )
    except Exception:
        raise HTTPException(status_code=422, detail=f"Неверное окно: {win}")


@router.get("/slots")
def list_slots(db: Session = Depends(get_db)):
    rows = db.execute(
        select(DeliverySlot).order_by(DeliverySlot.date, DeliverySlot.start)
    ).scalars().all()
    return [
        {
            "id": s.id,
            "date": s.date.isoformat(),
            "start": s.start.strftime("%H:%M"),
            "end": s.end.strftime("%H:%M"),
            "capacity": s.capacity,
            "booked": s.booked,
            "isActive": s.is_active,
        }
        for s in rows
    ]


@router.post("/slots/generate")
def generate(payload: SlotGenerateIn, db: Session = Depends(get_db)):
    try:
        start_date = datetime.strptime(payload.date_from, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=422, detail="Неверная дата (YYYY-MM-DD)")
    windows = [_parse_window(w) for w in payload.windows]
    created = crud.generate_slots(
        db, start_date, payload.days, windows, payload.capacity
    )
    return {"created": created}


@router.patch("/slots/{slot_id}")
def toggle_slot(slot_id: int, is_active: bool, db: Session = Depends(get_db)):
    slot = db.get(DeliverySlot, slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Слот не найден")
    slot.is_active = is_active
    db.commit()
    return {"id": slot.id, "isActive": slot.is_active}
