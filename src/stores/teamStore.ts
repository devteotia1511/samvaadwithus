import { create } from 'zustand';
import { supabase, TeamMember } from '../lib/supabase';

interface TeamStore {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'created_at'>) => Promise<void>;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set) => ({
  members: [],
  loading: false,
  error: null,

  fetchTeamMembers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ members: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addTeamMember: async (member) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ members: [data, ...state.members] }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTeamMember: async (id, member) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(member)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, ...data } : m)),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteTeamMember: async (id) => {
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        members: state.members.filter((m) => m.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));