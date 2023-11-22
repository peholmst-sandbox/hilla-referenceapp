ALTER TABLE work_log_entries
    ADD COLUMN start_time_tz TIMESTAMP WITH TIME ZONE,
    ADD COLUMN end_time_tz   TIMESTAMP WITH TIME ZONE;

UPDATE work_log_entries
SET start_time_tz = work_date + start_time,
    end_time_tz   = work_date + end_time;

ALTER TABLE work_log_entries
    DROP COLUMN work_date,
    DROP COLUMN start_time,
    DROP COLUMN end_time;
ALTER TABLE work_log_entries
    RENAME COLUMN start_time_tz TO start_time;
ALTER TABLE work_log_entries
    RENAME COLUMN end_time_tz TO end_time;

ALTER TABLE work_log_entries
    ALTER COLUMN start_time SET NOT NULL,
    ALTER COLUMN end_time SET NOT NULL;
