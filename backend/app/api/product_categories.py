from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import ProductCategory
from app.schemas.product_category import ProductCategoryCreate, ProductCategoryResponse

router = APIRouter(prefix="/categories", tags=["Product Categories"])

@router.post("/", response_model=ProductCategoryResponse)
def create_category(category: ProductCategoryCreate, db: Session = Depends(get_db)):
    db_category = ProductCategory(name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/", response_model=list[ProductCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(ProductCategory).all()

@router.get("/{category_id}", response_model=ProductCategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=ProductCategoryResponse)
def update_category(category_id: int, category: ProductCategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(ProductCategory).filter(ProductCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return None
