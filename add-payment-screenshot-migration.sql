-- ============================================
-- MIGRATION: Add Payment Screenshot Support
-- ============================================
-- Run this if you already have the database set up
-- This adds payment screenshot fields to the teams table

-- Add payment screenshot columns to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS payment_screenshot_path TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false;

-- Update member_number check constraint to allow 4 members
ALTER TABLE team_members 
DROP CONSTRAINT IF EXISTS team_members_member_number_check;

ALTER TABLE team_members 
ADD CONSTRAINT team_members_member_number_check 
CHECK (member_number IN (1, 2, 3, 4));

-- Update the comment on team_members unique constraint
COMMENT ON CONSTRAINT team_members_team_id_member_number_key ON team_members 
IS 'Ensure only 4 members per team';

-- Update the check_team_member_count function to allow 4 members
CREATE OR REPLACE FUNCTION check_team_member_count()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM team_members
  WHERE team_id = NEW.team_id;
  
  IF member_count > 4 THEN
    RAISE EXCEPTION 'A team can only have 4 members';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add index for payment verification queries
CREATE INDEX IF NOT EXISTS idx_teams_payment_verified ON teams(payment_verified);

-- Update the view to include payment information
CREATE OR REPLACE VIEW team_registrations AS
SELECT 
  t.id as team_id,
  t.team_name,
  t.status,
  t.payment_verified,
  t.payment_screenshot_url,
  t.registration_date,
  COUNT(tm.id) as member_count,
  ARRAY_AGG(
    json_build_object(
      'name', tm.full_name,
      'email', tm.email,
      'phone', tm.phone,
      'document_type', tm.document_type
    )
  ) as members
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
GROUP BY t.id, t.team_name, t.status, t.payment_verified, t.payment_screenshot_url, t.registration_date;

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
-- Create payment-screenshots bucket if it doesn't exist
-- Go to Storage in Supabase Dashboard and create a bucket named: payment-screenshots
-- Or run this in SQL editor (if you have permissions):

/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;
*/

-- Set up storage policies for payment-screenshots bucket
-- Allow authenticated users to upload payment screenshots
-- Allow admins to read all payment screenshots

-- ============================================
-- DONE!
-- ============================================
-- The teams table now supports payment screenshots
-- Upload payment screenshots to the 'payment-screenshots' bucket
-- Store path as: payments/{team_id}/payment_{timestamp}.{ext}
