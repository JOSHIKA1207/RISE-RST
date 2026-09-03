# ShiftSync AI

ShiftSync AI is an intelligent and grounded shift handover generator built for the **IT HAPPENS @ RAALE #6 Hackathon**.

The system automatically converts operational shift activity into a structured handover note with source traceability, duplicate handling, deterministic classification, risk scoring, and PDF export.

---

## Problem

At the end of a shift, important operational information is often scattered across:

- Ticketing systems
- Incident logs
- Support updates
- Operational records

Manually preparing handover notes can cause missed items, duplicate updates, and poor traceability.

ShiftSync AI solves this by generating a structured handover note directly from shift activity.

---

## Key Features

- Multi-source operational data ingestion
- Shift-window filtering
- Timezone-aware timestamp handling
- Duplicate update collapse
- Deterministic event classification
- Completed section
- In Progress section
- Blockers / Escalations section
- Watch-list section
- Source + Record ID traceability
- Operational risk scoring
- Source-health monitoring
- SHA-256 reproducibility fingerprint
- Structured PDF generation
- PDF download API
- Hostile-input handling
- Automated validation tests

---

## Architecture

```text
Ticketing Data ───────────┐
                          │
Incident Logs ────────────┤
                          ▼
                    Source Loader
                          │
                          ▼
                 Shift Window Filter
                          │
                          ▼
                    Deduplicator
                          │
                          ▼
                Event Classifier
                          │
                          ▼
                    Risk Engine
                          │
                          ▼
                 Handover Generator
                    │          │
                    ▼          ▼
                JSON API     PDF Export