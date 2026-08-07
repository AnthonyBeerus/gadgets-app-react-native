import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { NEO_THEME } from '../constants/neobrutalism';
import { usePurchases } from '../hooks/usePurchases';
import { LinearGradient } from 'expo-linear-gradient';
import { useNeoStyles } from '../hooks/useNeoStyles';
import { useTheme } from '../providers/theme-provider';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
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
    } catch {
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
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  if (!offering) {
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={c.white} />
        </TouchableOpacity>
        <Text style={styles.errorText}>No subscription options available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={c.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[c.yellow, c.accent]}
            style={styles.iconBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="star" size={40} color={c.black} />
          </LinearGradient>
          <Text style={styles.heroTitle}>UNLOCK MUSE PRO</Text>
          <Text style={styles.heroSubtitle}>Join thousands of premium members</Text>
        </View>

        <View style={styles.benefitsList}>
          <BenefitListItem icon="trophy" text="Access all premium challenges" />
          <BenefitListItem icon="sparkles" text="Unlimited AI content generation" />
          <BenefitListItem icon="diamond" text="Exclusive gems and rewards" />
          <BenefitListItem icon="flash" text="Priority support" />
          <BenefitListItem icon="gift" text="Special member perks" />
        </View>

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
                        <Ionicons name="checkmark" size={16} color={c.white} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <Text style={styles.trustText}>
            ✓ Cancel anytime   ✓ Secure payment   ✓ 1000+ members
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
          activeOpacity={0.9}
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
        >
          {isPurchasing ? (
            <ActivityIndicator color={c.black} />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>START FREE TRIAL</Text>
              <Ionicons name="arrow-forward" size={20} color={c.black} />
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
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <View style={styles.benefitListItem}>
      <View style={[styles.benefitListItemBg, { backgroundColor: c.white }]} />
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={18} color={c.yellow} />
      </View>
      <Text style={styles.benefitListText}>{text}</Text>
    </View>
  );
}

function createStyles(c: {
  black: string;
  white: string;
  primary: string;
  yellow: string;
  accent: string;
  border: string;
  error: string;
  grey: string;
}) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.primary,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: c.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 20,
      backgroundColor: c.primary,
    },
    errorText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
      color: c.white,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
      justifyContent: 'space-between' as const,
    },
    heroSection: {
      alignItems: 'center' as const,
    },
    iconBox: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 2,
    },
    heroTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 24,
      color: c.white,
      textAlign: 'center' as const,
      marginBottom: 4,
    },
    heroSubtitle: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 13,
      color: c.grey,
      textAlign: 'center' as const,
    },
    benefitsList: {
      justifyContent: 'center' as const,
      paddingVertical: 8,
    },
    benefitListItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 10,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden' as const,
    },
    benefitListItemBg: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.1,
    },
    benefitIcon: {
      marginRight: 10,
    },
    benefitListText: {
      flex: 1,
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      color: c.white,
    },
    packagesSection: {
      paddingBottom: 0,
    },
    sectionTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 14,
      color: c.white,
      marginBottom: 8,
      textAlign: 'center' as const,
      letterSpacing: 1,
    },
    packagesRow: {
      flexDirection: 'row' as const,
      gap: 8,
      marginBottom: 8,
    },
    packageBox: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 12,
      position: 'relative' as const,
    },
    packageBoxSelected: {
      backgroundColor: c.yellow,
      transform: [{ scale: 1.05 }],
      shadowColor: c.yellow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12,
    },
    packageBadge: {
      position: 'absolute' as const,
      top: -8,
      left: '50%' as const,
      transform: [{ translateX: -35 }],
      backgroundColor: c.error,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 2,
    },
    badgeText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 9,
      color: c.white,
      letterSpacing: 0.5,
    },
    packageContent: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingVertical: 12,
    },
    packageLabel: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 13,
      color: c.black,
      textAlign: 'center' as const,
    },
    packagePrice: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 18,
      color: c.black,
      textAlign: 'center' as const,
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.white,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    checkboxSelected: {
      backgroundColor: c.black,
    },
    trustText: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 11,
      color: c.grey,
      textAlign: 'center' as const,
      marginTop: 12,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderColor: c.border,
      backgroundColor: c.black,
    },
    purchaseButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.yellow,
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      gap: 8,
      shadowColor: c.yellow,
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
      color: c.black,
      letterSpacing: 1,
    },
    restoreButton: {
      alignItems: 'center' as const,
      padding: 12,
    },
    restoreText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 14,
      color: c.grey,
    },
  };
}
