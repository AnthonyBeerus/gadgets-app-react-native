import { useState } from 'react';
import { useRevenueCat } from '../providers/RevenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';

/**
 * Hook to handle purchases
 * Returns methods to purchase and restore
 */
export function usePurchases() {
  const { makePurchase, restorePurchases } = useRevenueCat();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    setError(null);
    
    try {
      const result = await makePurchase(pkg);
      return result;
    } catch (err: any) {
      if (!err.userCancelled) {
        setError(err.message || 'Purchase failed');
      }
      throw err;
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async () => {
    setError(null);
    
    try {
      const customerInfo = await restorePurchases();
      return customerInfo;
    } catch (err: any) {
      setError(err.message || 'Restore failed');
      throw err;
    }
  };

  return {
    purchase,
    restore,
    isPurchasing,
    error,
  };
}
