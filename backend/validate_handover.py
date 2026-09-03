from app.services.generator import generate_handover


def run_test(name, start, end):
    print("\n" + "=" * 60)
    print(name)
    print("=" * 60)

    try:
        result = generate_handover(start, end)

        print("Shift:", start, "->", end)
        print("Metrics:", result["metrics"])
        print("Source Health:", result.get("source_health"))
        print("Fingerprint:", result.get("fingerprint"))

        print(
            "Sections:",
            {
                "completed": len(result["sections"]["completed"]),
                "in_progress": len(result["sections"]["in_progress"]),
                "blockers": len(result["sections"]["blockers"]),
                "watchlist": len(result["sections"]["watchlist"]),
            }
        )

        print("RESULT: PASS")

        return result

    except Exception as e:
        print("RESULT: ERROR")
        print("ERROR:", str(e))
        return None


# TEST 1 - Normal busy shift
normal = run_test(
    "TEST 1 - Normal Busy Shift",
    "2026-09-03T17:00:00+05:30",
    "2026-09-03T20:00:00+05:30"
)


# TEST 2 - Same shift again
repeat = run_test(
    "TEST 2 - Reproducibility",
    "2026-09-03T17:00:00+05:30",
    "2026-09-03T20:00:00+05:30"
)

if normal and repeat:
    if normal["fingerprint"] == repeat["fingerprint"]:
        print("\nREPRODUCIBILITY: PASS")
    else:
        print("\nREPRODUCIBILITY: FAIL")


# TEST 3 - Empty shift
run_test(
    "TEST 3 - Empty Shift",
    "2026-09-04T01:00:00+05:30",
    "2026-09-04T02:00:00+05:30"
)


# TEST 4 - Boundary window
run_test(
    "TEST 4 - Boundary Window",
    "2026-09-03T17:45:00+05:30",
    "2026-09-03T19:10:00+05:30"
)


# TEST 5 - Small shift
run_test(
    "TEST 5 - Short Shift Window",
    "2026-09-03T18:00:00+05:30",
    "2026-09-03T19:00:00+05:30"
)


# TEST 6 - Invalid reversed window
print("\n" + "=" * 60)
print("TEST 6 - Invalid Reversed Window")
print("=" * 60)

try:
    generate_handover(
        "2026-09-03T20:00:00+05:30",
        "2026-09-03T17:00:00+05:30"
    )

    print("RESULT: FAIL")

except Exception as e:
    print("RESULT: PASS")
    print("Correctly rejected:", str(e))