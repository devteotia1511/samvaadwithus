import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Test the connection
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error);
  } else {
    console.log('✅ Supabase connection successful');
  }
});

/**
 * Upload an image file to Supabase Storage and return the public URL.
 * @param file The image file to upload
 * @param folder The storage folder (e.g. 'team', 'gallery', 'events')
 * @returns The public URL of the uploaded image
 */
export async function uploadImageToStorage(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('photos').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  // Get public URL
  const { publicUrl } = supabase.storage.from('photos').getPublicUrl(fileName).data;
  if (!publicUrl) throw new Error('Failed to get public URL for uploaded image');
  return publicUrl;
}

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

// Data Service Functions
export const dataService = {
  // Events
  events: {
    async getAll() {
      console.log('🔍 dataService.events.getAll() called');
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) {
          console.error('❌ Supabase error in events.getAll:', error);
          throw error;
        }
        
        console.log('✅ Events data retrieved:', data);
        return data || [];
      } catch (error) {
        console.error('❌ Error in events.getAll:', error);
        throw error;
      }
    },

    async create(event: Omit<Event, 'id' | 'created_at'>) {
      console.log('🔍 dataService.events.create() called with:', event);
      try {
        const { data, error } = await supabase
          .from('events')
          .insert([event])
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase error in events.create:', error);
          throw error;
        }
        
        console.log('✅ Event created successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ Error in events.create:', error);
        throw error;
      }
    },

    async update(id: string, updates: Partial<Event>) {
      console.log('🔍 dataService.events.update() called with id:', id, 'updates:', updates);
      try {
        const { data, error } = await supabase
          .from('events')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase error in events.update:', error);
          throw error;
        }
        
        console.log('✅ Event updated successfully:', data);
        return data;
      } catch (error) {
        console.error('❌ Error in events.update:', error);
        throw error;
      }
    },

    async delete(id: string) {
      console.log('🔍 dataService.events.delete() called with id:', id);
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('❌ Supabase error in events.delete:', error);
          throw error;
        }
        
        console.log('✅ Event deleted successfully');
      } catch (error) {
        console.error('❌ Error in events.delete:', error);
        throw error;
      }
    }
  },

  // Gallery
  gallery: {
    async getAll() {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(item: Omit<GalleryItem, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<GalleryItem>) {
      const { data, error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Team Members
  teamMembers: {
    async getAll() {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    async create(member: Omit<TeamMember, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<TeamMember>) {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },

    async getCoreTeam() {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_core', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    async getOtherMembers() {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_core', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  },

  // Messages
  messages: {
    async getAll() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },

    async create(message: Omit<Message, 'id' | 'created_at' | 'is_read'>) {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ ...message, is_read: false }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async markAsRead(id: string) {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // Departments
  departments: {
    async getAll() {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },

    async create(department: Omit<Department, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('departments')
        .insert([department])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Department>) {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  }
};