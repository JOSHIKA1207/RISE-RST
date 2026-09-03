import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"


def load_json_file(filename: str):
    file_path = DATA_DIR / filename

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return {
                "status": "connected",
                "events": json.load(file)
            }

    except FileNotFoundError:
        print(f"[ERROR] Missing source: {filename}")

        return {
            "status": "unavailable",
            "events": []
        }

    except json.JSONDecodeError:
        print(f"[ERROR] Invalid JSON: {filename}")

        return {
            "status": "malformed",
            "events": []
        }

    except Exception as e:
        print(f"[ERROR] {filename}: {e}")

        return {
            "status": "error",
            "events": []
        }


def load_all_sources():
    tickets = load_json_file("tickets.json")
    incidents = load_json_file("incidents.json")

    events = (
        tickets["events"]
        + incidents["events"]
    )

    source_health = {
        "ticketing": tickets["status"],
        "incidents": incidents["status"]
    }

    return events, source_health