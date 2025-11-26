-- ============================================
-- STORAGE POLICIES FOR TEAM DOCUMENTS BUCKET
-- ============================================
-- Run this in Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor
-- Make sure the 'team-documents' bucket exists first!

-- ============================================
-- IMPORTANT: Enable RLS on storage.objects
-- ============================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policy 1: Allow public uploads during registration
-- ============================================
CREATE POLICY "Allow public uploads for registration"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] = 'registrations'
);

-- ============================================
-- Policy 2: Allow admins to read all documents
-- ============================================
CREATE POLICY "Allow admins to read documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.email = auth.jwt() ->> 'email'
    AND admin_users.is_active = true
  )
);

-- ============================================
-- Policy 3: Allow admins to delete documents
-- ============================================
CREATE POLICY "Allow admins to delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-documents' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.email = auth.jwt() ->> 'email'
    AND admin_users.is_active = true
  )
);

-- ============================================
-- Verify policies were created
-- ============================================
SELECT 
  policyname, 
  cmd, 
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%team-documents%' OR policyname LIKE '%registration%' OR policyname LIKE '%admin%';

