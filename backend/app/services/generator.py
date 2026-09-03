import hashlib
import json

from app.services.pdf_generator import generate_pdf
from app.services.source_loader import load_all_sources
from app.services.window_filter import filter_by_shift_window
from app.services.deduplicator import deduplicate_events
from app.services.classifier import classify_event
from app.services.risk_engine import calculate_risk


def generate_handover(shift_start, shift_end):

    # Load events and source health
    all_events, source_health = load_all_sources()

    # Filter events inside shift window
    filtered_events = filter_by_shift_window(
        all_events,
        shift_start,
        shift_end
    )

    # Remove duplicate records
    unique_events = deduplicate_events(
        filtered_events
    )

    # Required handover sections
    sections = {
        "completed": [],
        "in_progress": [],
        "blockers": [],
        "watchlist": []
    }

    # Classify events
    for event in unique_events:

        section = classify_event(event)
        risk = calculate_risk(event)

        item = {
            "source": event.get("source"),
            "record_id": event.get("record_id"),
            "timestamp": event.get("timestamp"),
            "summary": event.get("summary"),
            "status": event.get("status"),
            "severity": event.get("severity"),
            "owner": event.get("owner"),

            "section": section,

            "risk_score": risk["score"],
            "risk_level": risk["level"],

            "source_reference": (
                f"{event.get('source')}:"
                f"{event.get('record_id')}"
            )
        }

        sections[section].append(item)

    # Final structured handover
    result = {
        "shift": {
            "start": shift_start,
            "end": shift_end
        },

        "metrics": {
            "events_scanned": len(all_events),
            "events_in_window": len(filtered_events),
            "unique_records": len(unique_events),
            "duplicates_removed": (
                len(filtered_events)
                - len(unique_events)
            )
        },

        "source_health": source_health,

        "sections": sections
    }

    # Reproducibility fingerprint
    fingerprint_data = {
        "shift": result["shift"],
        "sections": result["sections"]
    }

    fingerprint = hashlib.sha256(
        json.dumps(
            fingerprint_data,
            sort_keys=True
        ).encode()
    ).hexdigest()

    result["fingerprint"] = fingerprint

    # Generate PDF
    pdf = generate_pdf(result)

    result["pdf"] = pdf

    return result