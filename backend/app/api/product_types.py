from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import ProductType
from pydantic import BaseModel

router = APIRouter(prefix="/product-types", tags=["Product Types"])

class ProductTypeResponse(BaseModel):
    id: int
    name: str
    description: str
    
    class Config:
        orm_mode = True

@router.get("/", response_model=list[ProductTypeResponse])
def get_product_types(db: Session = Depends(get_db)):
    return db.query(ProductType).all()

@router.get("/{type_id}", response_model=ProductTypeResponse)
def get_product_type(type_id: int, db: Session = Depends(get_db)):
    product_type = db.query(ProductType).filter(ProductType.id == type_id).first()
    if not product_type:
        raise HTTPException(status_code=404, detail="Product type not found")
    return product_type
