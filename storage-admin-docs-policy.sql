-- Grant admins read access to team-documents bucket (for private buckets)
-- Run in Supabase SQL Editor

-- Ensure RLS is enabled on storage.objects (default is enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Delete existing policy if present to avoid duplicates
DROP POLICY IF EXISTS "Admins can read team documents" ON storage.objects;

CREATE POLICY "Admins can read team documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'team-documents'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );
