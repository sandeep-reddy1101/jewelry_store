from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    phone_number: str
    email: EmailStr
    address: Optional[str]
    is_active: Optional[bool] = True
    is_staff: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
