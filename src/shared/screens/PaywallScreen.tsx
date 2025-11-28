import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { NEO_THEME } from '../constants/neobrutalism';
import { usePurchases } from '../hooks/usePurchases';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { purchase, restore, isPurchasing } = usePurchases();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOffering();
  }, []);

  const fetchOffering = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOffering(offerings.current);
        // Pre-select yearly (best value)
        const yearlyPkg = offerings.current.availablePackages.find(
          pkg => pkg.product.identifier === 'yearly'
        );
        setSelectedPackage(yearlyPkg || offerings.current.availablePackages[0]);
      }
    } catch (error) {
      console.error('[Paywall] Error fetching offerings:', error);
      Alert.alert('Error', 'Failed to load subscription options.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      const result = await purchase(selectedPackage);
      if (result.success) {
        router.back();
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('[Paywall] Purchase error:', error);
      }
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('Success', 'Purchases restored successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getPackageLabel = (identifier: string) => {
    if (identifier.includes('yearly')) return 'YEARLY';
    if (identifier.includes('monthly')) return 'MONTHLY';
    return 'ONE-TIME';
  };

  const getBadgeText = (identifier: string) => {
    if (identifier.includes('yearly')) return 'BEST VALUE';
    if (identifier.includes('consumable')) return 'POPULAR';
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  if (!offering) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={NEO_THEME.colors.white} />
        </TouchableOpacity>
        <Text style={styles.errorText}>No subscription options available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={NEO_THEME.colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.iconBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="star" size={40} color={NEO_THEME.colors.black} />
          </LinearGradient>
          <Text style={styles.heroTitle}>UNLOCK MUSE PRO</Text>
          <Text style={styles.heroSubtitle}>Join thousands of premium members</Text>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsList}>
          <BenefitListItem icon="trophy" text="Access all premium challenges" />
          <BenefitListItem icon="sparkles" text="Unlimited AI content generation" />
          <BenefitListItem icon="diamond" text="Exclusive gems and rewards" />
          <BenefitListItem icon="flash" text="Priority support" />
          <BenefitListItem icon="gift" text="Special member perks" />
        </View>

        {/* Subscription Packages - Bottom */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>CHOOSE YOUR PLAN</Text>
          <View style={styles.packagesRow}>
            {offering.availablePackages.map((pkg) => {
              const isSelected = selectedPackage?.identifier === pkg.identifier;
              const badge = getBadgeText(pkg.product.identifier);
              const label = getPackageLabel(pkg.product.identifier);
              
              return (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={[
                    styles.packageBox,
                    isSelected && styles.packageBoxSelected
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedPackage(pkg)}
                >
                  {badge && (
                    <View style={styles.packageBadge}>
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  )}
                  
                  <View style={styles.packageContent}>
                    <Text style={styles.packageLabel}>{label}</Text>
                    <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                    
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={NEO_THEME.colors.white} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Trust Text */}
          <Text style={styles.trustText}>
            ✓ Cancel anytime   ✓ Secure payment   ✓ 1000+ members
          </Text>
        </View>
      </View>

      {/* Footer - Always visible */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          activeOpacity={0.9}
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
        >
          {isPurchasing ? (
            <ActivityIndicator color={NEO_THEME.colors.black} />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>START FREE TRIAL</Text>
              <Ionicons name="arrow-forward" size={20} color={NEO_THEME.colors.black} />
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function BenefitListItem({ icon, text }: BenefitItemProps) {
  return (
    <View style={styles.benefitListItem}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={18} color="#FFD700" />
      </View>
      <Text style={styles.benefitListText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.primary, // Purple background
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: NEO_THEME.colors.primary,
  },
  errorText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  heroTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.white,
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  benefitsList: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
  benefitListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitListText: {
    flex: 1,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.white,
  },
  packagesSection: {
    paddingBottom: 0,
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 14,
    color: NEO_THEME.colors.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  packagesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  packageBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  packageBoxSelected: {
    backgroundColor: NEO_THEME.colors.yellow,
    transform: [{ scale: 1.05 }],
    shadowColor: NEO_THEME.colors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  packageBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -35 }],
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 9,
    color: NEO_THEME.colors.white,
    letterSpacing: 0.5,
  },
  packageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  packageLabel: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 13,
    color: NEO_THEME.colors.black,
    textAlign: 'center',
  },
  packagePrice: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
    textAlign: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: NEO_THEME.colors.black,
  },
  trustText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 18,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    gap: 8,
    shadowColor: NEO_THEME.colors.yellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 17,
    color: NEO_THEME.colors.black,
    letterSpacing: 1,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
  },
  restoreText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
