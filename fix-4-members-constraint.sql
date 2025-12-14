    -- ============================================
    -- FIX: Allow 4 Members in Team
    -- ============================================
    -- Run this in your Supabase SQL Editor to fix the member_number constraint

    -- Step 1: Drop the existing check constraint
    ALTER TABLE team_members 
    DROP CONSTRAINT IF EXISTS team_members_member_number_check;

    -- Step 2: Add the correct constraint allowing members 1, 2, 3, 4
    ALTER TABLE team_members 
    ADD CONSTRAINT team_members_member_number_check 
    CHECK (member_number >= 1 AND member_number <= 4);

    -- Step 3: Verify the constraint was added
    SELECT 
    tc.constraint_name,
    tc.table_name,
    cc.check_clause
    FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
    WHERE tc.table_name = 'team_members' 
    AND tc.constraint_type = 'CHECK';

    -- Step 4: Test insert a team with 4 members (this will be rolled back)
    DO $$
    DECLARE
    test_team_id UUID;
    BEGIN
    -- Create a test team
    INSERT INTO teams (team_name, status)
    VALUES ('Test Team for 4 Members', 'pending')
    RETURNING id INTO test_team_id;
    
    -- Try to insert 4 members
    INSERT INTO team_members (team_id, member_number, full_name, email, phone, document_type)
    VALUES 
        (test_team_id, 1, 'Member 1', 'member1@test.com', '1234567890', 'id'),
        (test_team_id, 2, 'Member 2', 'member2@test.com', '1234567891', 'id'),
        (test_team_id, 3, 'Member 3', 'member3@test.com', '1234567892', 'id'),
        (test_team_id, 4, 'Member 4', 'member4@test.com', '1234567893', 'id');
    
    RAISE NOTICE 'SUCCESS: All 4 members inserted successfully!';
    
    -- Rollback the test data
    RAISE EXCEPTION 'Rolling back test data';
    EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test completed. Data rolled back.';
    END $$;

    -- Step 5: Check RLS policies that might be blocking inserts
    SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
    FROM pg_policies
    WHERE tablename = 'team_members';

    -- If there are restrictive RLS policies, you may need to adjust them
    -- Example: Allow service role to insert
    -- CREATE POLICY "Allow service role to insert team members"
    -- ON team_members FOR INSERT
    -- TO service_role
    -- USING (true)
    -- WITH CHECK (true);
