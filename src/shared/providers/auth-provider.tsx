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

type AuthData = {
  session: Session | null;
  mounting: boolean;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
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
        setUser(userProfile as User);
      }

      // 2. Fetch Shop (if Merchant) via owner_id
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', sessionData.user.id)
        .single();
      
      if (shop) {
        setMerchantShopId(shop.id);
        // If user is a merchant but activeRole is shopper, we let them stay as shopper
        // unless strictly required. For now, we prefer manual switch or persistence.
      } else {
        setMerchantShopId(null);
        setActiveRole('shopper'); // Reset if no longer merchant owner
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
