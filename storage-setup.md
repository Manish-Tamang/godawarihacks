# Storage Bucket Setup for Hack Sushma

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `team-documents`
   - **Public bucket**: ❌ **UNCHECKED** (Keep it private for security)
   - **File size limit**: 5242880 (5MB in bytes)
   - **Allowed MIME types**: `application/pdf,image/jpeg,image/jpg,image/png`
5. Click **"Create bucket"**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies to allow:

- Public users to upload documents (for registration)
- Admins to read/download documents

### Policy 1: Allow Public Uploads (Registration)

Go to **Storage** > **Policies** > **team-documents** and create a new policy:

**Policy Name**: `Allow public uploads for registration`

**Policy Definition**:

```sql
-- Allow anyone to upload files during registration
CREATE POLICY "Allow public uploads for registration"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'team-documents' AND
  (storage.foldername(name))[1] = 'registrations'
);
```

### Policy 2: Allow Admins to Read All Documents

```sql
-- Allow admins to read all documents
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
```

### Policy 3: Allow Admins to Delete Documents

```sql
-- Allow admins to delete documents
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
```

## Step 3: File Path Structure

Files will be stored with this structure:

```
team-documents/
  └── registrations/
      └── {team_id}/
          ├── member1_document.pdf
          ├── member2_document.jpg
          └── member3_document.png
```

## Step 4: Test Upload

You can test the upload functionality once the API route is created.

## Notes

- **Security**: Documents are stored privately by default
- **File Size**: Maximum 5MB per file
- **File Types**: Only PDF, JPG, JPEG, PNG allowed
- **Organization**: Files are organized by team_id for easy management
