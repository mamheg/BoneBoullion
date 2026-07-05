import os
import secrets

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.deps import get_db, require_admin
from app.models import Category, Product, ProductImage
from app.schemas import CategoryIn, ProductIn

router = APIRouter(
    prefix="/api/admin", tags=["admin-catalog"], dependencies=[Depends(require_admin)]
)

_ALLOWED_IMAGE = {"image/jpeg", "image/png", "image/webp"}
_MAX_BYTES = 8 * 1024 * 1024


# ── Categories ─────────────────────────────────────────────────────────────
@router.post("/categories")
def create_category(payload: CategoryIn, db: Session = Depends(get_db)):
    if db.get(Category, payload.id):
        raise HTTPException(status_code=409, detail="Категория уже существует")
    cat = Category(id=payload.id, name=payload.name, sort_order=payload.sort_order)
    db.add(cat)
    db.commit()
    return {"id": cat.id}


@router.put("/categories/{cat_id}")
def update_category(cat_id: str, payload: CategoryIn, db: Session = Depends(get_db)):
    cat = db.get(Category, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    cat.name = payload.name
    cat.sort_order = payload.sort_order
    db.commit()
    return {"id": cat.id}


@router.delete("/categories/{cat_id}")
def delete_category(cat_id: str, db: Session = Depends(get_db)):
    cat = db.get(Category, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    if cat.products:
        raise HTTPException(status_code=409, detail="В категории есть товары")
    db.delete(cat)
    db.commit()
    return {"ok": True}


# ── Products ───────────────────────────────────────────────────────────────
def _apply_product(p: Product, payload: ProductIn) -> None:
    p.slug = payload.slug
    p.name = payload.name
    p.description = payload.description
    p.price = payload.price
    p.old_price = payload.old_price
    p.volume = payload.volume
    p.accent = payload.accent
    p.category_id = payload.category_id
    p.badges = payload.badges
    p.in_stock = payload.in_stock
    p.is_active = payload.is_active
    p.composition = payload.composition
    p.nutrition = payload.nutrition
    p.sort_order = payload.sort_order


@router.post("/products")
def create_product(payload: ProductIn, db: Session = Depends(get_db)):
    if not db.get(Category, payload.category_id):
        raise HTTPException(status_code=422, detail="Категория не найдена")
    if db.execute(select(Product).where(Product.slug == payload.slug)).scalar_one_or_none():
        raise HTTPException(status_code=409, detail="slug уже используется")
    p = Product()
    _apply_product(p, payload)
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": p.id}


@router.put("/products/{product_id}")
def update_product(product_id: int, payload: ProductIn, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Товар не найден")
    _apply_product(p, payload)
    db.commit()
    return {"id": p.id}


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Товар не найден")
    db.delete(p)
    db.commit()
    return {"ok": True}


# ── Product photos ─────────────────────────────────────────────────────────
@router.post("/products/{product_id}/images")
async def upload_image(
    product_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="Товар не найден")
    if file.content_type not in _ALLOWED_IMAGE:
        raise HTTPException(status_code=422, detail="Только JPEG/PNG/WEBP")
    data = await file.read()
    if len(data) > _MAX_BYTES:
        raise HTTPException(status_code=422, detail="Файл слишком большой (макс 8 МБ)")

    ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}[
        file.content_type
    ]
    media_dir = get_settings().media_dir
    products_dir = os.path.join(media_dir, "products")
    os.makedirs(products_dir, exist_ok=True)
    fname = f"{secrets.token_hex(8)}.{ext}"
    with open(os.path.join(products_dir, fname), "wb") as fh:
        fh.write(data)

    url = f"/media/products/{fname}"
    next_order = len(p.images)
    img = ProductImage(product_id=p.id, url=url, sort_order=next_order)
    db.add(img)
    if not p.image:  # first photo becomes primary
        p.image = url
    db.commit()
    db.refresh(img)
    return {"id": img.id, "url": url}


@router.delete("/products/{product_id}/images/{image_id}")
def delete_image(product_id: int, image_id: int, db: Session = Depends(get_db)):
    img = db.get(ProductImage, image_id)
    if not img or img.product_id != product_id:
        raise HTTPException(status_code=404, detail="Фото не найдено")
    db.delete(img)
    db.commit()
    return {"ok": True}
