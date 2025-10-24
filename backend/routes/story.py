# AI story generation routes
from fastapi import APIRouter, Request
from services.gemini_service import generate_story

router = APIRouter(prefix="/story", tags=["Story"])

@router.post("/generate")
async def generate_story_route(request: Request):
    data = await request.json()
    topic = data.get("topic")
    palace = data.get("palace", "")
    story = generate_story(topic, palace)
    return {"story": story}
