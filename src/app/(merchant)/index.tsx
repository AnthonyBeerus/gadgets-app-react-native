import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMerchantDashboardStats, getShopChallenges, getShopProducts } from "../../shared/api/api";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { useAuth } from "../../shared/providers/auth-provider";

export default function MerchantDashboard() {
  const router = useRouter();
  const { isMerchant, merchantShopId, user, switchRole } = useAuth();
  const { data: stats } = getMerchantDashboardStats(merchantShopId);
  const { data: products = [] } = getShopProducts(merchantShopId || 0);
  const { data: challenges = [] } = getShopChallenges(merchantShopId || 0);

  const availableProductCount = useMemo(
    () => products.filter((product: any) => product?.is_available !== false && Number(product?.maxQuantity ?? 0) > 0).length,
    [products],
  );
  const activePotCount = useMemo(
    () => challenges.filter((challenge: any) =>
      challenge?.status === "active"
      && challenge?.contest_mode === "competitive_pot"
      && !challenge?.settled_at
    ).length,
    [challenges],
  );

  if (!isMerchant) return <Redirect href="/open-shop" />;

  const hasProduct = availableProductCount > 0;
  const hasPot = activePotCount > 0;
  const launchComplete = hasProduct && hasPot;
  const nextStep = !hasProduct
    ? { label: "Add your first product", route: "/create-product" as const, hint: "Discover needs a qualifying SKU before anyone can buy to enter." }
    : !hasPot
      ? { label: "Fund your first challenge pot", route: "/challenges/create" as const, hint: "Live competitive pots are what shoppers swipe in Discover." }
      : null;

  const productCount = Number(stats?.product_count ?? availableProductCount);
  const pendingOrderCount = Number(stats?.pending_order_count ?? 0);
  const todaysSales = Number(stats?.todays_sales ?? 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username}>{user?.email?.split("@")[0] || "Merchant"}</Text>
            </View>
            <TouchableOpacity
              style={[styles.miniButton, { backgroundColor: NEO_THEME.colors.sky }]}
              onPress={() => {
                switchRole("shopper");
                router.replace("/(shop)");
              }}
            >
              <MaterialIcons name="shopping-bag" size={20} color={NEO_THEME.colors.black} />
              <Text style={styles.miniButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Launch checklist</Text>
          <Text style={styles.checklistSubtitle}>
            Shoppers only see you on Discover after a product and an active competitive pot are live.
          </Text>

          <ChecklistRow done label="Shop open" detail="Storefront linked to your account" />
          <ChecklistRow
            done={hasProduct}
            label="First product"
            detail={hasProduct ? `${availableProductCount} available SKU(s)` : "Add something people can buy to enter"}
          />
          <ChecklistRow
            done={hasPot}
            label="First challenge pot"
            detail={hasPot ? `${activePotCount} live pot(s)` : "Fund a competitive pot to appear in Discover"}
          />

          {nextStep ? (
            <>
              <Text style={styles.nextHint}>{nextStep.hint}</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push(nextStep.route)}>
                <Text style={styles.primaryButtonText}>{nextStep.label}</Text>
                <MaterialIcons name="arrow-forward" size={20} color={NEO_THEME.colors.black} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.liveBadge}>
              <MaterialIcons name="check-circle" size={18} color={NEO_THEME.colors.black} />
              <Text style={styles.liveBadgeText}>Launch ready — your pots can reach Discover</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{pendingOrderCount}</Text>
            <Text style={styles.statLabel}>Pending Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: NEO_THEME.colors.yellow }]}>
            <Text style={styles.statValue}>P{todaysSales.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: NEO_THEME.colors.sky }]}>
            <Text style={styles.statValue}>{productCount}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(merchant)/catalog")}>
              <MaterialIcons name="inventory" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>Manage Catalog</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/create-product")}>
              <MaterialIcons name="add-box" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.actionGrid, { marginTop: 16 }]}>
            <TouchableOpacity
              style={[styles.actionCard, !launchComplete && styles.actionCardEmphasis]}
              onPress={() => router.push("/challenges/create")}
            >
              <MaterialIcons name="emoji-events" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>{hasPot ? "New Challenge Pot" : "Fund a Pot"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(merchant)/community/challenges")}>
              <MaterialIcons name="leaderboard" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>Review & Settle</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.actionGrid, { marginTop: 16 }]}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/scan-order")}>
              <MaterialIcons name="qr-code-scanner" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>Scan Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(merchant)/vouchers")}>
              <MaterialIcons name="redeem" size={32} color={NEO_THEME.colors.black} />
              <Text style={styles.actionText}>Redeem Voucher</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChecklistRow({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <View style={styles.checklistRow}>
      <MaterialIcons
        name={done ? "check-circle" : "radio-button-unchecked"}
        size={22}
        color={NEO_THEME.colors.black}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.checklistLabel}>{label}</Text>
        <Text style={styles.checklistDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.grey,
  },
  username: {
    fontSize: 32,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  checklistCard: {
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 3,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 18,
    marginBottom: 24,
    gap: 12,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  checklistTitle: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  checklistSubtitle: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.grey,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checklistLabel: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 15,
    color: NEO_THEME.colors.black,
  },
  checklistDetail: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 13,
    color: NEO_THEME.colors.grey,
    marginTop: 2,
  },
  nextHint: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 13,
    color: NEO_THEME.colors.dark,
  },
  primaryButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: NEO_THEME.colors.secondary,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 15,
    color: NEO_THEME.colors.black,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: NEO_THEME.colors.success,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 12,
    padding: 10,
  },
  liveBadgeText: {
    flex: 1,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 13,
    color: NEO_THEME.colors.black,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 140,
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  statValue: {
    fontSize: 28,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: NEO_THEME.colors.grey,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.white,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  actionCardEmphasis: {
    backgroundColor: NEO_THEME.colors.secondary,
  },
  actionText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    textAlign: "center",
  },
  miniButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    gap: 4,
  },
  miniButtonText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
