-- Admin Users Table for better admin management
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active) WHERE is_active = true;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to read admin_users" ON admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage admin_users" ON admin_users
  FOR ALL TO authenticated USING (true);

-- Insert default admin users
INSERT INTO admin_users (email, name, is_active) VALUES
('admin@samvaadtheatre.com', 'Main Administrator', true),
('devteotia@gmail.com', 'Developer Admin', true),
('admin@example.com', 'Example Admin', true)
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL ON admin_users TO anon, authenticated; 