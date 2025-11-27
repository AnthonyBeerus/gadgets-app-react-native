import { useRevenueCat } from '../providers/RevenueCatProvider';

/**
 * Hook to check subscription status
 * Returns subscription details and helper methods
 */
export function useSubscription() {
  const { customerInfo, isLoading, subscriptionStatus } = useRevenueCat();

  return {
    isLoading,
    isMusePro: subscriptionStatus.isMusePro,
    isSubscribed: subscriptionStatus.isActive,
    expirationDate: subscriptionStatus.expirationDate,
    productIdentifier: subscriptionStatus.productIdentifier,
    willRenew: subscriptionStatus.willRenew,
    customerInfo,
  };
}
