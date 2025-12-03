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
      
      // Debug: Log the entire customerInfo to see structure
      console.log('[GemStore Debug] CustomerInfo keys:', Object.keys(customerInfo));
      console.log('[GemStore Debug] Full CustomerInfo:', JSON.stringify(customerInfo, null, 2));
      
      // Virtual currencies are available in customerInfo.virtualCurrencies (React Native SDK 9.1.0+)
      // @ts-ignore - virtualCurrencies property might not be in types yet
      const virtualCurrencies = customerInfo.virtualCurrencies;
      
      console.log('[GemStore Debug] Virtual currencies:', virtualCurrencies);
      
      if (virtualCurrencies && virtualCurrencies.GEM !== undefined) {
        // Get GEM balance from customerInfo
        const gemBalance = virtualCurrencies.GEM || 0;
        console.log('[GemStore Debug] GEM balance found:', gemBalance);
        set({ balance: gemBalance, loading: false });
      } else {
        // Fallback: Virtual currencies not configured or not available
        console.warn('[GemStore] Virtual currencies not available in CustomerInfo. Make sure GEM currency is configured in RevenueCat.');
        console.warn('[GemStore] This is expected if you just created the currency. Try the following:');
        console.warn('[GemStore] 1. Wait a few minutes for RevenueCat to sync');
        console.warn('[GemStore] 2. Make a test transaction via the Edge Function');
        console.warn('[GemStore] 3. Verify currency code is exactly "GEM" (case-sensitive)');
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
