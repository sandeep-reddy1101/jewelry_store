from pydantic import BaseModel

class VendorBase(BaseModel):
    name: str
    contact_number: str
    email: str
    address: str
    gst_number: str

class VendorCreate(VendorBase):
    pass

class VendorResponse(VendorBase):
    id: int

    class Config:
        orm_mode = True
