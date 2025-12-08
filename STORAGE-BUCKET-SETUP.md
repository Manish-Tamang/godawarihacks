# Storage Bucket Setup Guide

## Overview

This guide explains how to create and configure the storage buckets needed for the hackathon application.

## Required Buckets

Your application requires two storage buckets:

1. **team-documents** - For storing member identification documents (ID, Citizenship, Birth Certificate)
2. **payment-screenshots** - For storing payment receipt screenshots

## Steps to Create Buckets

### 1. Access Supabase Dashboard

- Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Select your project
- Navigate to **Storage** in the left sidebar

### 2. Create `team-documents` Bucket

**Step 1:** Click **Create Bucket**

- Name: `team-documents`
- Make it **Public** (toggle the switch)
- Click **Create Bucket**

**Step 2:** Add RLS Policies
Once the bucket is created, go to the **Policies** tab and add these policies:

#### Policy 1: Enable authenticated users to upload files

```
Name: Enable upload for authenticated users
Target roles: authenticated
Allowed operations: INSERT
Using: true
```

#### Policy 2: Enable public read access

```
Name: Enable public read access
Target roles: public, authenticated
Allowed operations: SELECT
Using: true
```

#### Policy 3: Enable admin delete access

```
Name: Enable admin delete
Target roles: authenticated
Allowed operations: DELETE
Using: auth.jwt() ->> 'role' = 'authenticated'
```

### 3. Create `payment-screenshots` Bucket

**Step 1:** Click **Create Bucket**

- Name: `payment-screenshots`
- Make it **Public** (toggle the switch)
- Click **Create Bucket**

**Step 2:** Add RLS Policies
Once the bucket is created, go to the **Policies** tab and add these policies:

#### Policy 1: Enable upload for authenticated users

```
Name: Enable upload for authenticated users
Target roles: authenticated
Allowed operations: INSERT
Using: true
```

#### Policy 2: Enable public read access

```
Name: Enable public read access
Target roles: public, authenticated
Allowed operations: SELECT
Using: true
```

#### Policy 3: Enable admin delete access

```
Name: Enable admin delete
Target roles: authenticated
Allowed operations: DELETE
Using: auth.jwt() ->> 'role' = 'authenticated'
```

## Troubleshooting

### Documents Still Not Loading?

1. Verify bucket names are exactly: `team-documents` and `payment-screenshots` (lowercase)
2. Check that buckets are set to **Public** (not Private)
3. Verify RLS policies are enabled with correct permissions
4. Test by uploading a new registration and checking the Storage Browser

### Storage Path Format

Documents are stored in this structure:

```
team-documents/
├── registrations/
│   ├── {team-id}/
│   │   ├── member1_{timestamp}.pdf
│   │   ├── member2_{timestamp}.jpg
│   │   └── member3_{timestamp}.png

payment-screenshots/
├── payments/
│   ├── {team-id}/
│   │   └── payment_{timestamp}.jpg
```

### Testing Document Upload

1. Go to `/register` page
2. Fill out the registration form
3. Upload documents and payment screenshot
4. Submit the form
5. Go to Supabase Dashboard > Storage > Check if files appear in the buckets
6. Go to Admin Dashboard and try to view documents

## Manual File Upload (for testing)

If you want to test the view document functionality:

1. Go to **Storage** > **team-documents**
2. Click **Upload file**
3. Create a folder structure: `registrations/{any-uuid}/`
4. Upload any PDF/Image file
5. Go to admin dashboard and it should now load

## Security Notes

- Both buckets are **Public** for reading (so anyone can view documents via URL)
- Upload is restricted to **authenticated users** via RLS policies
- Delete operations are restricted to **authenticated users**
- All files have secure random paths, making them hard to guess
- Consider adding additional security measures in production
