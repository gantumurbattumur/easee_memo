from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.gemini_service import generate_story, check_recall
from sentence_transformers import SentenceTransformer, util

router = APIRouter(prefix="/story", tags=["Story"])

# Load sentence transformer model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# ---------- MODELS ----------

class StoryRequest(BaseModel):
    topic: str
    palace_spots: List[str]

class RecallRequest(BaseModel):
    topic: str
    palace_spots: List[str]
    answer: str

# ---------- ROUTES ----------

@router.post("/generate")
async def story_generate(req: StoryRequest):
    """Generate a new memory story using the Gemini model."""
    try:
        story_text = generate_story(req.topic, req.palace_spots)
        return {"story": story_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {e}")


@router.post("/recall")
async def story_recall(req: RecallRequest):
    try:
        # Generate the correct reference story (you already have this logic)
        reference_story = generate_story(req.topic, req.palace_spots)

        # Generate AI feedback by comparing user recall vs reference story
        feedback = check_recall(reference_story, req.answer)

        return {"feedback": feedback}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recall check failed: {e}")