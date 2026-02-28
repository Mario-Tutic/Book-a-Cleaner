import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "api/uploads"

def save_image(file: UploadFile) -> str:
    # Generate a unique filename to avoid conflicts
    ext = os.path.splitext(file.filename)[1]  # e.g., ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file locally
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Return accessible URL
    return f"api/uploads/{unique_filename}"
