import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEntitlements } from '../../hooks/useEntitlements';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useNeoStyles } from '../../hooks/useNeoStyles';
import { useTheme } from '../../providers/theme-provider';

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
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;

  if (isMusePro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockIcon}>
        <Ionicons name="lock-closed" size={48} color={c.primary} />
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
        <Ionicons name="star" size={20} color={c.white} />
        <Text style={styles.upgradeText}>UPGRADE TO PRO</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(c: {
  black: string;
  white: string;
  grey: string;
  greyLight: string;
  border: string;
  background: string;
  primary: string;
}) {
  return {
    container: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 40,
      backgroundColor: c.background,
    },
    lockIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.greyLight,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 24,
      color: c.black,
      marginBottom: 12,
      textAlign: 'center' as const,
    },
    description: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 16,
      color: c.grey,
      textAlign: 'center' as const,
      marginBottom: 32,
      lineHeight: 24,
    },
    upgradeButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      gap: 8,
      shadowColor: c.grey,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    upgradeText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 16,
      color: c.white,
    },
  };
}
