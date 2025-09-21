from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str]
    barcode: str
    counter_no: Optional[str]
    vendor_id: int
    category_id: int
    type_id: int
    weight_unit_id: int
    purity: Optional[float]
    gross_weight: Optional[float]
    net_weight: Optional[float]
    beads_weight: Optional[float]
    cost_per_unit: Optional[float]
    making_charges: Optional[float]
    wastage_charges: Optional[float]
    beads_cost: Optional[float]
    gst_rate: Optional[float]
    total_cost: Optional[float]
    sale_price: Optional[float]
    discount_percentage: Optional[float]
    quantity: int
    min_stock_level: Optional[int]
    is_active: Optional[bool]

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        orm_mode = True
