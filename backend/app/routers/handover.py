from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas import GenerateRequest
from app.services.generator import generate_handover


router = APIRouter(
    prefix="/api",
    tags=["handover"]
)


@router.post("/generate")
def generate(request: GenerateRequest):
    try:
        return generate_handover(
            request.shift_start,
            request.shift_end
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/export")
def export_pdf():
    base_dir = Path(__file__).resolve().parent.parent.parent

    file_path = (
        base_dir
        / "generated"
        / "shift_handover.pdf"
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No generated handover PDF found"
        )

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename="shift_handover.pdf"
    )