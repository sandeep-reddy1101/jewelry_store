from pydantic import BaseModel
from typing import Optional

class InvoiceBase(BaseModel):
    user_id: int
    invoice_number: str
    total_amount: float
    discount: Optional[float]
    tax: Optional[float]
    final_amount: float
    payment_status: str
    payment_method: str

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int

    class Config:
        orm_mode = True
