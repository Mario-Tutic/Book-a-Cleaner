from fastapi import APIRouter, Depends, HTTPException, status
from api.schemas.property import PropertyCreate
from db.models import Property
from db.session import get_session
from sqlmodel import Session
from utils.security import (
    create_access_token,
    pwd_context,
    get_current_user,
    create_refresh_token
)

router = APIRouter(prefix="/property", tags=["property"])

# Temporary storage
properties = []

@router.post("/create")
async def add_property(
    property_data: PropertyCreate,
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
    ):
    new_property = Property(
        **property_data.dict(),
        owner_id=current_user.get("sub")   #ID from JWT
    )
    
    # Add to database
    session.add(new_property)
    session.commit()
    session.refresh(new_property)  # fetch generated ID
    
    return {"message": "Property added successfully", "property": new_property}