from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from database import get_db
from models.memory_palace import MemoryPalace
from schemas.palace_schema import MemoryPalace as PalaceSchema
import json
from typing import Optional

router = APIRouter(prefix="/palace", tags=["Palace"])

# 🟢 List palaces for a specific user
@router.get("/list", response_model=list[PalaceSchema])
def list_palaces(user_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Fetch all palaces (optionally filtered by user)."""
    query = db.query(MemoryPalace)
    if user_id:
        query = query.filter(MemoryPalace.user_id == user_id)

    palaces = query.all()
    result = []
    for p in palaces:
        if isinstance(p.spots, str):
            try:
                p.spots = json.loads(p.spots)
            except json.JSONDecodeError:
                p.spots = []
        result.append(p)
    return result

# 🟢 Upload new palace
@router.post("/upload", response_model=PalaceSchema)
async def upload_memory_palace(
    request: Request,
    user_id: str = Query(...),
    db: Session = Depends(get_db),
):
    data = await request.json()
    nickname = data.get("nickname")
    spots = data.get("spots") or data.get("places", [])

    if not nickname:
        raise HTTPException(status_code=400, detail="Missing nickname")

    if isinstance(spots, list):
        spots_json = json.dumps(spots)
    else:
        spots_json = spots

    new_palace = MemoryPalace(
        name=nickname,
        description=f"Palace created by {nickname}",
        spots=spots_json,
        user_id=user_id,  # ✅ link to this user's anonymous ID
    )

    db.add(new_palace)
    db.commit()
    db.refresh(new_palace)

    try:
        new_palace.spots = json.loads(new_palace.spots)
    except Exception:
        pass

    return new_palace


# ✏️ Update existing palace
@router.put("/update/{palace_id}", response_model=PalaceSchema)
async def update_memory_palace(
    palace_id: int,
    request: Request,
    user_id: str = Query(...),
    db: Session = Depends(get_db),
):
    data = await request.json()
    palace = (
        db.query(MemoryPalace)
        .filter(MemoryPalace.id == palace_id, MemoryPalace.user_id == user_id)
        .first()
    )
    if not palace:
        raise HTTPException(status_code=404, detail="Palace not found")

    nickname = data.get("nickname", palace.name)
    spots = data.get("spots", None)

    palace.name = nickname
    if spots is not None:
        palace.spots = json.dumps(spots) if isinstance(spots, list) else spots

    db.commit()
    db.refresh(palace)

    try:
        palace.spots = json.loads(palace.spots)
    except Exception:
        pass

    return palace


# ❌ Delete a palace
@router.delete("/delete/{palace_id}")
def delete_memory_palace(
    palace_id: int, user_id: str = Query(...), db: Session = Depends(get_db)
):
    palace = (
        db.query(MemoryPalace)
        .filter(MemoryPalace.id == palace_id, MemoryPalace.user_id == user_id)
        .first()
    )
    if not palace:
        raise HTTPException(status_code=404, detail="Palace not found")

    db.delete(palace)
    db.commit()
    return {"detail": f"Palace '{palace.name}' deleted successfully"}
