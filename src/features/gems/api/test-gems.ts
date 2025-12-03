import { supabase } from '../../../shared/lib/supabase';
import Purchases from 'react-native-purchases';

/**
 * TEST UTILITY: Initialize gem balance with a test transaction
 * This should only be used for testing/development
 * Call this once to initialize your gem balance in RevenueCat
 */
export async function initializeGemsForTesting(): Promise<void> {
  try {
    // Get the RevenueCat app user ID (not Supabase user ID!)
    const customerInfo = await Purchases.getCustomerInfo();
    const revenueCatUserId = customerInfo.originalAppUserId;
    
    if (!revenueCatUserId) {
      throw new Error('Could not get RevenueCat user ID');
    }

    console.log('[Gem Test] Initializing gems for RevenueCat user:', revenueCatUserId);

    // Add 100 test gems
    const { data, error } = await supabase.functions.invoke('gems-transaction', {
      body: {
        userId: revenueCatUserId, // Use RevenueCat user ID, not Supabase user ID!
        amount: 100,
        type: 'earn',
        reason: 'Initial test gems',
        metadata: { source: 'test_initialization' },
      },
    });

    if (error) {
      console.error('[Gem Test] Error details:', {
        name: error.name,
        message: error.message,
        status: error.context?.status,
      });
      
      // Try to read the response body for more details
      try {
        // @ts-ignore - Access the response body
        const errorBody = error.context?._bodyInit || error.context?._bodyBlob;
        if (errorBody?._data) {
          // The body is a blob, let's try to get the actual error message
          console.error('[Gem Test] Error has body data, but cannot read blob directly');
          console.error('[Gem Test] Status:', error.context?.status);
          console.error('[Gem Test] This is likely a server error (500). Common causes:');
          console.error('[Gem Test] 1. REVENUECAT_SECRET_KEY not set in Supabase secrets');
          console.error('[Gem Test] 2. RevenueCat API error');
          console.error('[Gem Test] 3. Check Supabase dashboard logs for details');
        }
      } catch (e) {
        console.error('[Gem Test] Could not parse error body:', e);
      }
      
      throw new Error(`Edge Function returned ${error.context?.status || 'error'}. Check Supabase logs or set REVENUECAT_SECRET_KEY.`);
    }

    console.log('[Gem Test] Success! Added 100 gems.');
    console.log('[Gem Test] Response:', data);
    
    return data;
  } catch (error: any) {
    console.error('[Gem Test] Failed to initialize gems:', error.message || error);
    throw error;
  }
}
