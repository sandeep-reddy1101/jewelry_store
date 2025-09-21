from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = Employee(
        user_id=employee.user_id,
        employee_id=employee.employee_id,
        department=employee.department,
        position=employee.position,
        salary=employee.salary,
        join_date=employee.join_date
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.get("/", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(db_employee, key, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return None
