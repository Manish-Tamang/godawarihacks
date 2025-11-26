-- ============================================
-- HACK SUSMA DATABASE SCHEMA
-- ============================================
-- Run these queries in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- 1. TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  member_number INTEGER NOT NULL CHECK (member_number IN (1, 2, 3)),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('id', 'citizenship', 'birthcertificate')),
  document_url TEXT, -- URL to the document in storage bucket
  document_path TEXT, -- Path in storage bucket
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, member_number) -- Ensure only 3 members per team
);

-- ============================================
-- 3. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT, -- Optional: We use Supabase Auth for authentication
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_registration_date ON teams(registration_date);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- 5. UPDATE TIMESTAMP FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Teams: Public can insert (register), but only admins can read/update
CREATE POLICY "Anyone can register a team"
  ON teams FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all teams"
  ON teams FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );

CREATE POLICY "Admins can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );

-- Team Members: Public can insert, admins can read
CREATE POLICY "Anyone can add team members"
  ON team_members FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );

-- Admin Users: Users can view their own admin record (for sign-in check)
-- This avoids infinite recursion by not querying admin_users again
CREATE POLICY "Users can view their own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
  );

-- ============================================
-- 8. FUNCTION TO ENSURE 3 MEMBERS PER TEAM
-- ============================================
CREATE OR REPLACE FUNCTION check_team_member_count()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM team_members
  WHERE team_id = NEW.team_id;
  
  IF member_count > 3 THEN
    RAISE EXCEPTION 'A team can only have 3 members';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_team_member_limit
  BEFORE INSERT ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION check_team_member_count();

-- ============================================
-- 9. VIEW FOR TEAM REGISTRATIONS (Admin Dashboard)
-- ============================================
CREATE OR REPLACE VIEW team_registrations AS
SELECT 
  t.id as team_id,
  t.team_name,
  t.status,
  t.registration_date,
  COUNT(tm.id) as member_count,
  ARRAY_AGG(
    json_build_object(
      'name', tm.full_name,
      'email', tm.email,
      'phone', tm.phone,
      'document_type', tm.document_type
    )
  ) as members
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
GROUP BY t.id, t.team_name, t.status, t.registration_date;

-- ============================================
-- DONE! 
-- ============================================
-- Next steps:
-- 1. Create storage bucket (see storage-setup.md)
-- 2. Create admin users (see admin-setup.sql)

