import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useAuth } from "../../shared/providers/auth-provider";
import { MaterialIcons } from "@expo/vector-icons";

export default function MerchantProfile() {
  const { user, merchantShopId, switchRole } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
           <MaterialIcons name="store" size={40} color={NEO_THEME.colors.black} />
        </View>
        <Text style={styles.title}>Merchant Profile</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>Shop ID: {merchantShopId}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP MODE</Text>
        <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => switchRole('shopper')}
        >
            <View style={styles.row}>
                <MaterialIcons name="shopping-bag" size={24} color={NEO_THEME.colors.white} />
                <Text style={styles.switchButtonText}>Switch to Shopping</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color={NEO_THEME.colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: NEO_THEME.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  title: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  badgeText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
  },
  section: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 24,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.5,
  },
  switchButton: {
    backgroundColor: NEO_THEME.colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchButtonText: {
    color: NEO_THEME.colors.white,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
  },
});
