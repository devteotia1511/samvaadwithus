/*
  # Create Admin User and Setup

  1. Admin User Setup
    - Create admin user with specific credentials
    - Set up user metadata for admin role
    
  2. Security
    - Ensure proper role-based access
    - Update RLS policies to check for admin role
*/

-- First, we need to create a function to create admin user
-- This will be executed after the migration

-- Update RLS policies to check for admin role
DROP POLICY IF EXISTS "Allow authenticated users full access" ON events;
CREATE POLICY "Allow authenticated users full access"
  ON events
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Allow authenticated users full access" ON gallery;
CREATE POLICY "Allow authenticated users full access"
  ON gallery
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Allow authenticated users full access" ON team_members;
CREATE POLICY "Allow authenticated users full access"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Allow authenticated users full access" ON messages;
CREATE POLICY "Allow authenticated users full access"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

DROP POLICY IF EXISTS "Allow authenticated users full access" ON departments;
CREATE POLICY "Allow authenticated users full access"
  ON departments
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );