import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for development
const mockSupabaseClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
  },
};

export const supabase = mockSupabaseClient;

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

export interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
}