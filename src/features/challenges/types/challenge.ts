export interface Challenge {
  id: number;
  title: string;
  description: string;
  brand_name: string;
  brand_logo_url?: string;
  reward: string;
  deadline: string;
  participants_count: number;
  image_url: string;
  requirements: string[];
  status: 'active' | 'completed' | 'upcoming';
  entry_fee?: number; // Gems required
  is_premium?: boolean; // Subscriber only
  type: 'free' | 'paid' | 'subscriber';
  category?: string;
}

export interface ChallengeSubmission {
  id: number;
  challenge_id: number;
  user_id: string;
  content_url: string;
  media_type: 'image' | 'video';
  caption?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
