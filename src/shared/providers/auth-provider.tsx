import { useAuth as useClerkAuth, useUser as useClerkUser } from '../clerk';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { setCurrentProfileIdProvider, setSupabaseAccessTokenProvider, supabase } from '../lib/supabase';

export type MuseRole = 'CREATOR' | 'MERCHANT' | 'OPERATOR';

type User = {
  id: string;
  clerk_user_id: string;
  email: string;
  avatar_url: string | null;
  role: MuseRole;
  full_name: string | null;
  bio: string | null;
  phone_number: string | null;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  created_at: string;
};

type CreateMerchantShopInput = {
  shopName: string;
  shopLocation: string;
  shopDescription?: string;
  shopCategoryId?: number | null;
  shopMallId?: number | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  enableDelivery?: boolean;
  enableCollection?: boolean;
};

type MuseSession = { user: { id: string; clerkUserId: string } };

type AuthData = {
  session: MuseSession | null;
  isSignedIn: boolean;
  mounting: boolean;
  profileError: string | null;
  user: User | null;
  isMerchant: boolean;
  isAdmin: boolean;
  merchantShopId: number | null;
  merchantProviderId: number | null;
  activeRole: 'shopper' | 'merchant';
  createMerchantShop: (input: CreateMerchantShopInput) => Promise<unknown>;
  refreshProfile: () => Promise<User | null>;
  signOut: () => Promise<void>;
  switchRole: (_role: 'shopper' | 'merchant') => void;
  createDevMerchant: () => Promise<unknown>;
};

const AuthContext = createContext<AuthData | null>(null);

function tokenClaims(token: string): { exp?: number; role?: string } | null {
  try {
    const encoded = token.split('.')[1];
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(globalThis.atob(normalized)) as { exp?: number; role?: string };
  } catch {
    return null;
  }
}

function tokenExpiresSoon(token: string, leewaySeconds = 30) {
  const claims = tokenClaims(token);
  return !claims?.exp || claims.exp <= Math.floor(Date.now() / 1000) + leewaySeconds;
}

async function withTimeout<T>(operation: PromiseLike<T>, timeoutMs = 10000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Muse could not prepare your account in time. Check your connection and try again.')), timeoutMs);
  });
  try {
    return await Promise.race([Promise.resolve(operation), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [merchantShopId, setMerchantShopId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'shopper' | 'merchant'>('shopper');
  const getTokenRef = useRef(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    setSupabaseAccessTokenProvider(async () => {
      const token = await getTokenRef.current();
      const current = !token || tokenExpiresSoon(token) ? await getTokenRef.current({ skipCache: true }) : token;
      if (current && tokenClaims(current)?.role !== 'authenticated') {
        console.warn('[Auth] Clerk session token is missing role=authenticated. Complete Clerk Connect with Supabase.');
      }
      return current;
    });
    return () => setSupabaseAccessTokenProvider(async () => null);
  }, []);

  // Non-hook modules (discovery/api.ts) need to know whether there is a Muse profile.
  // A ref keeps the provider stable while still reading the latest value.
  const profileIdRef = useRef<string | null>(null);
  profileIdRef.current = user?.id ?? null;
  useEffect(() => {
    setCurrentProfileIdProvider(() => profileIdRef.current);
    return () => setCurrentProfileIdProvider(() => null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setUser(null);
      setMerchantShopId(null);
      setProfileError(null);
      return null;
    }

    setProfileLoading(true);
    setProfileError(null);
    try {
      const freshToken = await withTimeout(getTokenRef.current({ skipCache: true }));
      if (!freshToken) throw new Error('Your Clerk session expired. Sign in again to continue.');
      if (tokenClaims(freshToken)?.role !== 'authenticated') {
        throw new Error('Muse account connection is not active yet. Activate the Supabase integration in Clerk, then sign out and sign in again.');
      }
      const email = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
      const { error: ensureError } = await withTimeout<{ error: unknown | null }>((supabase as any).rpc('ensure_clerk_profile', {
        p_email: email,
        p_full_name: clerkUser?.fullName ?? null,
        p_avatar_url: clerkUser?.imageUrl ?? null,
      }));
      if (ensureError) throw ensureError;

      const { data: profile, error } = await withTimeout<{ data: User | null; error: unknown | null }>((supabase as any)
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .single());
      if (error) throw error;
      if (!profile) throw new Error('Muse could not find your profile after preparing it. Try again.');
      setUser(profile as User);

      const { data: shop, error: shopError } = await withTimeout<{ data: { id: number } | null; error: unknown | null }>((supabase as any)
        .from('shops')
        .select('id')
        .eq('owner_id', profile.id)
        .maybeSingle());
      if (shopError) throw shopError;
      setMerchantShopId(shop?.id ?? null);
      return profile as User;
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not load your Muse profile');
      throw error;
    } finally {
      setProfileLoading(false);
    }
  }, [clerkUser?.fullName, clerkUser?.imageUrl, clerkUser?.primaryEmailAddress?.emailAddress, isSignedIn, userId]);

  useEffect(() => {
    void fetchProfile().catch(error => console.warn('[Auth] Could not load Muse profile', error));
  }, [fetchProfile]);

  useEffect(() => {
    if (!user) {
      setActiveRole('shopper');
    } else if (user.role === 'MERCHANT') {
      setActiveRole('merchant');
    }
  }, [user?.id, user?.role]);

  const createMerchantShop = useCallback(async (input: CreateMerchantShopInput) => {
    const { data, error } = await (supabase as any).rpc('create_merchant_shop', {
      shop_name: input.shopName,
      shop_location: input.shopLocation,
      shop_description: input.shopDescription || null,
      shop_category_id: input.shopCategoryId ?? null,
      shop_mall_id: input.shopMallId ?? null,
      logo_url: input.logoUrl ?? null,
      image_url: input.imageUrl ?? null,
      enable_delivery: input.enableDelivery ?? false,
      enable_collection: input.enableCollection ?? true,
    });
    if (error) throw error;
    await fetchProfile();
    return data;
  }, [fetchProfile]);

  const session = user && userId ? { user: { id: user.id, clerkUserId: userId } } : null;
  const value = useMemo<AuthData>(() => ({
    session,
    isSignedIn: Boolean(isSignedIn),
    mounting: !isLoaded || profileLoading,
    profileError,
    user,
    isMerchant: user?.role === 'MERCHANT',
    isAdmin: user?.role === 'OPERATOR',
    merchantShopId,
    merchantProviderId: null,
    activeRole,
    createMerchantShop,
    refreshProfile: fetchProfile,
    signOut: async () => signOut(),
    switchRole: setActiveRole,
    createDevMerchant: () => createMerchantShop({
      shopName: 'My Shop',
      shopLocation: 'Gaborone',
      enableCollection: true,
    }),
  }), [activeRole, createMerchantShop, fetchProfile, isLoaded, isSignedIn, merchantShopId, profileError, profileLoading, session, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
