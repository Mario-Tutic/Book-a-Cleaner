from fastapi import FastAPI
from sqlmodel import SQLModel
from db.session import engine
from api import auth, properties
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Book a Cleaner API")
# Mount the uploads folder to make it accessible via /uploads
app.mount("/uploads", StaticFiles(directory="api/uploads"), name="uploads")

origins = [
    "http://localhost:5173",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # which domains are allowed
    allow_credentials=True,   # allow cookies/auth headers
    allow_methods=["*"],      # allow all HTTP methods (GET, POST...)
    allow_headers=["*"],      # allow all headers (like Content-Type)
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Include auth routes
app.include_router(auth.router)
app.include_router(properties.router)