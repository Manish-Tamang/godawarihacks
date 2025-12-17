-- Allow admins to delete teams (required for Supabase RLS)
-- Run in Supabase SQL editor

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can delete teams" ON teams;
CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );
