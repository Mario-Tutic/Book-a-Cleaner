from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from passlib.hash import bcrypt
from db.models import User
from db.session import get_session
from pydantic import BaseModel




from utils.security import (
    create_access_token,
    pwd_context,
    get_current_user,
    create_refresh_token
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

'''
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

'''
#CODE UNDER IS /LOGIN ROUTE BUT WHICH RETURNS REFRESH TOKEN
from fastapi import Response
from datetime import timedelta

# Adjust your expiration times
ACCESS_TOKEN_EXPIRE_MINUTES = 1
REFRESH_TOKEN_EXPIRE_DAYS = 7

@router.post("/login")
def login(
    response: Response,                       # <-- add this to set cookie
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    email = form_data.username
    password = form_data.password

    user = session.exec(
        select(User).where(User.email == email)
    ).first()

    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 1️⃣ Create access token (short-lived)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    # 2️⃣ Create refresh token (long-lived)
    refresh_token = create_refresh_token(
        data={
            "sub": str(user.id)
        },
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    # 3️⃣ Set refresh token as HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,           # only send over HTTPS in production
        samesite="lax",        # adjust if frontend is on a different domain
        path="/auth/refresh"   # cookie sent only to refresh route
    )

    # 4️⃣ Return access token in body
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def read_me(current_user=Depends(get_current_user)):
    return current_user



from fastapi import APIRouter, Request, Response, HTTPException, Depends
from jose import jwt, JWTError
from datetime import timedelta

'''
IMPORTANT NOTES, EXTRACT FUNCTIONS USING SECRET_KEY AND ALGORITHM SOMEWHERE IN UTILITY, SEPARATION IF TASK

WHEN FRONTEND ACCESSES ROUTE WHICH IS PROTECTED IF IT GETS UNAUTHORIZES CODE 401 THEN IT CALLS REFRESH TOKEN
'''

SECRET_KEY = "CHANGE_THIS_IN_PROD"
ALGORITHM = "HS256"


@router.post("/refresh")
def refresh_token(
    request: Request,
    response: Response,
    session: Session = Depends(get_session)
):
    # 1️⃣ Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        # 2️⃣ Decode refresh token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # 3️⃣ Get the user from DB
    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # 4️⃣ Create new access token
    new_access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )

    # 5️⃣ Optionally rotate refresh token
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/auth/refresh"
    )

    # 6️⃣ Return new access token
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }