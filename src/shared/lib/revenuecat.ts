import Purchases, { LOG_LEVEL, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { ENTITLEMENTS } from '../types/subscription';

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'test_odJRSyyLwDormGuTNMFEVYuMpoD';

// Check if running in Expo Go (which doesn't support native modules)
const isExpoGo = Constants.appOwnership === 'expo';

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts, before any other RevenueCat methods
 */
export async function initRevenueCat(userId?: string): Promise<void> {
  // Skip initialization in Expo Go
  if (isExpoGo) {
    console.warn('[RevenueCat] Skipping initialization in Expo Go. Build a development build to test subscriptions.');
    return;
  }
  
  try {
    // Configure SDK
    Purchases.setLogLevel(LOG_LEVEL.DEBUG); // Use VERBOSE for more logs in dev

    // Initialize with API key
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId, // Optional: pass user ID for cross-platform syncing
    });

    console.log('[RevenueCat] SDK initialized successfully');
  } catch (error) {
    console.error('[RevenueCat] Failed to initialize SDK:', error);
    throw error;
  }
}

/**
 * Set user ID for RevenueCat
 * Call this after successful login/signup
 */
export async function identifyUser(userId: string): Promise<void> {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('[RevenueCat] User identified:', customerInfo.originalAppUserId);
  } catch (error) {
    console.error('[RevenueCat] Failed to identify user:', error);
    throw error;
  }
}

/**
 * Log out current user
 * Call this when user logs out
 */
export async function logoutUser(): Promise<void> {
  try {
    const result = await Purchases.logOut();
    console.log('[RevenueCat] User logged out');
  } catch (error) {
    console.error('[RevenueCat] Failed to log out user:', error);
    throw error;
  }
}

/**
 * Check if user has a specific entitlement
 */
export function hasEntitlement(customerInfo: CustomerInfo | null, entitlementId: string): boolean {
  if (!customerInfo) return false;
  
  const entitlement = customerInfo.entitlements.active[entitlementId];
  return entitlement?.isActive === true;
}

/**
 * Check if user has Muse Pro
 */
export function isMusePro(customerInfo: CustomerInfo | null): boolean {
  return hasEntitlement(customerInfo, ENTITLEMENTS.MUSE_PRO);
}

/**
 * Get expiration date for an entitlement
 */
export function getExpirationDate(customerInfo: CustomerInfo | null, entitlementId: string): Date | null {
  if (!customerInfo) return null;
  
  const entitlement = customerInfo.entitlements.active[entitlementId];
  return entitlement?.expirationDate ? new Date(entitlement.expirationDate) : null;
}

/**
 * Get active subscription product identifier
 */
export function getActiveProductId(customerInfo: CustomerInfo | null): string | null {
  if (!customerInfo) return null;
  
  const activeSubscriptions = Object.values(customerInfo.entitlements.active);
  return activeSubscriptions[0]?.productIdentifier || null;
}

/**
 * Check if subscription will renew
 */
export function willRenew(customerInfo: CustomerInfo | null): boolean {
  if (!customerInfo) return false;
  
  const activeSubscriptions = Object.values(customerInfo.entitlements.active);
  return activeSubscriptions[0]?.willRenew === true;
}
