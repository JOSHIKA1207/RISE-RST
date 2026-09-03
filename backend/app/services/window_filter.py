from dateutil.parser import isoparse


def filter_by_shift_window(events, shift_start, shift_end):
    try:
        start = isoparse(shift_start)
        end = isoparse(shift_end)
    except Exception:
        raise ValueError("Invalid shift start or end timestamp")

    if start >= end:
        raise ValueError(
            "shift_start must be earlier than shift_end"
        )

    filtered = []

    for event in events:
        try:
            timestamp = isoparse(event["timestamp"])

            if start <= timestamp < end:
                filtered.append(event)

        except Exception:
            print(
                "[WARNING] Skipping malformed timestamp:",
                event.get("source"),
                event.get("record_id")
            )

    return filtered