import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useAuth } from "../../../shared/providers/auth-provider";
import { supabase } from "../../../shared/lib/supabase";
import { useTheme, type ThemePreference } from "../../../shared/providers/theme-provider";
import { useNeoStyles } from "../../../shared/hooks/useNeoStyles";
import { ProfileOption } from "../components/ProfileOption";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { router } from "expo-router";
import { HeaderRightGroup } from "../../../shared/components/ui/header-right-group";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";

const PREFERENCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const ProfileScreen = () => {
  const { user, isMerchant, isAdmin, switchRole } = useAuth();
  const { preference, setPreference } = useTheme();
  const styles = useNeoStyles(createStyles);

  const renderSmallTitle = () => (
    <Text style={styles.headerTitle}>
      {user?.email?.split("@")[0]?.toUpperCase() || "USER"}
    </Text>
  );

  const renderLargeTitle = () => (
    <View style={styles.largeHeaderContainer}>
      <Image
        source={{
          uri:
            user?.avatar_url ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
        style={styles.largeAvatar}
      />
      <View style={styles.largeUserInfo}>
        <Text style={styles.largeUserName}>
          {user?.email?.split("@")[0] || "User"}
        </Text>
        <Text style={styles.largeUserEmail}>{user?.email}</Text>
        <View style={styles.userTypeBadge}>
          <Text style={styles.userTypeText}>{user?.type || "USER"}</Text>
        </View>
      </View>
    </View>
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const preferenceLabel = useMemo(
    () => PREFERENCE_OPTIONS.find(o => o.value === preference)?.label ?? 'System',
    [preference],
  );

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
      smallHeaderRight={<HeaderRightGroup />}
      largeHeaderRight={<HeaderRightGroup />}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon="person"
            title="EDIT PROFILE"
            subtitle="Update your personal information"
            onPress={() => {}}
          />
          <ProfileOption
            icon="notifications"
            title="NOTIFICATIONS"
            subtitle="Manage your notification preferences"
            onPress={() => {}}
          />
          <ProfileOption
            icon="security"
            title="PRIVACY & SECURITY"
            subtitle="Password, two-factor authentication"
            onPress={() => {}}
          />
          <View style={styles.appearanceBlock}>
            <Text style={styles.appearanceTitle}>APPEARANCE</Text>
            <Text style={styles.appearanceSubtitle}>Currently {preferenceLabel}</Text>
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
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SHOPPING</Text>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon="receipt-long"
            title="MY ORDERS"
            subtitle="Track your purchases"
            onPress={() => router.push("/orders")}
          />
          <ProfileOption
            icon="shopping-bag"
            title="BAG"
            subtitle="Cart and saved challenges"
            onPress={() => router.push('/bag')}
          />
          <ProfileOption
            icon="movie"
            title="CREATOR ACTIVITY"
            subtitle="Submissions, decisions, and vouchers"
            onPress={() => router.push('/(shop)/challenges/my-entries')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MERCHANT</Text>
        <View style={styles.optionsContainer}>
          {isMerchant ? (
             <ProfileOption
                // @ts-ignore
                icon="store"
                title="SWITCH TO MERCHANT MODE"
                subtitle="Access your dashboard"
                onPress={() => {
                    switchRole('merchant');
                    router.replace("/(merchant)");
                }}
             />
          ) : (
            <ProfileOption
                // @ts-ignore
                icon="add-business"
                title="OPEN A SHOP"
                subtitle="Set up your storefront for products and challenge pots"
                onPress={() => router.push("/open-shop")}
            />
          )}
        </View>
      </View>

      {isAdmin ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MUSE OPERATIONS</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="fact-check"
              title="CREATOR MODERATION"
              subtitle="Verify external posts and issue vouchers"
              onPress={() => router.push('/challenges/review')}
            />
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon="logout"
            title="SIGN OUT"
            onPress={handleSignOut}
            showArrow={false}
          />
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </AnimatedHeaderLayout>
  );
};

export default ProfileScreen;

function createStyles(c: ReturnType<typeof useTheme>['theme']['colors']) {
  return {
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: c.black,
      marginHorizontal: 20,
      marginBottom: 12,
      fontFamily: NEO_THEME.fonts.semibold,
    },
    optionsContainer: {
      backgroundColor: c.white,
      marginHorizontal: 20,
      borderRadius: NEO_THEME.borders.radius,
      overflow: "hidden" as const,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 0,
    },
    appearanceBlock: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    appearanceTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.semibold,
      marginBottom: 2,
    },
    appearanceSubtitle: {
      fontSize: 14,
      color: c.grey,
      marginBottom: 12,
      fontFamily: NEO_THEME.fonts.regular,
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
    headerTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.semibold,
    },
    largeHeaderContainer: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    largeAvatar: {
      width: 80,
      height: 80,
      borderRadius: NEO_THEME.borders.radius,
      marginRight: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    largeUserInfo: {
      flex: 1,
    },
    largeUserName: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: c.black,
      marginBottom: 4,
      fontFamily: NEO_THEME.fonts.semibold,
    },
    largeUserEmail: {
      fontSize: 16,
      color: c.grey,
      marginBottom: 8,
    },
    userTypeBadge: {
      backgroundColor: c.greyLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: NEO_THEME.borders.radius,
      alignSelf: "flex-start" as const,
      borderWidth: 1,
      borderColor: c.border,
    },
    userTypeText: {
      color: c.black,
      fontSize: 12,
      fontWeight: '500' as const,
      fontFamily: NEO_THEME.fonts.medium,
    },
    bottomSpacing: {
      height: 100,
    },
  };
}
