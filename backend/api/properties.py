from fastapi import APIRouter, Depends, HTTPException, status,UploadFile, File
from api.schemas.property import PropertyCreate
from db.models import Property
from db.session import get_session
from sqlmodel import Session
from api.storage import save_image
import json
from utils.security import (
    create_access_token,
    pwd_context,
    get_current_user,
    create_refresh_token
)
from fastapi import Form

router = APIRouter(prefix="/property", tags=["property"])

# Temporary storage
properties = []

@router.post("/create")
async def add_property(
    property_data: str=Form(...),
    #property_id: int,
    files: list[UploadFile] = File(...),
    session: Session = Depends(get_session),
    current_user = Depends(get_current_user)
    ):

    try:
        property_dict = json.loads(property_data)
        property_create_obj = PropertyCreate(
            **property_dict
            )
    except Exception:
        raise HTTPException(400, "Invalid property data")

    
    new_property = Property(
        **property_create_obj.dict(),
        owner_id=current_user.get("sub")   #ID from JWT
    )
    urls=[]
    # Validate file type
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
            #code under will not be executed but anyways this if statement should be handled on frontend I guess
            #And partially here
            raise HTTPException(status_code=400, detail="File must be an image.")
        urls.append(save_image(file))
    # Attach Image URLs to property
    new_property.images_paths = urls
    # Add to database
    session.add(new_property)
    session.commit()
    session.refresh(new_property)  # fetch generated ID
    
    return {"message": "Property added successfully", "property": new_property}



@router.post("/{property_id}/upload-image")
async def upload_property_image(property_id: int, files: list[UploadFile] = File(...)):
    urls=[]
    # Validate file type
    for file in files:
        if not file.content_type.startswith("image/"):
            continue
            #code under will not be executed but anyways this if statement should be handled on frontend I guess
            #And partially here
            raise HTTPException(status_code=400, detail="File must be an image.")
        urls.append(save_image(file))



    # Here you would also save the image_url in your database linked to property_id
    # e.g., update_property_image(property_id, image_url)

    return {"property_id": property_id, "image_urls": urls}