from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.story import router as story_router
from routes.palace import router as palace_router

app = FastAPI(title="Easee Memo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story_router)
app.include_router(palace_router)

@app.get("/")
def root():
    return {"message": "Easee Memo Backend is running!"}
