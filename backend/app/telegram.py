import logging

import httpx
from sqlalchemy.orm import Session

from app.config import get_settings
from app.crud import get_setting
from app.models import Order

log = logging.getLogger("telegram")

_STATUS_RU = {
    "new": "🆕 Новый",
    "preparing": "👨‍🍳 Готовится",
    "ready": "✅ Готов",
    "delivered": "📦 Выдан",
    "cancelled": "❌ Отменён",
}


def format_order(order: Order) -> str:
    lines = [f"🧾 <b>Новый заказ {order.id}</b>", ""]
    for it in order.items:
        lines.append(f"• {it.title} × {it.quantity} — {it.price * it.quantity} ₽")
    lines.append("")
    lines.append(f"Товары: {order.items_total} ₽")
    lines.append(
        f"Доставка: {'бесплатно' if order.delivery_cost == 0 else str(order.delivery_cost) + ' ₽'}"
    )
    lines.append(f"<b>Итого: {order.total} ₽</b>")
    lines.append("")
    lines.append(f"👤 {order.customer_name}")
    lines.append(f"📞 {order.phone}")
    if order.email:
        lines.append(f"✉️ {order.email}")
    method = "Курьер" if order.delivery_method == "courier" else "Самовывоз"
    lines.append(f"🚚 {method}")
    if order.address:
        lines.append(f"📍 {order.address}")
    if order.slot:
        lines.append(
            f"🕒 {order.slot.date.isoformat()} "
            f"{order.slot.start.strftime('%H:%M')}–{order.slot.end.strftime('%H:%M')}"
        )
    if order.comment:
        lines.append(f"💬 {order.comment}")
    return "\n".join(lines)


def send_order_notification(db: Session, order: Order) -> None:
    """Best-effort: never raise. Sets order.tg_delivered on success."""
    settings = get_settings()
    token = settings.bot_token.strip()
    chat_id = (get_setting(db, "telegram_chat_id") or settings.telegram_chat_id).strip()
    if not token or not chat_id:
        log.warning("Telegram not configured — order %s not sent", order.id)
        return
    try:
        resp = httpx.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": chat_id,
                "text": format_order(order),
                "parse_mode": "HTML",
            },
            timeout=10.0,
        )
        resp.raise_for_status()
        message_id = resp.json().get("result", {}).get("message_id")
        order.tg_delivered = True
        order.tg_message_id = message_id
        db.commit()
    except Exception as exc:  # noqa: BLE001 — best-effort notification
        log.error("Telegram send failed for order %s: %s", order.id, exc)
        order.tg_delivered = False
        db.commit()
