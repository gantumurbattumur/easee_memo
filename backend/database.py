from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# CRITICAL: Reduce pool size for Supabase free tier
engine = create_engine(
    DATABASE_URL,
    pool_size=1,              # Reduced from 5 to 2
    max_overflow=1,           # Reduced from 10 to 0
    pool_pre_ping=True,       # Keep this
    pool_recycle=60,         # Add: recycle connections every 5 minutes
    pool_timeout=10,          # Add: timeout for getting connections
    echo=False,                # Keep this
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI - Keep this here!
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()