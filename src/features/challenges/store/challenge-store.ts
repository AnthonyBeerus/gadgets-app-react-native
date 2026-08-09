import { create } from 'zustand';
import { Challenge } from '../types/challenge';
import { supabase } from '../../../shared/lib/supabase';
import { PILOT_FEATURES } from '../../../shared/constants/pilot-features';

const mapChallenge = (item: any): Challenge => ({
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
  type: item.type as 'free' | 'paid' | 'subscriber',
  category: item.category,
  product_id: item.product_id,
  shop_id: item.shop_id,
  reward_value: item.reward_value,
  reward_currency: item.reward_currency,
  manual_verification_enabled:
    !!item.manual_verification_enabled && PILOT_FEATURES.manualTikTokVerification,
  contest_mode: item.contest_mode === 'competitive_pot' ? 'competitive_pot' : 'standard',
  pot_value: item.pot_value == null ? null : Number(item.pot_value),
  pot_currency: item.pot_currency ?? 'BWP',
  pot_splits: item.pot_splits && typeof item.pot_splits === 'object' ? item.pot_splits : null,
  accepted_entry_fee: Number(
    item.accepted_entry_fee ?? item.consolation_voucher_value ?? item.reward_value ?? 0,
  ),
  settled_at: item.settled_at ?? null,
  score_rule: 'hybrid_quality_engagement',
});

interface ChallengeState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  fetchChallengeById: (id: number) => Promise<Challenge | null>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  loading: false,
  error: null,
  fetchChallenges: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const challenges = (data ?? []).map(mapChallenge);
      set({ challenges, loading: false });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      set({ error: 'Failed to fetch challenges', loading: false });
    }
  },
  fetchChallengeById: async (id: number) => {
    const cached = get().challenges.find(challenge => challenge.id === id);
    if (cached) return cached;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        set({ loading: false });
        return null;
      }

      const challenge = mapChallenge(data);
      set(state => ({
        challenges: state.challenges.some(item => item.id === challenge.id)
          ? state.challenges.map(item => (item.id === challenge.id ? challenge : item))
          : [challenge, ...state.challenges],
        loading: false,
      }));
      return challenge;
    } catch (error) {
      console.error('Error fetching challenge:', error);
      set({ error: 'Failed to fetch challenge', loading: false });
      return null;
    }
  },
}));
