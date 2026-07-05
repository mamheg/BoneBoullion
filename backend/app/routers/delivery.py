from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.deps import get_db
from app.schemas import SlotOut

router = APIRouter(prefix="/api/delivery", tags=["delivery"])


@router.get("/slots", response_model=list[SlotOut])
def slots(db: Session = Depends(get_db)):
    return crud.available_slots(db)
