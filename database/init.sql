CREATE OR REPLACE VIEW handover_analytics AS
SELECT
    id,
    shift_start,
    shift_end,
    fingerprint,
    events_scanned,
    events_in_window,
    unique_records,
    duplicates_removed,
    generated_at,
    ROUND(
        CASE
            WHEN events_in_window > 0
            THEN (duplicates_removed::numeric / events_in_window::numeric) * 100
            ELSE 0
        END,
        2
    ) AS duplicate_percentage
FROM generated_handovers;