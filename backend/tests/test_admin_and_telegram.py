import datetime as dt

from app.models import Order, OrderItem
from app.telegram import format_order, send_order_notification
from tests.conftest import TestSession


# ── Admin auth ─────────────────────────────────────────────────────────────
def test_login_bad_password(client):
    r = client.post("/api/admin/login", json={"username": "admin", "password": "wrong"})
    assert r.status_code == 401


def test_protected_requires_token(client):
    assert client.get("/api/admin/orders").status_code == 401
    assert client.get("/api/admin/me").status_code == 401


def test_login_and_access(client, admin_token):
    r = client.get("/api/admin/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200 and r.json()["username"] == "admin"


def test_logout_invalidates(client, admin_token):
    h = {"Authorization": f"Bearer {admin_token}"}
    assert client.post("/api/admin/logout", headers=h).status_code == 200
    assert client.get("/api/admin/me", headers=h).status_code == 401


def test_admin_product_crud(client, admin_token):
    h = {"Authorization": f"Bearer {admin_token}"}
    body = {"slug": "new", "name": "Новый", "price": 500, "categoryId": "bone"}
    r = client.post("/api/admin/products", json=body, headers=h)
    assert r.status_code == 200
    assert any(p["slug"] == "new" for p in client.get("/api/products").json())


# ── Telegram (fail-safe) ───────────────────────────────────────────────────
def test_format_order_contains_items():
    order = Order(id="BB-1", customer_name="Иван", phone="+700", delivery_method="courier",
                  items_total=1500, delivery_cost=300, total=1800)
    order.items = [OrderItem(title="Говяжий", price=750, quantity=2)]
    text = format_order(order)
    assert "BB-1" in text and "Говяжий" in text and "1800" in text


def test_send_notification_no_token_is_safe():
    # bot not configured → must not raise, order stays not-delivered
    db = TestSession()
    order = Order(id="BB-2", customer_name="Иван", phone="+700", delivery_method="pickup",
                  items_total=750, delivery_cost=0, total=750, tg_delivered=False)
    order.items = [OrderItem(title="Куриный", price=750, quantity=1)]
    db.add(order)
    db.commit()
    send_order_notification(db, order)  # should not raise
    assert order.tg_delivered is False
    db.close()
