import { useRevenueCat } from '../providers/RevenueCatProvider';
import { ENTITLEMENTS } from '../types/subscription';

/**
 * Hook to check entitlements
 * Returns boolean flags for various entitlements
 */
export function useEntitlements() {
  const { hasEntitlement, subscriptionStatus } = useRevenueCat();

  return {
    isMusePro: subscriptionStatus.isMusePro,
    hasEntitlement,
    // Add more specific entitlement checks here as needed
    canAccessPremiumChallenges: subscriptionStatus.isMusePro,
    canUseAITools: subscriptionStatus.isMusePro,
    hasUnlimitedGems: subscriptionStatus.isMusePro,
  };
}
