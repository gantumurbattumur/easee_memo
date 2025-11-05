from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
from models.memory_palace import MemoryPalace
from schemas.palace_schema import MemoryPalace as PalaceSchema
import json
from typing import Optional

router = APIRouter(prefix="/palace", tags=["Palace"])

# List palaces for a specific user
@router.get("/list", response_model=list[PalaceSchema])
def list_palaces(user_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Fetch all palaces (optionally filtered by user)."""
    try:
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
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Upload new palace
@router.post("/upload", response_model=PalaceSchema)
async def upload_memory_palace(
    request: Request,
    user_id: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
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
            user_id=user_id,
        )

        db.add(new_palace)
        db.commit()
        db.refresh(new_palace)

        # Parse spots for response
        try:
            new_palace.spots = json.loads(new_palace.spots)
        except json.JSONDecodeError:
            new_palace.spots = []

        return new_palace
    
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except SQLAlchemyError as e:
        db.rollback()  # Rollback on database error
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating palace: {str(e)}")


# Update existing palace
@router.put("/update/{palace_id}", response_model=PalaceSchema)
async def update_memory_palace(
    palace_id: int,
    request: Request,
    user_id: str = Query(...),
    db: Session = Depends(get_db),
):
    try:
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

        # Parse spots for response
        try:
            palace.spots = json.loads(palace.spots)
        except json.JSONDecodeError:
            palace.spots = []

        return palace
    
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating palace: {str(e)}")


# Delete a palace
@router.delete("/delete/{palace_id}")
def delete_memory_palace(
    palace_id: int, 
    user_id: str = Query(...), 
    db: Session = Depends(get_db)
):
    try:
        palace = (
            db.query(MemoryPalace)
            .filter(MemoryPalace.id == palace_id, MemoryPalace.user_id == user_id)
            .first()
        )
        if not palace:
            raise HTTPException(status_code=404, detail="Palace not found")

        palace_name = palace.name
        db.delete(palace)
        db.commit()
        return {"detail": f"Palace '{palace_name}' deleted successfully"}
    
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting palace: {str(e)}")