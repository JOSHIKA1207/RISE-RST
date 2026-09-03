from app.services.generator import generate_handover


def test_normal_shift():
    result = generate_handover(
        "2026-09-03T17:00:00+05:30",
        "2026-09-03T20:00:00+05:30"
    )

    assert result["metrics"]["events_scanned"] == 7
    assert result["metrics"]["events_in_window"] == 5
    assert result["metrics"]["unique_records"] == 4
    assert result["metrics"]["duplicates_removed"] == 1


def test_empty_shift():
    result = generate_handover(
        "2026-09-04T01:00:00+05:30",
        "2026-09-04T02:00:00+05:30"
    )

    assert result["metrics"]["events_in_window"] == 0
    assert len(result["sections"]["completed"]) == 0
    assert len(result["sections"]["in_progress"]) == 0
    assert len(result["sections"]["blockers"]) == 0
    assert len(result["sections"]["watchlist"]) == 0


def test_reproducibility():
    result1 = generate_handover(
        "2026-09-03T17:00:00+05:30",
        "2026-09-03T20:00:00+05:30"
    )

    result2 = generate_handover(
        "2026-09-03T17:00:00+05:30",
        "2026-09-03T20:00:00+05:30"
    )

    assert result1["fingerprint"] == result2["fingerprint"]