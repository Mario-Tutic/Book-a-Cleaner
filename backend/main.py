from fastapi import FastAPI
from sqlmodel import SQLModel
from db.session import engine
from api import auth

app = FastAPI(title="Book a Cleaner API")

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Include auth routes
app.include_router(auth.router)