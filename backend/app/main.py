from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine, SessionLocal
import app.models

from app.routers.handover import router as handover_router


app = FastAPI(
    title="Shift Handover Generator API",
    version="1.0.0"
)

# Create database tables
Base.metadata.create_all(bind=engine)


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


@app.get("/api/database-health")
def database_health():

    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "connected",
            "database": "PostgreSQL"
        }

    except Exception as e:

        return {
            "status": "unavailable",
            "database": "PostgreSQL",
            "error": str(e)
        }

    finally:
        db.close()