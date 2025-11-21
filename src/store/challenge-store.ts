import { create } from 'zustand';
import { Challenge } from '../types/challenge';

interface ChallengeState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
}

// Mock data for initial development
const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Summer Vibe Content",
    description: "Create a 15s video showing how you use our gadgets at the beach.",
    brand_name: "TechWave",
    reward: "$500 Cash Prize",
    deadline: "2025-12-31",
    participants_count: 124,
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    requirements: ["Must show product logo", "Use hashtag #TechWaveSummer", "High resolution video"],
    status: 'active'
  },
  {
    id: 2,
    title: "Unboxing Experience",
    description: "Film a creative unboxing of the new X-Phone 15.",
    brand_name: "GadgetZone",
    reward: "Free X-Phone 15",
    deadline: "2025-11-30",
    participants_count: 89,
    image_url: "https://images.unsplash.com/photo-1556656793-02715d8dd660?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    requirements: ["Clear audio", "Good lighting", "Honest first impressions"],
    status: 'active'
  },
  {
    id: 3,
    title: "Fitness Tech Challenge",
    description: "Show us your workout routine using the FitTrack Pro.",
    brand_name: "FitLife",
    reward: "Year supply of supplements",
    deadline: "2025-10-15",
    participants_count: 342,
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    requirements: ["Action shots", "Mention key features", "Energetic music"],
    status: 'upcoming'
  }
];

export const useChallengeStore = create<ChallengeState>((set) => ({
  challenges: [],
  loading: false,
  error: null,
  fetchChallenges: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ challenges: MOCK_CHALLENGES, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch challenges', loading: false });
    }
  },
}));
