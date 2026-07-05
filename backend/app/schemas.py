from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, from_attributes=True
    )


# ── Public: catalog ────────────────────────────────────────────────────────
class CategoryOut(CamelModel):
    id: str
    name: str
    count: int = 0


class ProductOut(CamelModel):
    id: str
    slug: str
    name: str
    description: str = ""
    price: int
    old_price: int | None = None
    volume: str = ""
    image: str = ""
    images: list[str] = Field(default_factory=list)
    accent: str | None = None
    category_id: str
    badges: list[str] = Field(default_factory=list)
    in_stock: bool = True
    composition: str | None = None
    nutrition: dict | None = None


# ── Public: delivery slots ─────────────────────────────────────────────────
class SlotOut(CamelModel):
    id: int
    date: str
    start: str
    end: str
    available: int


# ── Public: orders ─────────────────────────────────────────────────────────
class OrderItemIn(CamelModel):
    product_id: str
    quantity: int = Field(ge=1)


class CustomerIn(CamelModel):
    name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=5, max_length=32)
    email: str | None = None


class DeliveryIn(CamelModel):
    method: str = "courier"  # courier | pickup
    address: str | None = None
    comment: str | None = None
    slot_id: int | None = None


class OrderCreate(CamelModel):
    customer: CustomerIn
    delivery: DeliveryIn
    items: list[OrderItemIn] = Field(min_length=1)


class OrderResult(CamelModel):
    order_number: str
    message: str


# ── Admin: auth ────────────────────────────────────────────────────────────
class LoginIn(CamelModel):
    username: str
    password: str


class TokenOut(CamelModel):
    token: str
    expires_at: datetime


# ── Admin: catalog write ───────────────────────────────────────────────────
class CategoryIn(CamelModel):
    id: str
    name: str
    sort_order: int = 0


class ProductIn(CamelModel):
    slug: str
    name: str
    description: str = ""
    price: int
    old_price: int | None = None
    volume: str = ""
    accent: str | None = None
    category_id: str
    badges: list[str] = Field(default_factory=list)
    in_stock: bool = True
    is_active: bool = True
    composition: str | None = None
    nutrition: dict | None = None
    sort_order: int = 0


# ── Admin: orders / slots / settings ───────────────────────────────────────
class OrderStatusIn(CamelModel):
    status: str


class SlotGenerateIn(CamelModel):
    date_from: str
    days: int = Field(ge=1, le=60)
    windows: list[str]  # ["10:00-13:00", "13:00-16:00"]
    capacity: int = Field(ge=1, default=10)


class SettingIn(CamelModel):
    key: str
    value: str
