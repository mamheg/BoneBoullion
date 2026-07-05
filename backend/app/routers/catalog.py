from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.deps import get_db
from app.schemas import CategoryOut, ProductOut

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def categories(db: Session = Depends(get_db)):
    return crud.list_categories(db)


@router.get("/products", response_model=list[ProductOut])
def products(
    category: str | None = None, q: str | None = None, db: Session = Depends(get_db)
):
    return crud.list_products(db, category, q)


@router.get("/products/{slug}", response_model=ProductOut)
def product(slug: str, db: Session = Depends(get_db)):
    p = crud.get_product_by_slug(db, slug)
    if p is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return p
