-- ============================================
-- FIX PASSWORD_HASH COLUMN
-- ============================================
-- Run this in Supabase SQL Editor to allow NULL values
-- This fixes the constraint error

ALTER TABLE admin_users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'admin_users' 
AND column_name = 'password_hash';

