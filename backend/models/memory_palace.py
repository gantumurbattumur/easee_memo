from sqlalchemy import Column, Integer, String, JSON
from database import Base   

class MemoryPalace(Base):
    __tablename__ = "memory_palaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    spots = Column(JSON)  # stores list of rooms or images, flexible for MVP
    user_id = Column(String, index=True)  # foreign key to users table