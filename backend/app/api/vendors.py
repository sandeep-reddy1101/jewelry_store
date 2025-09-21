from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Vendor
from app.schemas.vendor import VendorCreate, VendorResponse

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.post("/", response_model=VendorResponse)
def create_vendor(vendor: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = Vendor(name=vendor.name, contact_number=vendor.contact_number, email=vendor.email, address=vendor.address, gst_number=vendor.gst_number)
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.get("/", response_model=list[VendorResponse])
def get_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).all()

@router.get("/{vendor_id}", response_model=VendorResponse)
def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.put("/{vendor_id}", response_model=VendorResponse)
def update_vendor(vendor_id: int, vendor: VendorCreate, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    for key, value in vendor.dict().items():
        setattr(db_vendor, key, value)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.delete("/{vendor_id}", status_code=204)
def delete_vendor(vendor_id: int, db: Session = Depends(get_db)):
    db_vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(db_vendor)
    db.commit()
    return None
