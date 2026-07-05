def test_categories_with_counts(client):
    cats = client.get("/api/categories").json()
    ids = {c["id"]: c["count"] for c in cats}
    assert ids["all"] == 2
    assert ids["bone"] == 2


def test_products_list_and_camelcase(client):
    prods = client.get("/api/products").json()
    assert len(prods) == 2
    p = prods[0]
    assert "categoryId" in p and "inStock" in p


def test_products_search(client):
    res = client.get("/api/products", params={"q": "говяж"}).json()
    assert len(res) == 1 and res[0]["slug"] == "beef"


def test_product_by_slug_and_404(client):
    assert client.get("/api/products/beef").json()["name"] == "Говяжий"
    assert client.get("/api/products/nope").status_code == 404
