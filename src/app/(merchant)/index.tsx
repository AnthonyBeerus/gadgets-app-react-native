import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMerchantDashboardStats, getShopChallenges, getShopProducts } from "../../shared/api/api";
import {
  Text,
  Button,
  Surface,
  space,
  radii,
  useDesignTokens,
  useThemedStyles,
  type SemanticColors,
  type DesignTokens,
} from "../../shared/design-system";
import { useAuth } from "../../shared/providers/auth-provider";

export default function MerchantDashboard() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
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
              <Text variant="caption">Welcome back,</Text>
              <Text variant="h1">{user?.email?.split("@")[0] || "Merchant"}</Text>
            </View>
            <TouchableOpacity
              style={styles.miniButton}
              onPress={() => {
                switchRole("shopper");
                router.replace("/(shop)");
              }}
            >
              <MaterialIcons name="shopping-bag" size={18} color={colors.ink} />
              <Text variant="label">Exit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Surface style={styles.checklistCard} elevation="hairline">
          <Text variant="h3">Launch checklist</Text>
          <Text variant="body" color={colors.inkMuted}>
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
              <Text variant="caption">{nextStep.hint}</Text>
              <Button onPress={() => router.push(nextStep.route)} style={styles.primaryButton}>
                {nextStep.label}
              </Button>
            </>
          ) : (
            <View style={styles.liveBadge}>
              <MaterialIcons name="check-circle" size={18} color={colors.success} />
              <Text variant="label" style={{ flex: 1 }}>
                Launch ready — your pots can reach Discover
              </Text>
            </View>
          )}
        </Surface>

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation="hairline">
            <Text variant="h2">{pendingOrderCount}</Text>
            <Text variant="caption">Pending orders</Text>
          </Surface>
          <Surface style={[styles.statCard, styles.statAccent]} elevation="none">
            <Text variant="h2">P{todaysSales.toFixed(0)}</Text>
            <Text variant="caption">Today&apos;s sales</Text>
          </Surface>
          <Surface style={styles.statCard} elevation="hairline">
            <Text variant="h2">{productCount}</Text>
            <Text variant="caption">Products</Text>
          </Surface>
        </View>

        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionGrid}>
            <ActionCard
              icon="inventory"
              label="Manage catalog"
              onPress={() => router.push("/(merchant)/catalog")}
            />
            <ActionCard
              icon="add-box"
              label="Add product"
              onPress={() => router.push("/create-product")}
            />
          </View>

          <View style={[styles.actionGrid, { marginTop: space.md }]}>
            <ActionCard
              icon="emoji-events"
              label={hasPot ? "New challenge pot" : "Fund a pot"}
              emphasis={!launchComplete}
              onPress={() => router.push("/challenges/create")}
            />
            <ActionCard
              icon="leaderboard"
              label="Review & settle"
              onPress={() => router.push("/(merchant)/community/challenges")}
            />
          </View>

          <View style={[styles.actionGrid, { marginTop: space.md }]}>
            <ActionCard
              icon="qr-code-scanner"
              label="Scan order"
              onPress={() => router.push("/scan-order")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChecklistRow({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  return (
    <View style={styles.checklistRow}>
      <MaterialIcons
        name={done ? "check-circle" : "radio-button-unchecked"}
        size={22}
        color={done ? colors.success : colors.inkMuted}
      />
      <View style={{ flex: 1 }}>
        <Text variant="bodyBold">{label}</Text>
        <Text variant="caption">{detail}</Text>
      </View>
    </View>
  );
}

function ActionCard({
  icon,
  label,
  onPress,
  emphasis,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  emphasis?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  return (
    <TouchableOpacity
      style={[styles.actionCard, emphasis && styles.actionCardEmphasis]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={28} color={colors.ink} />
      <Text variant="label" align="center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.canvas,
    },
    scrollContent: {
      padding: space.lg,
    },
    header: {
      marginBottom: space.lg,
    },
    miniButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingVertical: space.xs,
      paddingHorizontal: space.sm,
      borderRadius: radii.md,
      gap: space.xxs,
      backgroundColor: c.surface,
      ...tokens.elevation.hairline,
    },
    checklistCard: {
      padding: space.md,
      marginBottom: space.lg,
      gap: space.sm,
    },
    checklistRow: {
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      gap: space.sm,
    },
    primaryButton: {
      marginTop: space.xxs,
    },
    liveBadge: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: space.xs,
      backgroundColor: c.gray100,
      borderRadius: radii.md,
      padding: space.sm,
    },
    statsContainer: {
      flexDirection: "row" as const,
      gap: space.md,
      marginBottom: space.lg,
      flexWrap: "wrap" as const,
    },
    statCard: {
      flexGrow: 1,
      flexBasis: 140,
      padding: space.md,
      gap: space.xxs,
    },
    statAccent: {
      backgroundColor: c.accentMuted,
      borderWidth: 1,
      borderColor: c.accent,
    },
    section: {
      marginTop: space.xs,
    },
    sectionTitle: {
      marginBottom: space.md,
    },
    actionGrid: {
      flexDirection: "row" as const,
      gap: space.md,
    },
    actionCard: {
      flex: 1,
      backgroundColor: c.surface,
      padding: space.md,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: space.sm,
      borderRadius: radii.lg,
      minHeight: 112,
      ...tokens.elevation.hairline,
    },
    actionCardEmphasis: {
      backgroundColor: c.accentMuted,
      borderColor: c.accent,
    },
  };
}
