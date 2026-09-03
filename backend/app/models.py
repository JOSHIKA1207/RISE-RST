from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    source = Column(
        String(50),
        nullable=False
    )

    record_id = Column(
        String(100),
        nullable=False
    )

    timestamp = Column(
        DateTime(timezone=True),
        nullable=False
    )

    summary = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(50)
    )

    severity = Column(
        String(20)
    )

    owner = Column(
        String(100)
    )


class GeneratedHandover(Base):
    __tablename__ = "generated_handovers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    shift_start = Column(
        DateTime(timezone=True),
        nullable=False
    )

    shift_end = Column(
        DateTime(timezone=True),
        nullable=False
    )

    fingerprint = Column(
        String(64),
        nullable=False
    )

    events_scanned = Column(
        Integer,
        default=0
    )

    events_in_window = Column(
        Integer,
        default=0
    )

    unique_records = Column(
        Integer,
        default=0
    )

    duplicates_removed = Column(
        Integer,
        default=0
    )

    generated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )