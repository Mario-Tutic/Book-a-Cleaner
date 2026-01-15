from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  # e.g., postgresql://postgres:password@localhost:5432/book_a_cleaner

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)

# Session generator
def get_session():
    with Session(engine) as session:
        yield session