/*
  # Initial Schema Setup

  1. New Tables
    - events
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - date (date)
      - time (text)
      - venue (text)
      - image_url (text)
      - is_upcoming (boolean)
      - created_at (timestamptz)
    
    - gallery
      - id (uuid, primary key)
      - title (text)
      - media_url (text)
      - is_video (boolean)
      - created_at (timestamptz)
    
    - team_members
      - id (uuid, primary key)
      - name (text)
      - title (text)
      - phone (text)
      - email (text)
      - photo_url (text)
      - is_core (boolean)
      - created_at (timestamptz)
    
    - messages
      - id (uuid, primary key)
      - name (text)
      - email (text)
      - message (text)
      - is_read (boolean)
      - created_at (timestamptz)
    
    - departments
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

drop policy if exists "Allow public read access" on events;
create policy "Allow public read access"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON events
  USING (auth.role() = 'authenticated');

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  is_video boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON gallery
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON gallery
  USING (auth.role() = 'authenticated');

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  phone text,
  email text,
  photo_url text,
  is_core boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON team_members
  USING (auth.role() = 'authenticated');

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert access"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access"
  ON messages
  USING (auth.role() = 'authenticated');

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON departments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON departments
  USING (auth.role() = 'authenticated');