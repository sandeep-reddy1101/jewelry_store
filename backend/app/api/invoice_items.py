from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import InvoiceItem
from app.schemas.invoice_item import InvoiceItemCreate, InvoiceItemResponse

router = APIRouter(prefix="/invoice-items", tags=["Invoice Items"])

@router.post("/", response_model=InvoiceItemResponse)
def create_invoice_item(item: InvoiceItemCreate, db: Session = Depends(get_db)):
    db_item = InvoiceItem(
        invoice_id=item.invoice_id,
        product_id=item.product_id,
        quantity=item.quantity,
        unit_price=item.unit_price,
        discount=item.discount,
        total_price=item.total_price
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=list[InvoiceItemResponse])
def get_invoice_items(db: Session = Depends(get_db)):
    return db.query(InvoiceItem).all()

@router.get("/{item_id}", response_model=InvoiceItemResponse)
def get_invoice_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InvoiceItem).filter(InvoiceItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Invoice item not found")
    return item

@router.put("/{item_id}", response_model=InvoiceItemResponse)
def update_invoice_item(item_id: int, item: InvoiceItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(InvoiceItem).filter(InvoiceItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Invoice item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=204)
def delete_invoice_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(InvoiceItem).filter(InvoiceItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Invoice item not found")
    db.delete(db_item)
    db.commit()
    return None
