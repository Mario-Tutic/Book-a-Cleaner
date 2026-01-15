from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from passlib.hash import bcrypt
from db.models import User
from db.session import get_session
from pydantic import BaseModel




from utils.security import (
    create_access_token,
    pwd_context,
    get_current_user
)

from utils.security import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

# Request/response models
class UserCreate(BaseModel):
    email: str
    password: str
    role: str  # "owner" or "cleaner"

class UserRead(BaseModel):
    id: int
    email: str
    role: str

# Register endpoint
@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, password_hash=hashed_password, role=user.role)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Login endpoint
class UserLogin(BaseModel):
    email: str
    password: str

"""
#Old login route

@router.post("/login")
def login(email: str, password: str, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {"access_token": token, "token_type": "bearer"}
"""

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    email = form_data.username      # Swagger sends "username"
    password = form_data.password

    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def read_me(current_user=Depends(get_current_user)):
    return current_user