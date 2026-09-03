from dateutil.parser import isoparse

from app.database import SessionLocal
from app.models import GeneratedHandover


def save_handover_analytics(result):
    """
    Save only handover metadata/analytics to PostgreSQL.

    The core generator still uses the existing grounded JSON sources.
    Database failure will not break PDF/handover generation.
    """

    db = SessionLocal()

    try:
        metrics = result["metrics"]
        shift = result["shift"]

        record = GeneratedHandover(
            shift_start=isoparse(shift["start"]),
            shift_end=isoparse(shift["end"]),
            fingerprint=result["fingerprint"],
            events_scanned=metrics["events_scanned"],
            events_in_window=metrics["events_in_window"],
            unique_records=metrics["unique_records"],
            duplicates_removed=metrics["duplicates_removed"]
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "saved": True,
            "handover_id": record.id
        }

    except Exception as e:
        db.rollback()

        print(
            "[DATABASE WARNING] Analytics could not be saved:",
            str(e)
        )

        return {
            "saved": False,
            "error": str(e)
        }

    finally:
        db.close()