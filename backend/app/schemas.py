from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    shift_start: str
    shift_end: str


class Event(BaseModel):
    source: str
    record_id: str
    timestamp: str
    summary: str
    status: str
    severity: Optional[str] = "low"
    owner: Optional[str] = None