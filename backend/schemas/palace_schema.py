from pydantic import BaseModel
from typing import List, Optional, Any

class MemoryPalaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    spots: Optional[List[Any]] = None

class MemoryPalaceCreate(MemoryPalaceBase):
    pass

class MemoryPalace(MemoryPalaceBase):
    id: int

    class Config:
        orm_mode = True
