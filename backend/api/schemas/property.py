from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PropertyCreate(BaseModel):

    name: str
    address: str
    city: str
    zip: str
    property_type: str
    size: int
    notes: Optional[str] = None
