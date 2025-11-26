-- ============================================
-- ADMIN USER SETUP
-- ============================================
-- This file shows how to create admin users
-- 
-- OPTION 1: Use Supabase Auth (RECOMMENDED)
-- ============================================
-- Go to: https://supabase.com/dashboard/project/_/auth/users
-- Click "Add User" and create admin users there
-- Then link them to admin_users table using their email

-- ============================================
-- OPTION 2: Create Admin User in Database
-- ============================================
-- Note: This is for reference. For production, use Supabase Auth.

-- Insert admin user (you'll need to hash the password separately)
-- For now, we'll use Supabase Auth and just store the email reference

INSERT INTO admin_users (email, full_name, role, is_active)
VALUES 
  ('admin@hacksushma.xyz', 'Admin User', 'admin', true),
  ('superadmin@hacksushma.xyz', 'Super Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- LINK SUPABASE AUTH USER TO ADMIN_USERS TABLE
-- ============================================
-- After creating users in Supabase Auth dashboard:
-- 1. Go to Authentication > Users
-- 2. Create a new user with email and password
-- 3. The email should match the email in admin_users table
-- 4. Or update admin_users table with the email from Supabase Auth

-- Example: Update admin_users with Supabase Auth user email
-- UPDATE admin_users 
-- SET email = 'your-admin-email@example.com'
-- WHERE id = 'your-admin-id';

-- ============================================
-- VERIFY ADMIN USERS
-- ============================================
SELECT id, email, full_name, role, is_active, created_at
FROM admin_users
ORDER BY created_at DESC;

