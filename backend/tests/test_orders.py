def _order(items, method="courier", address="ул. Пушкина 1", slot_id=1):
    return {
        "customer": {"name": "Иван", "phone": "+79990001122"},
        "delivery": {"method": method, "address": address, "slotId": slot_id},
        "items": items,
    }


def test_order_total_computed_server_side(client):
    # client sends only productId+quantity; server prices from DB
    body = _order([{"productId": "1", "quantity": 2}])  # 750*2 = 1500
    r = client.post("/api/orders", json=body)
    assert r.status_code == 200
    assert r.json()["orderNumber"].startswith("BB-")
    # verify persisted totals via admin
    tok = client.post("/api/admin/login", json={"username": "admin", "password": "secret123"}).json()["token"]
    num = r.json()["orderNumber"]
    detail = client.get(f"/api/admin/orders/{num}", headers={"Authorization": f"Bearer {tok}"}).json()
    assert detail["itemsTotal"] == 1500
    assert detail["deliveryCost"] == 300  # below 3000 threshold
    assert detail["total"] == 1800


def test_pickup_is_free(client):
    body = _order([{"productId": "1", "quantity": 1}], method="pickup", address=None, slot_id=None)
    r = client.post("/api/orders", json=body)
    assert r.status_code == 200


def test_missing_product_rejected(client):
    r = client.post("/api/orders", json=_order([{"productId": "999", "quantity": 1}], slot_id=None))
    assert r.status_code == 422


def test_courier_without_address_rejected(client):
    r = client.post("/api/orders", json=_order([{"productId": "1", "quantity": 1}], address="", slot_id=None))
    assert r.status_code == 422


def test_slot_capacity_one_blocks_second(client):
    b1 = _order([{"productId": "1", "quantity": 1}], slot_id=1)
    b2 = _order([{"productId": "2", "quantity": 1}], slot_id=1)
    assert client.post("/api/orders", json=b1).status_code == 200
    # slot capacity is 1 → second order on same slot rejected
    assert client.post("/api/orders", json=b2).status_code == 409
