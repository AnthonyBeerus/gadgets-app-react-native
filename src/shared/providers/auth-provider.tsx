import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

type UserRole = 'shopper' | 'merchant';

type User = {
  id: string;
  email: string;
  avatar_url: string;
  role: 'USER' | 'ADMIN' | 'MERCHANT';
  full_name: string | null;
  bio: string | null;
  phone_number: string | null;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  created_at: string;
  type?: string; // Legacy field, keeping for safety
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

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: User | null;
  isMerchant: boolean;
  isAdmin: boolean;
  merchantShopId: number | null;
  merchantProviderId: number | null;
  activeRole: UserRole;
  createMerchantShop: (input: CreateMerchantShopInput) => Promise<any>;
  createDevMerchant: () => Promise<any>;
  refreshProfile: () => Promise<void>; 
  switchRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
  isMerchant: false,
  isAdmin: false,
  merchantShopId: null,
  merchantProviderId: null,
  activeRole: 'shopper',
  createMerchantShop: async () => {},
  createDevMerchant: async () => {},
  refreshProfile: async () => {},
  switchRole: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [merchantShopId, setMerchantShopId] = useState<number | null>(null);
  const [merchantProviderId, setMerchantProviderId] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('shopper');
  const [mounting, setMounting] = useState(true);

  const fetchProfile = async (sessionData: Session | null = session) => {
    if (sessionData) {
      // 1. Fetch User Profile
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.user.id)
        .single();

      if (error) {
        console.error('error fetching user profile', error);
      } else {
        setUser(userProfile as User);
      }

      // 2. Fetch Shop (if Merchant) via owner_id
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', sessionData.user.id)
        .maybeSingle();

      if (shopError) {
        console.error('error fetching merchant shop', shopError);
      }

      const { data: provider, error: providerError } = await supabase
        .from('service_provider')
        .select('id, shop_id')
        .eq('user_id', sessionData.user.id)
        .maybeSingle();

      if (providerError) {
        console.error('error fetching merchant provider', providerError);
      }
      
      if (shop) {
        setMerchantShopId(shop.id);
        setMerchantProviderId(provider?.id ?? null);
      } else {
        setMerchantShopId(null);
        setMerchantProviderId(null);
        setActiveRole('shopper'); // Reset if no longer merchant owner
      }
    } else {
      setUser(null);
      setMerchantShopId(null);
      setMerchantProviderId(null);
      setActiveRole('shopper');
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      await fetchProfile(session);
      setMounting(false);
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        setMerchantShopId(null);
        setMerchantProviderId(null);
        setActiveRole('shopper');
      } else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        fetchProfile(session);
      }
    });
  }, []);

  const createMerchantShop = async (input: CreateMerchantShopInput) => {
    try {
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
      await fetchProfile(session);
      setActiveRole('merchant');
      return data;
    } catch (e) {
      console.error('Failed to create merchant shop:', e);
      throw e;
    }
  };

  const createDevMerchant = async () => {
    return createMerchantShop({
      shopName: 'My Shop',
      shopLocation: 'Online',
      shopDescription: 'Self-serve merchant shop',
      enableDelivery: false,
      enableCollection: true,
    });
  };

  const refreshProfile = async () => {
    await fetchProfile(session);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'merchant' && !merchantShopId) {
        console.warn('Cannot switch to merchant without a shop ID');
        return;
    }
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        mounting, 
        user, 
        isMerchant: !!merchantShopId, 
        isAdmin: user?.type === 'ADMIN' || user?.role === 'ADMIN',
        merchantShopId,
        merchantProviderId,
        activeRole,
        createMerchantShop,
        createDevMerchant,
        refreshProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
