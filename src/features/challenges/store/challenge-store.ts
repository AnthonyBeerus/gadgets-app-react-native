import { create } from 'zustand';
import { Challenge } from '../types/challenge';
import { supabase } from '../../../shared/lib/supabase';

interface ChallengeState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
}



export const useChallengeStore = create<ChallengeState>((set) => ({
  challenges: [],
  loading: false,
  error: null,
  fetchChallenges: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const challenges: Challenge[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          brand_name: item.brand_name,
          brand_logo_url: item.brand_logo_url,
          reward: item.reward,
          deadline: item.deadline,
          participants_count: item.participants_count,
          image_url: item.image_url,
          requirements: item.requirements,
          status: item.status as 'active' | 'completed' | 'upcoming',
          entry_fee: item.entry_fee,
          is_premium: item.is_premium,
          type: item.type as 'free' | 'paid' | 'subscriber',
          category: item.category,
          ai_allowed: item.ai_allowed,
        }));
        set({ challenges, loading: false });
      } else {
        set({ challenges: [], loading: false });
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      set({ error: 'Failed to fetch challenges', loading: false });
    }
  },
}));
