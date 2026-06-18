import { create } from 'zustand';
import Purchases from 'react-native-purchases';

interface GemState {
  balance: number;
  loading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  invalidateCache: () => void;
}

export const useGemStore = create<GemState>((set) => ({
  balance: 0,
  loading: false,
  error: null,
  
  fetchBalance: async () => {
    set({ loading: true, error: null });
    try {
      const customerInfo = await Purchases.getCustomerInfo();

      // Virtual currencies are available in customerInfo.virtualCurrencies (React Native SDK 9.1.0+)
      // @ts-ignore - virtualCurrencies property might not be in types yet
      const virtualCurrencies = customerInfo.virtualCurrencies;

      if (virtualCurrencies && virtualCurrencies.GEM !== undefined) {
        set({ balance: virtualCurrencies.GEM || 0, loading: false });
      } else {
        // Virtual currencies not configured/synced yet in RevenueCat (currency code must be "GEM").
        console.warn('[GemStore] GEM virtual currency not available in CustomerInfo; defaulting balance to 0.');
        set({ balance: 0, loading: false });
      }
    } catch (error) {
      console.error('Error fetching gem balance:', error);
      set({ error: 'Failed to fetch gem balance', loading: false, balance: 0 });
    }
  },
  
  invalidateCache: () => {
    // Invalidate customer info cache to refresh virtual currencies
    try {
      Purchases.invalidateCustomerInfoCache();
    } catch (error) {
      console.error('Error invalidating customer info cache:', error);
    }
  },
}));
