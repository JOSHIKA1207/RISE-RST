# REPORT.md — Shift Handover Note Generator

## 1. What We Built

We built a web-based Shift Handover Note Generator that converts timestamped operational activity into a structured handover document for a selected shift window. The system reads events from multiple configured sources, normalizes timestamps, filters strictly to the selected shift window, deduplicates multiple updates to the same record, and classifies the final state into four required sections: Completed, In Progress, Blockers/Escalations, and Watch-list. Every generated item retains its source system, record ID, and timestamp so that it can be traced back to real shift data. The application exports the result as one PDF file and shows “Nothing to report” for empty sections rather than inventing content. The implementation is intentionally deterministic-first so repeated generation for unchanged input produces the same item count and output content.

### Architecture

```text
React/Vite UI
    |
    | POST /api/generate
    v
FastAPI Backend
    |
    +--> Source Adapters
    |      +--> tickets.json / ticket API
    |      +--> incidents.json / incident API
    |      +--> optional chat/commit source
    |
    +--> Timestamp Normalizer
    +--> Shift Window Filter [start, end)
    +--> Deduplication by (source, record_id)
    +--> Rule-Based Section Classifier
    +--> Priority / Risk Scoring
    +--> Traceability Validator
    |
    +--> PDF Publisher
    |
    +--> Generated Handover PDF
```

### Current Status

Working:
- Manual Generate trigger
- Shift start/end input
- Multiple source ingestion
- Time-window filtering
- Timezone normalization
- Deduplication
- Four-section classification
- Source attribution
- Empty-section handling
- PDF export
- Error logging for malformed/unavailable sources
- Deterministic regeneration

Optional/stretch features completed: ______________________________

Known incomplete items: _________________________________________


## 2. Sectioning Logic

| Section | Exact Rule |
|---|---|
| Completed | Final status is one of `done`, `resolved`, `closed`, `completed`, or equivalent. |
| In Progress | Final status is active and owned, such as `in_progress`, `working`, `assigned`, `investigating`. |
| Blockers / Escalations | Final status is `blocked`, `escalated`, `failed`, `critical`, or the event is open at shift end with no valid next owner / has critical severity. |
| Watch-list | Event is not completed but requires monitoring, follow-up, retry, verification, pending response, or has medium/high risk without being a blocker. |

Classification is performed only after shift-window filtering and deduplication. No generated line is allowed into the final note unless it has a valid source and record ID.


## 3. Methods

| Decision | Method Used | Why |
|---|---|---|
| Data source 1 | Seeded ticket JSON / ticket API | Reliable structured source with status, timestamps and IDs |
| Data source 2 | Seeded incident JSON / incident API | Provides operational alerts and severity information |
| Optional source | Chat export / Git commits | Stretch coverage if time permits |
| Rejected source(s) | __________________ | __________________ |
| Shift filtering | Normalize timestamps, then keep `shift_start <= timestamp < shift_end` | Prevents stale backlog and boundary ambiguity |
| Dedup strategy | Group by `(source, record_id)`, sort updates by timestamp, keep/fold into final state | Prevents duplicate items |
| Structuring | Deterministic rule-based classification | Reproducible and fully grounded |
| AI/LLM | Optional only for a top summary; never used to invent section items | Protects grounding and reproducibility |
| Export | ReportLab PDF | Produces one shareable document |
| Secrets | Environment variables / `.env`, excluded from Git | Prevents credential leakage |


## 4. Results

> Replace the rows below with the actual outputs after testing. Do not claim a pass until you verify the generated note against the raw source data.

| Test | Shift Window | Scenario | Expected | Actual Generated | Correct? | False Positive / False Negative Explanation |
|---|---|---|---|---|---|---|
| 1 | __________ | Quiet shift | 1–2 minor items; empty sections show Nothing to report | __________ | ___ | __________ |
| 2 | __________ | Busy shift | Multiple correctly sectioned items | __________ | ___ | __________ |
| 3 | __________ | Duplicate ticket updates | One final item per record | __________ | ___ | __________ |
| 4 | __________ | Boundary timestamp | Only events inside `[start, end)` | __________ | ___ | __________ |
| 5 | __________ | Zero-event shift | All sections show Nothing to report | __________ | ___ | __________ |
| 6 | __________ | Malformed/unavailable source | Source skipped/logged, app still produces safe output | __________ | ___ | __________ |

### Reproducibility Check

Same shift generated twice:
- Run 1 item count: ______
- Run 2 item count: ______
- Same source IDs: Yes / No
- Same section counts: Yes / No
- Result: PASS / FAIL


## 5. How We Worked

| Checkpoint | Planned | Actual |
|---|---|---|
| Architecture + split | 5:00–5:10 | __________ |
| Skeleton end-to-end | 5:10–5:35 | __________ |
| Real source fetch + filtering | 5:35–6:05 | __________ |
| Generator + dedup | 6:05–6:45 | __________ |
| Publisher | 6:45–7:15 | __________ |
| Hardening | 7:15–7:35 | __________ |
| Freeze + push | 7:35–7:40 | __________ |
| Report | 7:40–8:00 | __________ |

### Dead End We Abandoned

We initially considered: __________________________________________

We abandoned it because: ________________________________________

The replacement approach was: ___________________________________


## 6. Limitations and Next Steps

Current limitations:
- Seeded/mock sources may not include production authentication edge cases.
- Status naming differs across real tools and currently requires a mapping configuration.
- Chat text is only used when it has a traceable message ID and timestamp.
- The optional AI summary is disabled when no approved API key is available.
- PDF layout is optimized for operational readability, not full branding.

Next steps:
1. Add live Jira/Trello/GitHub/Slack adapters with read-only scoped authentication.
2. Add carry-forward logic for unresolved items from the previous shift.
3. Add a source-health panel and per-source ingestion statistics.
4. Add Slack-postable/Markdown export in addition to PDF.
5. Add config-driven status mappings so another team can connect a source without code changes.
6. Add automated regression tests for boundary timestamps, duplicates and malformed input.


## 7. How to Run It

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Generate a Note

1. Open the frontend.
2. Choose the shift start and end time.
3. Select the configured data sources.
4. Click **Generate Handover**.
5. Review the four generated sections.
6. Confirm each item displays its source and record ID.
7. Click **Export PDF**.
8. Regenerate the same shift once and confirm the item counts remain unchanged.

### Fresh Data Source Contract

Each source adapter should convert records into this normalized event shape:

```json
{
  "source": "ticketing",
  "record_id": "OPS-4821",
  "timestamp": "2026-09-03T19:42:00+05:30",
  "summary": "Customer reported login failures on mobile app",
  "status": "open",
  "severity": "high",
  "owner": null
}
```

The generator must reject or skip any record that cannot provide enough data to be safely grounded.
