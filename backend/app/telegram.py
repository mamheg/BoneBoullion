import logging

import httpx
from sqlalchemy.orm import Session

from app.config import get_settings
from app.crud import get_setting
from app.models import Order
from app.proxy import ProxyPool, parse_proxies

log = logging.getLogger("telegram")

# Cached pool keyed by the raw proxy string so the sticky (last-working) proxy
# survives across calls; rebuilt only when the configured list changes.
_pool_cache: tuple[str, ProxyPool] | None = None


def _get_pool(raw_proxies: str) -> ProxyPool:
    global _pool_cache
    if _pool_cache is None or _pool_cache[0] != raw_proxies:
        _pool_cache = (raw_proxies, ProxyPool(parse_proxies(raw_proxies)))
    return _pool_cache[1]

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
    """Best-effort: never raise. Routes through the proxy/VPN pool with
    sticky-on-success + rotate-on-failure. Sets order.tg_delivered on success."""
    settings = get_settings()
    token = settings.bot_token.strip()
    chat_id = (get_setting(db, "telegram_chat_id") or settings.telegram_chat_id).strip()
    if not token or not chat_id:
        log.warning("Telegram not configured — order %s not sent", order.id)
        return

    raw_proxies = get_setting(db, "telegram_proxies") or settings.telegram_proxies
    pool = _get_pool(raw_proxies)
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": format_order(order), "parse_mode": "HTML"}

    last_error: Exception | None = None
    for proxy in pool.attempts():
        try:
            with httpx.Client(proxy=proxy, timeout=10.0) as client:
                resp = client.post(url, json=payload)
            resp.raise_for_status()
            pool.mark_ok(proxy)  # correlate: stick to the working route
            order.tg_delivered = True
            order.tg_message_id = resp.json().get("result", {}).get("message_id")
            db.commit()
            return
        except Exception as exc:  # noqa: BLE001 — try next proxy
            last_error = exc
            log.warning(
                "Telegram send via %s failed for order %s: %s",
                proxy or "direct",
                order.id,
                exc,
            )

    log.error("Telegram delivery failed for order %s: %s", order.id, last_error)
    order.tg_delivered = False
    db.commit()
