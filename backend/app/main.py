from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.handover import router as handover_router

app = FastAPI(
    title="Shift Handover Generator API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(handover_router)


@app.get("/")
def root():
    return {
        "message": "Shift Handover Generator API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }