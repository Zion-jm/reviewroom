CREATE TABLE IF NOT EXISTS rr_content (id TEXT PRIMARY KEY, revision INTEGER NOT NULL, body TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rr_students (id TEXT PRIMARY KEY, name TEXT NOT NULL, recovery_hash TEXT UNIQUE NOT NULL, created_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS rr_sessions (token_hash TEXT PRIMARY KEY, student_id TEXT REFERENCES rr_students(id), is_admin INTEGER NOT NULL DEFAULT 0, expires_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS rr_attempts (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES rr_students(id),
 assessment_id TEXT NOT NULL, version INTEGER NOT NULL, title TEXT NOT NULL,
 mode TEXT NOT NULL, questions TEXT NOT NULL, answers TEXT NOT NULL DEFAULT '{}',
 started_at BIGINT NOT NULL, deadline BIGINT NOT NULL, completed_at BIGINT,
 result TEXT, score INTEGER, total INTEGER NOT NULL, duration INTEGER,
 revision INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS rr_attempt_owner ON rr_attempts(student_id, started_at);
CREATE INDEX IF NOT EXISTS rr_attempt_board ON rr_attempts(assessment_id, version, completed_at);
CREATE INDEX IF NOT EXISTS rr_session_expiry ON rr_sessions(expires_at);
