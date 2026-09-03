-- ShiftSync Demo Seed Data
-- Provides realistic seeded operational events for the demo shift.

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    summary TEXT NOT NULL,
    status VARCHAR(50),
    severity VARCHAR(20),
    owner VARCHAR(100)
);

TRUNCATE TABLE events RESTART IDENTITY;

INSERT INTO events (
    source,
    record_id,
    timestamp,
    summary,
    status,
    severity,
    owner
) VALUES
(
    'incident',
    'INC-200',
    '2026-09-03T16:40:00+05:30',
    'Authentication monitoring started before shift window',
    'monitoring',
    'low',
    'platform-team'
),
(
    'incident',
    'INC-201',
    '2026-09-03T17:45:00+05:30',
    'Authentication API latency increased',
    'investigating',
    'high',
    'backend-team'
),
(
    'ticketing',
    'OPS-1001',
    '2026-09-03T18:20:00+05:30',
    'Password reset issue resolved',
    'resolved',
    'medium',
    'support-team'
),
(
    'ticketing',
    'OPS-1002',
    '2026-09-03T18:35:00+05:30',
    'Mobile login failures reported',
    'open',
    'critical',
    NULL
),
(
    'ticketing',
    'OPS-1002',
    '2026-09-03T18:50:00+05:30',
    'Mobile login failures reported',
    'escalated',
    'critical',
    NULL
),
(
    'incident',
    'INC-202',
    '2026-09-03T19:10:00+05:30',
    'Database connection pool nearing limit',
    'watch',
    'medium',
    'platform-team'
),
(
    'incident',
    'INC-203',
    '2026-09-03T20:15:00+05:30',
    'Post-shift infrastructure health check completed',
    'resolved',
    'low',
    'platform-team'
);
