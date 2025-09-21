from pydantic import BaseModel
from typing import Optional

class InvoiceItemBase(BaseModel):
    invoice_id: int
    product_id: int
    quantity: int
    unit_price: float
    discount: Optional[float]
    total_price: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: int

    class Config:
        orm_mode = True
