from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database.database import get_db
from app.models.models import Invoice, Product, Vendor

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/sales")
def get_sales_report(db: Session = Depends(get_db)):
    sales = db.query(
        func.date(Invoice.created_at).label("date"),
        func.sum(Invoice.final_amount).label("total_sales")
    ).group_by(func.date(Invoice.created_at)).all()
    return {"sales_report": sales}

@router.get("/inventory")
def get_inventory_report(db: Session = Depends(get_db)):
    inventory = db.query(
        Product.name,
        Product.quantity,
        Product.min_stock_level
    ).all()
    return {"inventory_report": inventory}

@router.get("/vendors")
def get_vendor_performance_report(db: Session = Depends(get_db)):
    vendor_performance = db.query(
        Vendor.name,
        func.count(Invoice.id).label("total_invoices"),
        func.sum(Invoice.final_amount).label("total_sales")
    ).join(Product, Product.vendor_id == Vendor.id) \
     .join(Invoice, Invoice.id == Product.id) \
     .group_by(Vendor.name).all()
    return {"vendor_performance_report": vendor_performance}
