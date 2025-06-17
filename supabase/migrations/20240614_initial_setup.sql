-- Minimal Supabase schema and RLS for Samvaad Theatre Group
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  venue text NOT NULL,
  image_url text NOT NULL,
  is_upcoming boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  is_video boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  phone text,
  email text,
  photo_url text,
  is_core boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: Enable and set policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read for all main tables
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);

-- Authenticated full CRUD for all main tables
CREATE POLICY "Auth full access events" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access team_members" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access messages" ON messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access departments" ON departments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth full access admin_users" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public can insert messages (contact form)
CREATE POLICY "Public insert messages" ON messages FOR INSERT TO anon WITH CHECK (true);

-- Seed admin user
INSERT INTO admin_users (email, name, is_active)
VALUES ('devteotia1511@gmail.com', 'Dev Teotia', true)
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 