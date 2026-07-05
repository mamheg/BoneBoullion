from datetime import date, datetime, time

from fastapi import HTTPException
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app import models
from app.schemas import CategoryOut, OrderCreate, ProductOut, SlotOut
from app.security import new_order_id

# ── Settings ───────────────────────────────────────────────────────────────
DEFAULT_SETTINGS = {
    "free_delivery_threshold": "3000",
    "delivery_cost": "300",
}


def get_setting(db: Session, key: str, default: str = "") -> str:
    row = db.get(models.Setting, key)
    return row.value if row else default


def get_int_setting(db: Session, key: str, default: int) -> int:
    try:
        return int(get_setting(db, key, str(default)))
    except (TypeError, ValueError):
        return default


def set_setting(db: Session, key: str, value: str) -> None:
    row = db.get(models.Setting, key)
    if row:
        row.value = value
    else:
        db.add(models.Setting(key=key, value=value))


# ── Serializers (ORM → public camelCase schema) ────────────────────────────
def serialize_product(p: models.Product) -> ProductOut:
    images = [img.url for img in p.images] or ([p.image] if p.image else [])
    return ProductOut(
        id=str(p.id),
        slug=p.slug,
        name=p.name,
        description=p.description or "",
        price=p.price,
        old_price=p.old_price,
        volume=p.volume or "",
        image=p.image or (images[0] if images else ""),
        images=images,
        accent=p.accent,
        category_id=p.category_id,
        badges=list(p.badges or []),
        in_stock=p.in_stock,
        composition=p.composition,
        nutrition=p.nutrition,
    )


def list_categories(db: Session) -> list[CategoryOut]:
    counts = dict(
        db.execute(
            select(models.Product.category_id, func.count(models.Product.id))
            .where(models.Product.is_active.is_(True))
            .group_by(models.Product.category_id)
        ).all()
    )
    cats = db.execute(
        select(models.Category).order_by(models.Category.sort_order)
    ).scalars().all()
    total = sum(counts.values())
    out = [CategoryOut(id="all", name="Весь ассортимент", count=total)]
    out += [CategoryOut(id=c.id, name=c.name, count=counts.get(c.id, 0)) for c in cats]
    return out


def list_products(db: Session, category: str | None, q: str | None) -> list[ProductOut]:
    stmt = select(models.Product).where(models.Product.is_active.is_(True))
    if category and category != "all":
        stmt = stmt.where(models.Product.category_id == category)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(
            func.lower(models.Product.name).like(like)
            | func.lower(models.Product.description).like(like)
        )
    stmt = stmt.order_by(models.Product.sort_order, models.Product.id)
    return [serialize_product(p) for p in db.execute(stmt).scalars().all()]


def get_product_by_slug(db: Session, slug: str) -> ProductOut | None:
    p = db.execute(
        select(models.Product).where(models.Product.slug == slug)
    ).scalar_one_or_none()
    return serialize_product(p) if p and p.is_active else None


# ── Delivery slots ─────────────────────────────────────────────────────────
def available_slots(db: Session) -> list[SlotOut]:
    today = date.today()
    rows = db.execute(
        select(models.DeliverySlot)
        .where(
            models.DeliverySlot.is_active.is_(True),
            models.DeliverySlot.date >= today,
            models.DeliverySlot.booked < models.DeliverySlot.capacity,
        )
        .order_by(models.DeliverySlot.date, models.DeliverySlot.start)
    ).scalars().all()
    return [
        SlotOut(
            id=s.id,
            date=s.date.isoformat(),
            start=s.start.strftime("%H:%M"),
            end=s.end.strftime("%H:%M"),
            available=s.capacity - s.booked,
        )
        for s in rows
    ]


def _book_slot(db: Session, slot_id: int) -> None:
    """Atomically reserve one unit of a slot; raise 409 if full/inactive."""
    result = db.execute(
        update(models.DeliverySlot)
        .where(
            models.DeliverySlot.id == slot_id,
            models.DeliverySlot.is_active.is_(True),
            models.DeliverySlot.booked < models.DeliverySlot.capacity,
        )
        .values(booked=models.DeliverySlot.booked + 1)
    )
    if result.rowcount != 1:
        raise HTTPException(status_code=409, detail="Слот недоступен или уже занят")


# ── Order creation (server recomputes totals) ──────────────────────────────
def create_order(db: Session, payload: OrderCreate) -> models.Order:
    if payload.delivery.method == "courier" and not (payload.delivery.address or "").strip():
        raise HTTPException(status_code=422, detail="Укажите адрес доставки")

    items: list[models.OrderItem] = []
    items_total = 0
    for line in payload.items:
        try:
            pid = int(line.product_id)
        except (TypeError, ValueError):
            raise HTTPException(status_code=422, detail="Некорректный товар")
        product = db.get(models.Product, pid)
        if product is None or not product.is_active:
            raise HTTPException(status_code=422, detail=f"Товар недоступен: {line.product_id}")
        items_total += product.price * line.quantity
        items.append(
            models.OrderItem(
                product_id=product.id,
                title=product.name,
                price=product.price,
                quantity=line.quantity,
            )
        )

    # Delivery cost from settings (pickup is always free)
    if payload.delivery.method == "pickup":
        delivery_cost = 0
    else:
        threshold = get_int_setting(db, "free_delivery_threshold", 3000)
        base = get_int_setting(db, "delivery_cost", 300)
        delivery_cost = 0 if items_total >= threshold else base

    # Reserve slot (atomic) before persisting the order
    if payload.delivery.slot_id is not None:
        _book_slot(db, payload.delivery.slot_id)

    # Unique order id
    order_id = new_order_id()
    while db.get(models.Order, order_id) is not None:
        order_id = new_order_id()

    order = models.Order(
        id=order_id,
        customer_name=payload.customer.name,
        phone=payload.customer.phone,
        email=payload.customer.email,
        delivery_method=payload.delivery.method,
        address=payload.delivery.address,
        comment=payload.delivery.comment,
        slot_id=payload.delivery.slot_id,
        items_total=items_total,
        delivery_cost=delivery_cost,
        total=items_total + delivery_cost,
        items=items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def generate_slots(
    db: Session, date_from: date, days: int, windows: list[tuple[time, time]], capacity: int
) -> int:
    from datetime import timedelta

    created = 0
    for d in range(days):
        day = date_from + timedelta(days=d)
        for start, end in windows:
            exists = db.execute(
                select(models.DeliverySlot).where(
                    models.DeliverySlot.date == day,
                    models.DeliverySlot.start == start,
                    models.DeliverySlot.end == end,
                )
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(
                models.DeliverySlot(
                    date=day, start=start, end=end, capacity=capacity, booked=0
                )
            )
            created += 1
    db.commit()
    return created
