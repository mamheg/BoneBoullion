from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.deps import get_db, require_admin
from app.models import Order
from app.schemas import OrderStatusIn

router = APIRouter(
    prefix="/api/admin", tags=["admin-orders"], dependencies=[Depends(require_admin)]
)

_VALID_STATUS = {"new", "preparing", "ready", "delivered", "cancelled"}


def _serialize(order: Order, full: bool = False) -> dict:
    data = {
        "id": order.id,
        "customerName": order.customer_name,
        "phone": order.phone,
        "total": order.total,
        "status": order.status,
        "paymentStatus": order.payment_status,
        "deliveryMethod": order.delivery_method,
        "tgDelivered": order.tg_delivered,
        "createdAt": order.created_at.isoformat() if order.created_at else None,
    }
    if full:
        data.update(
            {
                "email": order.email,
                "address": order.address,
                "comment": order.comment,
                "itemsTotal": order.items_total,
                "deliveryCost": order.delivery_cost,
                "slot": (
                    {
                        "date": order.slot.date.isoformat(),
                        "start": order.slot.start.strftime("%H:%M"),
                        "end": order.slot.end.strftime("%H:%M"),
                    }
                    if order.slot
                    else None
                ),
                "items": [
                    {"title": i.title, "price": i.price, "quantity": i.quantity}
                    for i in order.items
                ],
            }
        )
    return data


@router.get("/orders")
def list_orders(status: str | None = None, db: Session = Depends(get_db)):
    stmt = select(Order).order_by(Order.created_at.desc())
    if status:
        stmt = stmt.where(Order.status == status)
    return [_serialize(o) for o in db.execute(stmt).scalars().all()]


@router.get("/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return _serialize(order, full=True)


@router.patch("/orders/{order_id}/status")
def set_status(order_id: str, payload: OrderStatusIn, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    if payload.status not in _VALID_STATUS:
        raise HTTPException(status_code=422, detail="Недопустимый статус")
    order.status = payload.status
    db.commit()
    return {"id": order.id, "status": order.status}
