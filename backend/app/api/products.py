from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Product
from app.schemas.product import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(
        name=product.name,
        description=product.description,
        barcode=product.barcode,
        counter_no=product.counter_no,
        vendor_id=product.vendor_id,
        category_id=product.category_id,
        type_id=product.type_id,
        weight_unit_id=product.weight_unit_id,
        purity=product.purity,
        gross_weight=product.gross_weight,
        net_weight=product.net_weight,
        beads_weight=product.beads_weight,
        cost_per_unit=product.cost_per_unit,
        making_charges=product.making_charges,
        wastage_charges=product.wastage_charges,
        beads_cost=product.beads_cost,
        gst_rate=product.gst_rate,
        total_cost=product.total_cost,
        sale_price=product.sale_price,
        discount_percentage=product.discount_percentage,
        quantity=product.quantity,
        min_stock_level=product.min_stock_level,
        is_active=product.is_active
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None
