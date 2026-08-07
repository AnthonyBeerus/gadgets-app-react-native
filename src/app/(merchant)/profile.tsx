import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useAuth } from "../../shared/providers/auth-provider";
import { useTheme, type ThemePreference } from "../../shared/providers/theme-provider";
import { useNeoStyles } from "../../shared/hooks/useNeoStyles";
import { MaterialIcons } from "@expo/vector-icons";

const PREFERENCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function MerchantProfile() {
  const { user, merchantShopId, switchRole } = useAuth();
  const { preference, setPreference, theme } = useTheme();
  const styles = useNeoStyles(createStyles);
  const c = theme.colors;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
           <MaterialIcons name="store" size={40} color={c.black} />
        </View>
        <Text style={styles.title}>Merchant Profile</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>Shop ID: {merchantShopId}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.appearanceRow}>
          {PREFERENCE_OPTIONS.map(option => {
            const active = preference === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setPreference(option.value)}
                style={[styles.appearanceChip, active && styles.appearanceChipActive]}
              >
                <Text style={[styles.appearanceChipText, active && styles.appearanceChipTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP MODE</Text>
        <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => switchRole('shopper')}
        >
            <View style={styles.row}>
                <MaterialIcons name="shopping-bag" size={24} color={c.white} />
                <Text style={styles.switchButtonText}>Switch to Shopping</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={c.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function createStyles(c: { black: string; white: string; grey: string; border: string; yellow: string; background: string; greyLight: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.background,
      padding: 20,
    },
    header: {
      alignItems: 'center' as const,
      marginBottom: 40,
      marginTop: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.white,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 24,
      marginBottom: 8,
      color: c.black,
    },
    subtitle: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 16,
      color: c.grey,
      marginBottom: 16,
    },
    badge: {
      backgroundColor: c.yellow,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    badgeText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 12,
      color: c.black,
    },
    section: {
      backgroundColor: c.white,
      padding: 24,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 14,
      marginBottom: 16,
      opacity: 0.5,
      color: c.black,
    },
    appearanceRow: {
      flexDirection: 'row' as const,
      gap: 8,
    },
    appearanceChip: {
      flex: 1,
      minHeight: 40,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.greyLight,
    },
    appearanceChipActive: {
      backgroundColor: c.black,
      borderColor: c.black,
    },
    appearanceChipText: {
      fontSize: 13,
      fontFamily: NEO_THEME.fonts.medium,
      color: c.black,
    },
    appearanceChipTextActive: {
      color: c.white,
    },
    switchButton: {
      backgroundColor: c.black,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      padding: 16,
      borderRadius: NEO_THEME.borders.radius,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    switchButtonText: {
      color: c.white,
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
    },
  };
}
