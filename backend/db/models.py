from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, time

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    role: str  # "owner" or "cleaner"

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    property_address: str
    date: date
    time: time
    status: str = "pending"
    owner_id: int
    cleaner_id: Optional[int] = None