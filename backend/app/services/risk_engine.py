def calculate_risk(event):
    score = 0

    severity = event.get("severity", "low").lower()
    status = event.get("status", "").lower()
    owner = event.get("owner")

    severity_scores = {
        "low": 1,
        "medium": 2,
        "high": 3,
        "critical": 4
    }

    score += severity_scores.get(severity, 1)

    if status in ["blocked", "escalated", "failed"]:
        score += 3

    elif status in ["investigating", "in_progress"]:
        score += 2

    elif status in ["open", "watch"]:
        score += 1

    if not owner:
        score += 2

    if score >= 7:
        level = "critical"

    elif score >= 5:
        level = "high"

    elif score >= 3:
        level = "medium"

    else:
        level = "low"

    return {
        "score": score,
        "level": level
    }