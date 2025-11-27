import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEntitlements } from '../../hooks/useEntitlements';
import { NEO_THEME } from '../../constants/neobrutalism';

interface PremiumGateProps {
  children: ReactNode;
  feature?: string;
  fallback?: ReactNode;
}

/**
 * Component that gates content behind Muse Pro subscription
 * Shows paywall if user doesn't have the required entitlement
 */
export function PremiumGate({ children, feature = 'this feature', fallback }: PremiumGateProps) {
  const { isMusePro } = useEntitlements();
  const router = useRouter();

  if (isMusePro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockIcon}>
        <Ionicons name="lock-closed" size={48} color={NEO_THEME.colors.primary} />
      </View>
      
      <Text style={styles.title}>MUSE PRO REQUIRED</Text>
      <Text style={styles.description}>
        Unlock {feature} and all premium features with Muse Pro.
      </Text>

      <TouchableOpacity 
        style={styles.upgradeButton}
        activeOpacity={0.9}
        onPress={() => router.push('/paywall')}
      >
        <Ionicons name="star" size={20} color={NEO_THEME.colors.white} />
        <Text style={styles.upgradeText}>UPGRADE TO PRO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: NEO_THEME.colors.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  title: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 8,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  upgradeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
  },
});
