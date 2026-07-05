from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.deps import get_db
from app.schemas import OrderCreate, OrderResult
from app.telegram import send_order_notification

router = APIRouter(prefix="/api", tags=["orders"])


@router.post("/orders", response_model=OrderResult)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    order = crud.create_order(db, payload)
    # Best-effort notification — order is already persisted.
    send_order_notification(db, order)
    return OrderResult(
        order_number=order.id,
        message="Заявка принята! Менеджер свяжется с вами для подтверждения.",
    )
