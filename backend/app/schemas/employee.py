from pydantic import BaseModel
from datetime import date
from typing import Optional

class EmployeeBase(BaseModel):
    user_id: int
    employee_id: str
    department: Optional[str]
    position: Optional[str]
    salary: Optional[float]
    join_date: date

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        orm_mode = True
