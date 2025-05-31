import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image_url: string;
  is_upcoming: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  media_url: string;
  is_video: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  photo_url: string;
  is_core: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}