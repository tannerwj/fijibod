-- Migration: Add goal_type to users and updated_at to messages
-- Run this on existing databases

-- Add goal_type column to users (no default, then update)
ALTER TABLE users ADD COLUMN goal_type TEXT;
UPDATE users SET goal_type = 'lose' WHERE goal_type IS NULL;

-- Add updated_at column to messages (no default, then update)
ALTER TABLE messages ADD COLUMN updated_at DATETIME;
UPDATE messages SET updated_at = created_at;

-- Verify
SELECT 'Migration complete' as status;
