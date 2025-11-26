# Storage Policy Setup Guide

## ⚠️ Error: "Please allow at least one operation in your policy"

This error occurs when creating policies through the Supabase UI. Here's how to fix it:

## ✅ Solution: Use SQL Editor (Recommended)

**The easiest way is to run the SQL directly:**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the entire content from `storage-policies-fixed.sql`
3. Paste and click **"Run"**
4. Done! ✅

## Alternative: Create Policies via UI

If you prefer using the UI, follow these steps carefully:

### Policy 1: Allow Public Uploads

1. Go to **Storage** → **Policies** → **team-documents**
2. Click **"New Policy"**
3. Select **"For full customization"**
4. **Policy name**: `Allow public uploads for registration`
5. **Allowed operation**: ✅ **INSERT** (check this)
6. **Target roles**: `anon`, `authenticated`
7. **USING expression**: Leave empty
8. **WITH CHECK expression**: 
   ```sql
   bucket_id = 'team-documents' AND (storage.foldername(name))[1] = 'registrations'
   ```
9. Click **"Review"** then **"Save policy"**

### Policy 2: Allow Admins to Read

1. Click **"New Policy"** again
2. **Policy name**: `Allow admins to read documents`
3. **Allowed operation**: ✅ **SELECT** (check this)
4. **Target roles**: `authenticated`
5. **USING expression**:
   ```sql
   bucket_id = 'team-documents' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email' AND admin_users.is_active = true)
   ```
6. **WITH CHECK expression**: Leave empty
7. Click **"Review"** then **"Save policy"**

### Policy 3: Allow Admins to Delete

1. Click **"New Policy"** again
2. **Policy name**: `Allow admins to delete documents`
3. **Allowed operation**: ✅ **DELETE** (check this)
4. **Target roles**: `authenticated`
5. **USING expression**:
   ```sql
   bucket_id = 'team-documents' AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.email = auth.jwt() ->> 'email' AND admin_users.is_active = true)
   ```
6. **WITH CHECK expression**: Leave empty
7. Click **"Review"** then **"Save policy"**

## 🎯 Quick Fix

**Just run `storage-policies-fixed.sql` in SQL Editor - it's the fastest way!**

## ✅ Verify Policies

After creating policies, verify they exist:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

You should see 3 policies listed.

