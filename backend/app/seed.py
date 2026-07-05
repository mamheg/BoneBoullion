"""Seed the database with the initial catalog, admin user, settings and slots.

Idempotent: safe to run repeatedly. Mirrors the frontend `src/data/catalog.ts`
so the storefront keeps its catalog once it points at the API.
"""

from datetime import date, datetime, time, timedelta

from sqlalchemy import select

from app import crud
from app.config import get_settings
from app.database import SessionLocal
from app.models import AdminUser, Category, Product, ProductImage
from app.security import hash_password

_COMPOSITION = (
    "Фермерские кости, фильтрованная вода, морковь, лук, сельдерей, петрушка, "
    "лавровый лист, морская соль. Без добавок и консервантов."
)

CATEGORIES = [
    ("bone", "Костные бульоны", 1),
    ("soup", "Супы", 2),
    ("kids", "Бульон для детей", 3),
    ("set", "Наборы", 4),
]

# (slug, name, price, old_price, volume, image, accent, category, badges,
#  composition, nutrition)
PRODUCTS = [
    ("kurinyy-bulon", "Куриный бульон", 690, None, "480 мл", "", "#E9B84A", "bone",
     ["hit"], _COMPOSITION, {"calories": 38, "protein": 7.2, "fat": 0.9, "carbs": 0.4}),
    ("govyazhiy-bulon", "Говяжий бульон", 750, None, "480 мл",
     "/images/products/beef.jpg", "#B5602E", "bone", [], _COMPOSITION,
     {"calories": 44, "protein": 8.1, "fat": 1.4, "carbs": 0.3}),
    ("bulon-iz-indeyki", "Бульон из индейки", 720, None, "480 мл", "", "#E3C572",
     "bone", [], _COMPOSITION, {"calories": 36, "protein": 7.6, "fat": 0.7, "carbs": 0.3}),
    ("baraniy-bulon", "Бараний бульон", 790, None, "480 мл",
     "/images/products/lamb.jpg", "#A24E2A", "bone", [], _COMPOSITION,
     {"calories": 48, "protein": 7.9, "fat": 2.1, "carbs": 0.3}),
    ("rybnyy-bulon", "Рыбный бульон", 760, None, "480 мл", "", "#D9C9A3", "bone",
     ["new"], _COMPOSITION, {"calories": 33, "protein": 6.8, "fat": 0.6, "carbs": 0.2}),
    ("krem-sup-tykvennyy", "Крем-суп тыквенный", 540, None, "400 мл", "", "#E68A2E",
     "soup", [], "Куриный бульон, тыква, морковь, лук, сливки, мускатный орех, морская соль.",
     {"calories": 62, "protein": 2.1, "fat": 3.4, "carbs": 6.2}),
    ("kurinyy-sup-lapsha", "Куриный суп с лапшой", 560, None, "450 мл",
     "/images/products/chicken-noodle.jpg", "#E9B84A", "soup", ["hit"],
     "Куриный бульон, мясо курицы, лапша, морковь, лук, зелень, морская соль.",
     {"calories": 58, "protein": 4.2, "fat": 1.8, "carbs": 6.6}),
    ("gribnoy-krem-sup", "Грибной крем-суп", 580, None, "400 мл", "", "#9C8866",
     "soup", [], "Овощной бульон, белые грибы, шампиньоны, лук, сливки, тимьян, морская соль.",
     {"calories": 66, "protein": 2.8, "fat": 4.1, "carbs": 5.4}),
    ("detskiy-kurinyy-bulon", "Куриный бульон для детей", 690, None, "480 мл",
     "/images/products/kids-chicken.jpg", "#F0D58A", "kids", ["new"],
     "Фермерская курица, фильтрованная вода, морковь, кабачок. Без соли, без специй, без добавок.",
     {"calories": 32, "protein": 6.4, "fat": 0.6, "carbs": 0.4}),
    ("detskiy-bulon-indeyka", "Бульон из индейки для детей", 690, None, "480 мл",
     "/images/products/kids-turkey.jpg", "#EBD79A", "kids", [],
     "Фермерская индейка, фильтрованная вода, морковь, кабачок. Без соли, без специй, без добавок.",
     {"calories": 30, "protein": 6.6, "fat": 0.5, "carbs": 0.3}),
    ("nabor-bulonov", "Набор бульонов «Классика»", 1990, 2160, "3 × 480 мл",
     "/images/products/set-classic.jpg", "#E69E26", "set", ["sale"],
     "Куриный, говяжий и бульон из индейки. Без добавок и консервантов.", None),
    ("nabor-wellness", "Набор «Wellness»", 3490, 3800, "6 × 480 мл",
     "/images/products/set-wellness.jpg", "#C4831C", "set", ["sale"],
     "Ассорти бульонов и крем-супов. Без добавок и консервантов.", None),
]


def seed() -> None:
    db = SessionLocal()
    try:
        # Categories
        for cid, name, order in CATEGORIES:
            if not db.get(Category, cid):
                db.add(Category(id=cid, name=name, sort_order=order))
        db.commit()

        # Products (upsert by slug)
        for idx, (slug, name, price, old, volume, image, accent, cat, badges, comp, nutr) in enumerate(PRODUCTS):
            p = db.execute(select(Product).where(Product.slug == slug)).scalar_one_or_none()
            if p is None:
                p = Product(slug=slug)
                db.add(p)
            p.name, p.price, p.old_price, p.volume = name, price, old, volume
            p.image, p.accent, p.category_id = image, accent, cat
            p.badges, p.composition, p.nutrition = badges, comp, nutr
            p.in_stock, p.is_active, p.sort_order = True, True, idx
            db.flush()
            if image and not p.images:
                db.add(ProductImage(product_id=p.id, url=image, sort_order=0))
        db.commit()

        # Settings
        for key, val in crud.DEFAULT_SETTINGS.items():
            if not crud.get_setting(db, key):
                crud.set_setting(db, key, val)
        cfg = get_settings()
        if cfg.telegram_chat_id and not crud.get_setting(db, "telegram_chat_id"):
            crud.set_setting(db, "telegram_chat_id", cfg.telegram_chat_id)
        db.commit()

        # Admin from env
        if not db.execute(
            select(AdminUser).where(AdminUser.username == cfg.admin_username)
        ).scalar_one_or_none():
            h, salt = hash_password(cfg.admin_password)
            db.add(AdminUser(username=cfg.admin_username, password_hash=h, password_salt=salt))
            db.commit()

        # Starter delivery slots: next 7 days, two windows, capacity 10
        windows = [(time(10, 0), time(13, 0)), (time(13, 0), time(16, 0))]
        crud.generate_slots(db, date.today() + timedelta(days=1), 7, windows, 10)

        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
