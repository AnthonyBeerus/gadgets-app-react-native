import { createClient } from '@supabase/supabase-js';
import 'react-native-get-random-values';
import { Database } from '../types/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

type AccessTokenProvider = () => Promise<string | null>;

let accessTokenProvider: AccessTokenProvider = async () => null;

export function setSupabaseAccessTokenProvider(provider: AccessTokenProvider) {
  accessTokenProvider = provider;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  accessToken: () => accessTokenProvider(),
});
