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

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: any;
  isMerchant: boolean;
  merchantShopId: number | null;
  activeRole: UserRole;
  createDevMerchant: () => Promise<any>;
  refreshProfile: () => Promise<void>; 
  switchRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
  user: null,
  isMerchant: false,
  merchantShopId: null,
  activeRole: 'shopper',
  createDevMerchant: async () => {},
  refreshProfile: async () => {},
  switchRole: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<{
    avatar_url: string;
    created_at: string | null;
    email: string;
    expo_notification_token: string | null;
    id: string;
    stripe_customer_id: string | null;
    type: string | null;
  } | null>(null);
  const [merchantShopId, setMerchantShopId] = useState<number | null>(null);
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
        setUser(userProfile);
      }

      // 2. Fetch Merchant/Provider Profile
      const { data: provider, error: providerError } = await supabase
        .from('service_provider')
        .select('shop_id')
        .eq('user_id', sessionData.user.id)
        .single();
      
      if (provider) {
        setMerchantShopId(provider.shop_id);
      } else {
        setMerchantShopId(null);
        setActiveRole('shopper'); // Reset if no longer merchant
      }
    } else {
      setUser(null);
      setMerchantShopId(null);
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
        setActiveRole('shopper');
      } else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
        fetchProfile(session);
      }
    });
  }, []);

  const createDevMerchant = async () => {
    try {
      const { data, error } = await supabase.rpc('create_dev_merchant');
      if (error) throw error;
      await fetchProfile(session); // Refresh to get the new merchant status
      setActiveRole('merchant'); // Auto-switch to merchant mode
      return data;
    } catch (e) {
      console.error('Failed to create dev merchant:', e);
      throw e;
    }
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
        merchantShopId,
        activeRole,
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
