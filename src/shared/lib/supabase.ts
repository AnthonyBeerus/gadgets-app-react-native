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

// Identity lives in Clerk, so `supabase.auth.getUser()` always resolves to null and
// any code branching on it silently falls through to its guest path. Non-hook modules
// read the current Muse profile id through here instead; AuthProvider registers it.
let currentProfileIdProvider: () => string | null = () => null;

export function setCurrentProfileIdProvider(provider: () => string | null) {
  currentProfileIdProvider = provider;
}

export function currentProfileId(): string | null {
  return currentProfileIdProvider();
}

export function isSignedInToMuse(): boolean {
  return currentProfileId() != null;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  accessToken: () => accessTokenProvider(),
});

// Public catalogue reads must remain available even while an authenticated
// session is expired or an external identity provider is temporarily
// unavailable. This client intentionally never attaches the Clerk token.
export const publicSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
