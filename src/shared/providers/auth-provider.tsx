import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/expo';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { setSupabaseAccessTokenProvider, supabase } from '../lib/supabase';

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
  mounting: boolean;
  user: User | null;
  isMerchant: boolean;
  isAdmin: boolean;
  merchantShopId: number | null;
  merchantProviderId: number | null;
  activeRole: 'shopper' | 'merchant';
  createMerchantShop: (input: CreateMerchantShopInput) => Promise<unknown>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (_role: 'shopper' | 'merchant') => void;
  createDevMerchant: () => Promise<unknown>;
};

const AuthContext = createContext<AuthData | null>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [merchantShopId, setMerchantShopId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setSupabaseAccessTokenProvider(async () => getToken());
    return () => setSupabaseAccessTokenProvider(async () => null);
  }, [getToken]);

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setUser(null);
      setMerchantShopId(null);
      return;
    }

    setProfileLoading(true);
    try {
      const email = clerkUser?.primaryEmailAddress?.emailAddress ?? '';
      await (supabase as any).rpc('ensure_clerk_profile', {
        p_email: email,
        p_full_name: clerkUser?.fullName ?? null,
        p_avatar_url: clerkUser?.imageUrl ?? null,
      });

      const { data: profile, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('clerk_user_id', userId)
        .single();
      if (error) throw error;
      setUser(profile as User);

      const { data: shop, error: shopError } = await (supabase as any)
        .from('shops')
        .select('id')
        .eq('owner_id', profile.id)
        .maybeSingle();
      if (shopError) throw shopError;
      setMerchantShopId(shop?.id ?? null);
    } finally {
      setProfileLoading(false);
    }
  }, [clerkUser?.fullName, clerkUser?.imageUrl, clerkUser?.primaryEmailAddress?.emailAddress, isSignedIn, userId]);

  useEffect(() => {
    void fetchProfile().catch(error => console.warn('[Auth] Could not load Muse profile', error));
  }, [fetchProfile]);

  const createMerchantShop = async (input: CreateMerchantShopInput) => {
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
  };

  const session = user && userId ? { user: { id: user.id, clerkUserId: userId } } : null;
  const value = useMemo<AuthData>(() => ({
    session,
    mounting: !isLoaded || profileLoading,
    user,
    isMerchant: user?.role === 'MERCHANT',
    isAdmin: user?.role === 'OPERATOR',
    merchantShopId,
    merchantProviderId: null,
    activeRole: user?.role === 'MERCHANT' ? 'merchant' : 'shopper',
    createMerchantShop,
    refreshProfile: fetchProfile,
    signOut: async () => signOut(),
    switchRole: () => undefined,
    createDevMerchant: () => createMerchantShop({
      shopName: 'My Shop',
      shopLocation: 'Gaborone',
      enableCollection: true,
    }),
  }), [fetchProfile, isLoaded, merchantShopId, profileLoading, session, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
