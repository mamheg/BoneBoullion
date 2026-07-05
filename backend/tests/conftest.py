import datetime as dt

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.deps import get_db
from app.main import app
from app.models import AdminUser, Category, DeliverySlot, Product
from app.security import hash_password

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture(autouse=True)
def _db():
    Base.metadata.create_all(engine)
    db = TestSession()
    # seed minimal fixtures
    db.add(Category(id="bone", name="Костные бульоны", sort_order=1))
    db.add(Product(id=1, slug="beef", name="Говяжий", price=750, volume="480 мл",
                   category_id="bone", badges=[], in_stock=True, is_active=True))
    db.add(Product(id=2, slug="chicken", name="Куриный", price=690, volume="480 мл",
                   category_id="bone", badges=["hit"], in_stock=True, is_active=True))
    db.add(DeliverySlot(id=1, date=dt.date.today() + dt.timedelta(days=1),
                        start=dt.time(10, 0), end=dt.time(13, 0), capacity=1, booked=0))
    h, salt = hash_password("secret123")
    db.add(AdminUser(id=1, username="admin", password_hash=h, password_salt=salt))
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(engine)


@pytest.fixture
def client():
    def override():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token(client):
    r = client.post("/api/admin/login", json={"username": "admin", "password": "secret123"})
    assert r.status_code == 200
    return r.json()["token"]
