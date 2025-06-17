import { create } from 'zustand';
import { supabase, Event } from '../lib/supabase';

interface EventStore {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'created_at'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ events: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ events: [data, ...state.events] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateEvent: async (id, event) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteEvent: async (id) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));