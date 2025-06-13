/*
  # Setup Admin User and Permissions

  1. Security
    - Create admin role function
    - Update RLS policies for admin access
    - Set up proper authentication checks

  2. Admin User Setup
    - Function to check admin status
    - Proper role assignment
*/

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
DECLARE
  user_email text;
  is_admin boolean;
BEGIN
  -- Get the email from the JWT
  user_email := auth.jwt() ->> 'email';

  -- Check if the email exists and is active in the admin_users table
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = user_email
      AND is_active = true
  ) INTO is_admin;

  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update events table RLS policies
DROP POLICY IF EXISTS "Allow admin users full access" ON events;
DROP POLICY IF EXISTS "Allow public read access" ON events;

CREATE POLICY "Admin full access on events"
  ON events
  FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Public read access on events"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Update gallery table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users full access" ON gallery;
DROP POLICY IF EXISTS "Allow public read access" ON gallery;

CREATE POLICY "Admin full access on gallery"
  ON gallery
  FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Public read access on gallery"
  ON gallery
  FOR SELECT
  TO public
  USING (true);

-- Update team_members table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users full access" ON team_members;
DROP POLICY IF EXISTS "Allow public read access" ON team_members;

CREATE POLICY "Admin full access on team_members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Public read access on team_members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

-- Update messages table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users full access" ON messages;
DROP POLICY IF EXISTS "Allow public insert access" ON messages;

CREATE POLICY "Admin full access on messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Public insert access on messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Update departments table RLS policies
DROP POLICY IF EXISTS "Allow authenticated users full access" ON departments;
DROP POLICY IF EXISTS "Allow public read access" ON departments;

CREATE POLICY "Admin full access on departments"
  ON departments
  FOR ALL
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Public read access on departments"
  ON departments
  FOR SELECT
  TO public
  USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE departments;