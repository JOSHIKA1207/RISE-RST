from dateutil.parser import isoparse


def deduplicate_events(events):
    grouped = {}

    for event in events:
        key = (
            event.get("source"),
            event.get("record_id")
        )

        if key not in grouped:
            grouped[key] = event
            continue

        current_timestamp = isoparse(
            grouped[key]["timestamp"]
        )

        new_timestamp = isoparse(
            event["timestamp"]
        )

        if new_timestamp > current_timestamp:
            grouped[key] = event

    return list(grouped.values())