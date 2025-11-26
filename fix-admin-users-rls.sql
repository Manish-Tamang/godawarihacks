-- ============================================
-- FIX: Remove infinite recursion in admin_users RLS policy
-- ============================================
-- This fixes the "infinite recursion detected in policy" error

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create a new policy that doesn't cause recursion
-- Allow authenticated users to read their own admin record
-- This allows the sign-in check to work without recursion
CREATE POLICY "Users can view their own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
  );

-- Also allow service role to bypass (for admin operations)
-- Note: Service role already bypasses RLS, but this is explicit
-- Actually, we don't need this since service role bypasses RLS automatically

-- ============================================
-- ALTERNATIVE: If you want admins to see all admin users
-- ============================================
-- You can create a function that checks admin status without recursion
-- But for now, the above policy is sufficient for sign-in to work

-- ============================================
-- VERIFY THE FIX
-- ============================================
-- After running this, try signing in again
-- The sign-in API should be able to check admin_users without recursion

