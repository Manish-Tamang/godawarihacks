-- ============================================
-- SIMPLE SCHEMA UPDATE FOR PAYMENT SUPPORT
-- ============================================
-- Run these queries in Supabase SQL Editor if you get trigger errors
-- This adds payment columns to existing teams table

-- Step 1: Check if columns exist, if not add them
ALTER TABLE teams
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS payment_screenshot_path TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false;

-- Step 2: Create payment-screenshots storage bucket (if not exists)
-- Note: You may need to do this through Supabase Dashboard > Storage
-- Create bucket named "payment-screenshots" with RLS policies

-- Step 3: Create RLS Policy for payment-screenshots bucket (if not exists)
-- Go to Storage > payment-screenshots > Policies
-- Create policy:
-- Name: Enable public read access
-- Target roles: authenticated, anon
-- Allowed operations: SELECT
-- Using: true

-- Step 4: Verify team_members can support up to 4 members
-- The CHECK constraint should be: member_number IN (1, 2, 3, 4)
-- If it's not, you may need to recreate the constraint

-- Optional: View your teams table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'teams' 
-- ORDER BY ordinal_position;

-- Optional: View your team_members table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'team_members' 
-- ORDER BY ordinal_position;
