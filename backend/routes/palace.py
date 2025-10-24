import json
import os
from fastapi import APIRouter, Request

router = APIRouter(prefix="/palace", tags=["Palace"])

PALACES_FILE = os.path.join(os.path.dirname(__file__), "palaces.json")
print("Reading from:", PALACES_FILE)

# Ensure the file exists
if not os.path.exists(PALACES_FILE):
    with open(PALACES_FILE, "w") as f:
        json.dump([], f)

def load_palaces():
    with open(PALACES_FILE, "r") as f:
        return json.load(f)

def save_palaces(palaces):
    with open(PALACES_FILE, "w") as f:
        json.dump(palaces, f, indent=2)

@router.get("/list")
def list_palaces():
    if not os.path.exists(PALACES_FILE):
        return []
    with open(PALACES_FILE, "r") as f:
        try:
            data = json.load(f)
            return data
        except json.JSONDecodeError:
            return []

@router.post("/upload")
async def upload_memory_palace(request: Request):
    data = await request.json()
    print(f"📥 Received data: {data}")

    nickname = data.get("nickname")
    places = data.get("places", [])

    if not nickname:
        return {"error": "Missing nickname"}

    palace = {"nickname": nickname, "places": places}

    palaces = load_palaces()
    palaces.append(palace)
    save_palaces(palaces)

    print(f"💾 Palace saved: {palace}")
    return {"message": "Palace uploaded!", "palace": palace}
