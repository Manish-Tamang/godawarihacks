-- ============================================
-- STORAGE POLICIES FOR TEAM DOCUMENTS BUCKET
-- ============================================
-- Run this AFTER creating the 'team-documents' bucket
-- Go to: Supabase Dashboard > Storage > Policies > team-documents

-- Policy 1: Allow public uploads during registration
CREATE POLICY "Allow public uploads for registration"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] = 'registrations'
);

-- Policy 2: Allow admins to read all documents
CREATE POLICY "Allow admins to read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.email = auth.jwt() ->> 'email'
    AND admin_users.is_active = true
  )
);

-- Policy 3: Allow admins to delete documents
CREATE POLICY "Allow admins to delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.email = auth.jwt() ->> 'email'
    AND admin_users.is_active = true
  )
);

