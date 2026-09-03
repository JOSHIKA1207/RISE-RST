from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

BASE_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = BASE_DIR / "generated"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_pdf(handover_data):
    filename = "shift_handover.pdf"
    file_path = OUTPUT_DIR / filename

    doc = SimpleDocTemplate(
        str(file_path),
        pagesize=A4
    )

    styles = getSampleStyleSheet()
    story = []

    story.append(
        Paragraph(
            "SHIFT HANDOVER NOTE",
            styles["Title"]
        )
    )

    story.append(Spacer(1, 15))

    shift = handover_data["shift"]

    story.append(
        Paragraph(
            f"Shift Start: {shift['start']}",
            styles["Normal"]
        )
    )

    story.append(
        Paragraph(
            f"Shift End: {shift['end']}",
            styles["Normal"]
        )
    )

    story.append(Spacer(1, 20))

    section_titles = {
        "completed": "Completed",
        "in_progress": "In Progress",
        "blockers": "Blockers / Escalations",
        "watchlist": "Watch-list"
    }

    sections = handover_data["sections"]

    for key, title in section_titles.items():

        story.append(
            Paragraph(
                title,
                styles["Heading2"]
            )
        )

        items = sections.get(key, [])

        if not items:
            story.append(
                Paragraph(
                    "Nothing to report",
                    styles["Normal"]
                )
            )

        else:
            for item in items:
                text = (
                    f"<b>{item['record_id']}</b> — "
                    f"{item['summary']}<br/>"
                    f"Status: {item['status']}<br/>"
                    f"Source: {item['source_reference']}<br/>"
                    f"Timestamp: {item['timestamp']}<br/>"
                    f"Risk: {item['risk_level'].upper()} "
                    f"({item['risk_score']})"
                )

                story.append(
                    Paragraph(
                        text,
                        styles["Normal"]
                    )
                )

                story.append(Spacer(1, 10))

        story.append(Spacer(1, 15))

    doc.build(story)

    return {
        "filename": filename,
        "path": str(file_path)
    }