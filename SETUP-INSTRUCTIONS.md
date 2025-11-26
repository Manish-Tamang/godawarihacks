# Complete Setup Instructions for Hack Sushma

## 📋 Prerequisites
- Supabase project created
- Environment variables set in `.env.local`

## 🗄️ Step 1: Create Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Open the file `supabase-schema.sql`
4. Copy and paste the entire SQL script
5. Click **"Run"** or press `Ctrl+Enter`
6. Verify tables were created by going to **Table Editor**

## 🪣 Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Name: `team-documents`
4. **Uncheck** "Public bucket" (keep it private)
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: `application/pdf,image/jpeg,image/jpg,image/png`
7. Click **"Create bucket"**

## 🔐 Step 3: Set Up Storage Policies

1. Go to **Storage** > **Policies** > **team-documents**
2. Click **"New Policy"**
3. Copy and paste each policy from `storage-setup.md`
4. Create all 4 policies as described

## 👤 Step 4: Create Admin Users

### Option A: Using Supabase Auth (Recommended)

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **"Add User"** > **"Create new user"**
3. Enter:
   - **Email**: `admin@hacksushma.xyz` (or your admin email)
   - **Password**: (set a strong password)
   - **Auto Confirm User**: ✅ Check this
4. Click **"Create user"**
5. Repeat for additional admin users

### Option B: Link to Database

After creating users in Auth, link them to `admin_users` table:

```sql
-- Insert admin user record
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES 
  ('admin@hacksushma.xyz', 'Admin User', 'admin', true)
ON CONFLICT (email) DO UPDATE
SET is_active = true;
```

## ✅ Step 5: Verify Setup

### Check Tables
```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('teams', 'team_members', 'admin_users');
```

### Check Storage Bucket
- Go to **Storage** > **Buckets**
- Verify `team-documents` bucket exists

### Check Admin Users
```sql
-- View admin users
SELECT id, email, full_name, role, is_active 
FROM admin_users;
```

## 🧪 Step 6: Test the Setup

1. Try registering a team through the registration form
2. Check if data appears in `teams` and `team_members` tables
3. Verify documents are uploaded to storage bucket
4. Test admin login

## 📝 Quick Reference

### Database Tables
- `teams` - Stores team registrations
- `team_members` - Stores team member information (3 per team)
- `admin_users` - Stores admin user references

### Storage
- Bucket: `team-documents`
- Path structure: `registrations/{team_id}/member{number}_document.{ext}`

### Admin Access
- Use Supabase Auth to create admin users
- Link email to `admin_users` table
- RLS policies will automatically grant access

## 🔧 Troubleshooting

### RLS Policies Not Working?
- Make sure you're authenticated as an admin user
- Check that admin email matches in `admin_users` table
- Verify `is_active = true` for admin user

### Storage Upload Failing?
- Check bucket name matches exactly: `team-documents`
- Verify storage policies are created
- Check file size is under 5MB
- Verify file type is allowed

### Can't Create Admin User?
- Use Supabase Auth dashboard to create users
- Then insert email into `admin_users` table
- Make sure email matches exactly

