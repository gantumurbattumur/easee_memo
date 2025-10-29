from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.gemini_service import generate_story

router = APIRouter(prefix="/story", tags=["Story"])

class StoryRequest(BaseModel):
    topic: str
    palace_spots: List[str]

@router.post("/generate")
async def story_generate(req: StoryRequest):
    story_text = generate_story(req.topic, req.palace_spots)
    return {"story": story_text}
