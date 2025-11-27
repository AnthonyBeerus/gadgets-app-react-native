import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// Entitlement identifiers
export const ENTITLEMENTS = {
  MUSE_PRO: 'muse_pro',
} as const;

// Product identifiers
export const PRODUCTS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CONSUMABLE: 'consumable',
} as const;

// Offering identifiers
export const OFFERINGS = {
  DEFAULT: 'default',
} as const;

export type EntitlementId = typeof ENTITLEMENTS[keyof typeof ENTITLEMENTS];
export type ProductId = typeof PRODUCTS[keyof typeof PRODUCTS];
export type OfferingId = typeof OFFERINGS[keyof typeof OFFERINGS];

export interface SubscriptionStatus {
  isActive: boolean;
  isMusePro: boolean;
  expirationDate: Date | null;
  productIdentifier: string | null;
  willRenew: boolean;
}

export interface PurchaseState {
  isPurchasing: boolean;
  error: string | null;
  lastPurchase: PurchasesPackage | null;
}

export interface RevenueCatContextType {
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
  subscriptionStatus: SubscriptionStatus;
  hasEntitlement: (entitlementId: string) => boolean;
  makePurchase: (pkg: PurchasesPackage) => Promise<{ customerInfo: CustomerInfo; success: boolean }>;
  restorePurchases: () => Promise<CustomerInfo>;
  presentPaywall: () => void;
  presentCustomerCenter: () => void;
}
