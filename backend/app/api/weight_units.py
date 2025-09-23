from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import WeightUnit
from pydantic import BaseModel

router = APIRouter(prefix="/weight-units", tags=["Weight Units"])

class WeightUnitResponse(BaseModel):
    id: int
    name: str
    symbol: str
    
    class Config:
        orm_mode = True

@router.get("/", response_model=list[WeightUnitResponse])
def get_weight_units(db: Session = Depends(get_db)):
    return db.query(WeightUnit).all()

@router.get("/{unit_id}", response_model=WeightUnitResponse)
def get_weight_unit(unit_id: int, db: Session = Depends(get_db)):
    weight_unit = db.query(WeightUnit).filter(WeightUnit.id == unit_id).first()
    if not weight_unit:
        raise HTTPException(status_code=404, detail="Weight unit not found")
    return weight_unit
