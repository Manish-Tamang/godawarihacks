# 🚀 Quick Setup Guide

## 1️⃣ Run Database Schema (5 minutes)

1. Open Supabase Dashboard → **SQL Editor**
2. Copy entire content from `supabase-schema.sql`
3. Paste and click **"Run"**
4. ✅ Done! Tables created

## 2️⃣ Create Storage Bucket (2 minutes)

1. Go to **Storage** → **New bucket**
2. Name: `team-documents`
3. **Uncheck** "Public bucket"
4. File size: `5242880` (5MB)
5. MIME types: `application/pdf,image/jpeg,image/jpg,image/png`
6. Click **"Create"**

## 3️⃣ Add Storage Policies (2 minutes)

1. Go to **Storage** → **Policies** → **team-documents**
2. Copy content from `storage-policies.sql`
3. Run in SQL Editor (or create policies manually in UI)

## 4️⃣ Create Admin User (2 minutes)

### Method 1: Supabase Auth (Easiest)
1. Go to **Authentication** → **Users** → **Add User**
2. Email: `admin@hacksushma.xyz`
3. Password: (your password)
4. ✅ Check "Auto Confirm User"
5. Click **"Create user"**

### Then link to database:
```sql
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@hacksushma.xyz', 'Admin User', 'admin', true);
```

## ✅ Verify Everything Works

```sql
-- Check tables
SELECT * FROM teams;
SELECT * FROM team_members;
SELECT * FROM admin_users;

-- Check storage bucket exists
-- Go to Storage → Buckets → team-documents
```

## 📁 File Structure Created

```
Database:
├── teams (id, team_name, status, registration_date)
├── team_members (id, team_id, member_number, full_name, email, phone, document_type, document_url)
└── admin_users (id, email, full_name, role, is_active)

Storage:
└── team-documents/
    └── registrations/
        └── {team_id}/
            ├── member1_document.pdf
            ├── member2_document.jpg
            └── member3_document.png
```

## 🎯 Next Steps

1. ✅ Database schema created
2. ✅ Storage bucket created
3. ✅ Admin user created
4. ⏭️ Create API route for registration (next step)
5. ⏭️ Create admin dashboard (next step)

---

**Total Setup Time: ~10 minutes** ⏱️

