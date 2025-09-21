from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User
from app.schemas.user import UserCreate, UserResponse
from passlib.context import CryptContext

router = APIRouter(prefix="/users", tags=["Users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        phone_number=user.phone_number,
        email=user.email,
        address=user.address,
        password_hash=hashed_password,
        is_active=user.is_active,
        is_staff=user.is_staff
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.dict().items():
        if key == "password":
            value = hash_password(value)
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return None
