-- Complete Database Setup for Samvaad Theatre Group
-- This migration sets up all tables, policies, and initial data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if needed
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Events table
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

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  is_video boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
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

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON events(is_upcoming) WHERE is_upcoming = true;
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_core ON team_members(is_core);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Allow public read access to events" ON events
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to events" ON events
  FOR ALL TO authenticated USING (true);

-- Gallery policies
CREATE POLICY "Allow public read access to gallery" ON gallery
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to gallery" ON gallery
  FOR ALL TO authenticated USING (true);

-- Team members policies
CREATE POLICY "Allow public read access to team members" ON team_members
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to team members" ON team_members
  FOR ALL TO authenticated USING (true);

-- Messages policies
CREATE POLICY "Allow public insert access to messages" ON messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to messages" ON messages
  FOR ALL TO authenticated USING (true);

-- Departments policies
CREATE POLICY "Allow public read access to departments" ON departments
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users full access to departments" ON departments
  FOR ALL TO authenticated USING (true);

-- Insert sample data for testing

-- Sample Events
INSERT INTO events (title, description, date, time, venue, image_url, is_upcoming) VALUES
('Echoes of Time', 'A powerful drama exploring the themes of memory and identity through the lens of a family reunion.', '2024-07-15', '19:00', 'Samvaad Theatre Auditorium', 'https://images.pexels.com/photos/11050165/pexels-photo-11050165.jpeg', true),
('The Silent Monologue', 'An experimental piece that challenges traditional narrative structures through innovative staging.', '2024-08-20', '20:00', 'Community Arts Center', 'https://images.pexels.com/photos/8107967/pexels-photo-8107967.jpeg', true),
('Shadows of Yesterday', 'A retrospective performance celebrating our journey and achievements over the past decade.', '2024-06-10', '18:30', 'City Cultural Hall', 'https://images.pexels.com/photos/11793942/pexels-photo-11793942.jpeg', false);

-- Sample Gallery Items
INSERT INTO gallery (title, media_url, is_video) VALUES
('Echoes of Time - Rehearsal', 'https://images.pexels.com/photos/11050165/pexels-photo-11050165.jpeg', false),
('The Silent Monologue - Performance', 'https://images.pexels.com/photos/8107967/pexels-photo-8107967.jpeg', false),
('Backstage Preparations', 'https://images.pexels.com/photos/1916820/pexels-photo-1916820.jpeg', false),
('Opening Night Celebration', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', false),
('Director''s Workshop', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg', false);

-- Sample Team Members (Core Team)
INSERT INTO team_members (name, title, phone, email, photo_url, is_core) VALUES
('Priya Sharma', 'Artistic Director', '+91 98765 43210', 'priya@samvaadtheatre.com', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', true),
('Aditya Kapoor', 'Managing Director', '+91 98765 43211', 'aditya@samvaadtheatre.com', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', true),
('Neha Gupta', 'Production Manager', '+91 98765 43212', 'neha@samvaadtheatre.com', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg', true),
('Rajiv Mehta', 'Technical Director', '+91 98765 43213', 'rajiv@samvaadtheatre.com', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', true),
('Ananya Patel', 'Creative Director', '+91 98765 43214', 'ananya@samvaadtheatre.com', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', true);

-- Sample Team Members (Other Members)
INSERT INTO team_members (name, title, is_core) VALUES
('Arjun Nair', 'Actor', false),
('Divya Malhotra', 'Actor', false),
('Rahul Verma', 'Actor', false),
('Sneha Das', 'Actor', false),
('Karan Bajaj', 'Actor', false),
('Nisha Reddy', 'Actor', false),
('Rohan Joshi', 'Stage Manager', false),
('Pooja Sharma', 'Costume Designer', false),
('Aarav Kumar', 'Lighting Designer', false),
('Lakshmi Iyer', 'Sound Engineer', false);

-- Sample Departments
INSERT INTO departments (name, description) VALUES
('Acting', 'Our core acting department focuses on character development and performance excellence.'),
('Production', 'Handles all aspects of production including set design, lighting, and sound.'),
('Creative', 'Manages script development, direction, and artistic vision.'),
('Technical', 'Oversees all technical aspects including sound, lighting, and stage management.'),
('Marketing', 'Handles promotion, publicity, and audience engagement.');

-- Create a function to get admin users
CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE(email text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT auth.users.email::text
  FROM auth.users
  WHERE auth.users.email IN (
    'admin@samvaadtheatre.com',
    'admin@example.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM events) as total_events,
  (SELECT COUNT(*) FROM events WHERE is_upcoming = true) as upcoming_events,
  (SELECT COUNT(*) FROM gallery) as total_gallery_items,
  (SELECT COUNT(*) FROM team_members) as total_team_members,
  (SELECT COUNT(*) FROM team_members WHERE is_core = true) as core_team_members,
  (SELECT COUNT(*) FROM messages WHERE is_read = false) as unread_messages,
  (SELECT COUNT(*) FROM departments) as total_departments;

-- Grant access to the view
GRANT SELECT ON admin_stats TO anon, authenticated; 