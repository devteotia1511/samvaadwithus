import { create } from 'zustand';
import { supabase, GalleryItem } from '../lib/supabase';

interface GalleryStore {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
  fetchGalleryItems: () => Promise<void>;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchGalleryItems: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ items: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addGalleryItem: async (item) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ items: [data, ...state.items] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateGalleryItem: async (id, item) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteGalleryItem: async (id) => {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));