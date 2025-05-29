import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In a real environment, these would be stored in environment variables
// For this example, we'll use public dummy values (no real data/keys)
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export type Event = {
  id: string;
  title: string;
  date: string;
  image_url: string;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  media_url: string;
  is_video: boolean;
  created_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  photo_url: string;
  is_core: boolean;
  created_at: string;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};