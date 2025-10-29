from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.memory_palace import MemoryPalace
from schemas.palace_schema import MemoryPalace as PalaceSchema
import json

router = APIRouter(prefix="/palace", tags=["Palace"])

# Get all palaces
@router.get("/list", response_model=list[PalaceSchema])
def list_palaces(db: Session = Depends(get_db)):
    palaces = db.query(MemoryPalace).all()
    result = []
    for p in palaces:
        # Convert stringified spots to Python list (if needed)
        if isinstance(p.spots, str):
            try:
                p.spots = json.loads(p.spots)
            except json.JSONDecodeError:
                p.spots = []
        result.append(p)
    return result


# Upload a new palace
@router.post("/upload", response_model=PalaceSchema)
async def upload_memory_palace(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    print("📥 Received data:", data)

    nickname = data.get("nickname")
    spots = data.get("spots") or data.get("places", [])

    if not nickname:
        raise HTTPException(status_code=400, detail="Missing nickname")

    # Convert Python list to JSON string if necessary
    if isinstance(spots, list):
        spots_json = json.dumps(spots)
    else:
        spots_json = spots

    new_palace = MemoryPalace(
        name=nickname,
        description=f"Palace created by {nickname}",
        spots=spots_json
    )

    db.add(new_palace)
    db.commit()
    db.refresh(new_palace)
    print("💾 Palace saved:", new_palace.name)

    # Return parsed spots
    try:
        new_palace.spots = json.loads(new_palace.spots)
    except Exception:
        pass

    return new_palace

# Update existing palace
@router.put("/update/{palace_id}", response_model=PalaceSchema)
async def update_memory_palace(palace_id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    print(f"✏️ Updating palace {palace_id} with data:", data)

    palace = db.query(MemoryPalace).filter(MemoryPalace.id == palace_id).first()
    if not palace:
        raise HTTPException(status_code=404, detail="Palace not found")

    nickname = data.get("nickname", palace.name)
    spots = data.get("spots", None)

    palace.name = nickname
    if spots is not None:
        if isinstance(spots, list):
            palace.spots = json.dumps(spots)
        else:
            palace.spots = spots

    db.commit()
    db.refresh(palace)

    # Return parsed version
    try:
        palace.spots = json.loads(palace.spots)
    except Exception:
        pass

    return palace


# Delete a palace
@router.delete("/delete/{palace_id}")
def delete_memory_palace(palace_id: int, db: Session = Depends(get_db)):
    palace = db.query(MemoryPalace).filter(MemoryPalace.id == palace_id).first()
    if not palace:
        raise HTTPException(status_code=404, detail="Palace not found")

    db.delete(palace)
    db.commit()
    return {"detail": f"Palace '{palace.name}' deleted successfully"}
