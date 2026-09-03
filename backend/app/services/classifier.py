def classify_event(event):
    status = event.get("status", "").lower()
    severity = event.get("severity", "low").lower()
    owner = event.get("owner")

    if status in [
        "done",
        "closed",
        "resolved",
        "completed"
    ]:
        return "completed"

    if status in [
        "blocked",
        "escalated",
        "failed",
        "critical"
    ]:
        return "blockers"

    if severity == "critical":
        return "blockers"

    if status == "open" and not owner:
        return "blockers"

    if status in [
        "working",
        "in_progress",
        "investigating",
        "assigned"
    ]:
        return "in_progress"

    return "watchlist"