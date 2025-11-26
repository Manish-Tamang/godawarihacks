# 🔐 Admin Setup Guide

## Problem: "Access denied. Admin privileges required."

This error occurs when you try to sign in but **no admin user exists** in the database yet.

## ✅ Solution: Create Your First Admin User

### Option 1: Use the Create Admin Page (Easiest)

1. Go to: **`/admin/create-admin`**
2. Fill in the form:
   - **Full Name**: Your name
   - **Email**: Your admin email (e.g., `admin@hacksushma.xyz`)
   - **Password**: Your password (minimum 6 characters)
   - **Role**: Choose `admin` or `super_admin`
3. Click **"Create Admin User"**
4. ✅ Done! Now you can sign in at `/admin/signin`

### Option 2: Manual Setup via Supabase Dashboard

1. **Create Auth User**:
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Click **"Add User"** → **"Create new user"**
   - Enter email and password
   - ✅ Check **"Auto Confirm User"**
   - Click **"Create user"**

2. **Link to Admin Table**:
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this query:
   ```sql
   INSERT INTO admin_users (email, full_name, role, is_active)
   VALUES ('your-email@example.com', 'Your Name', 'admin', true)
   ON CONFLICT (email) DO UPDATE
   SET is_active = true;
   ```

## 🔍 Verify Admin User Exists

Run this query in Supabase SQL Editor:

```sql
SELECT id, email, full_name, role, is_active, created_at
FROM admin_users
ORDER BY created_at DESC;
```

You should see your admin user listed.

## 🚨 Common Issues

### Issue 1: "Admin account not found"
- **Cause**: No record in `admin_users` table
- **Fix**: Create admin user using Option 1 or 2 above

### Issue 2: "Your admin account has been deactivated"
- **Cause**: `is_active = false` in database
- **Fix**: Run this SQL:
  ```sql
  UPDATE admin_users
  SET is_active = true
  WHERE email = 'your-email@example.com';
  ```

### Issue 3: Email mismatch
- **Cause**: Email in `admin_users` doesn't match Auth email
- **Fix**: Make sure emails match exactly (case-insensitive, but check for typos)

## 📝 Quick Checklist

- [ ] Admin user created in Supabase Auth
- [ ] Admin user record exists in `admin_users` table
- [ ] `is_active = true` in database
- [ ] Email matches exactly between Auth and `admin_users` table
- [ ] Try signing in at `/admin/signin`

## 🎯 After Setup

Once your admin user is created:
1. Go to `/admin/signin`
2. Sign in with your email and password
3. You'll be redirected to `/admin/dashboard`
4. You can now view all team registrations!

---

**Note**: After creating your first admin, you can delete the `/admin/create-admin` page for security.

