import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Alert } from 'react-native';
import { 
  initRevenueCat, 
  isMusePro, 
  hasEntitlement as checkEntitlement,
  getExpirationDate,
  getActiveProductId,
  willRenew,
} from '../lib/revenuecat';
import { RevenueCatContextType, SubscriptionStatus } from '../types/subscription';

const RevenueCatContext = createContext<RevenueCatContextType | null>(null);

interface RevenueCatProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function RevenueCatProvider({ children, userId }: RevenueCatProviderProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    isMusePro: false,
    expirationDate: null,
    productIdentifier: null,
    willRenew: false,
  });

  // Initialize RevenueCat
  useEffect(() => {
    async function initialize() {
      try {
        await initRevenueCat(userId);
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
      } catch (error) {
        console.error('[RevenueCatProvider] Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [userId]);

  // Update subscription status when customerInfo changes
  useEffect(() => {
    if (customerInfo) {
      const musePro = isMusePro(customerInfo);
      setSubscriptionStatus({
        isActive: musePro,
        isMusePro: musePro,
        expirationDate: getExpirationDate(customerInfo, 'muse_pro'),
        productIdentifier: getActiveProductId(customerInfo),
        willRenew: willRenew(customerInfo),
      });
    }
  }, [customerInfo]);

  // Listen for customer info updates
  useEffect(() => {
    const listener = Purchases.addCustomerInfoUpdateListener((info) => {
      console.log('[RevenueCatProvider] Customer info updated');
      setCustomerInfo(info);
    });

    // Cleanup listener on unmount
    return () => {
      // RevenueCat doesn't require explicit removal in latest versions
    };
  }, []);

  const hasEntitlement = useCallback((entitlementId: string): boolean => {
    return checkEntitlement(customerInfo, entitlementId);
  }, [customerInfo]);

  const makePurchase = useCallback(async (pkg: PurchasesPackage) => {
    try {
      const { customerInfo: updatedInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(updatedInfo);
      
      Alert.alert(
        'Purchase Successful! 🎉',
        'Thank you for subscribing to Muse Pro!',
        [{ text: 'OK' }]
      );
      
      return { customerInfo: updatedInfo, success: true };
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('[RevenueCatProvider] Purchase error:', error);
        Alert.alert(
          'Purchase Failed',
          error.message || 'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      
      Alert.alert(
        'Purchases Restored',
        'Your purchases have been successfully restored.',
        [{ text: 'OK' }]
      );
      
      return info;
    } catch (error: any) {
      console.error('[RevenueCatProvider] Restore error:', error);
      Alert.alert(
        'Restore Failed',
        error.message || 'Failed to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
      throw error;
    }
  }, []);

  const presentPaywall = useCallback(() => {
    // This will be implemented with RevenueCat Paywall UI
    console.log('[RevenueCatProvider] Present paywall');
  }, []);

  const presentCustomerCenter = useCallback(() => {
    // This will be implemented with RevenueCat Customer Center
    console.log('[RevenueCatProvider] Present customer center');
  }, []);

  const value: RevenueCatContextType = {
    customerInfo,
    isLoading,
    subscriptionStatus,
    hasEntitlement,
    makePurchase,
    restorePurchases,
    presentPaywall,
    presentCustomerCenter,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error('useRevenueCat must be used within RevenueCatProvider');
  }
  return context;
}
