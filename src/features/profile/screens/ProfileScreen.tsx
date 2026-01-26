import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "../../../shared/providers/auth-provider";
import { supabase } from "../../../shared/lib/supabase";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";
import { ProfileOption } from "../components/ProfileOption";
import { AnimatedHeaderLayout } from "../../../shared/components/layout/AnimatedHeaderLayout";
import { router } from "expo-router";
import { HeaderRightGroup } from "../../../shared/components/ui/header-right-group";

const ProfileScreen = () => {
  const { user, createDevMerchant, isMerchant, switchRole } = useAuth();

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

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
      smallHeaderRight={<HeaderRightGroup />}
      largeHeaderRight={<HeaderRightGroup />}
    >
      {/* Account Section */}
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
        </View>
      </View>

      {/* Shopping Section */}
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
            icon="favorite"
            title="WISHLIST"
            subtitle="Items you want to buy later"
            onPress={() => {}}
          />
          <ProfileOption
            icon="location-on"
            title="ADDRESSES"
            subtitle="Manage your delivery addresses"
            onPress={() => {}}
          />
          <ProfileOption
            icon="payment"
            title="PAYMENT METHODS"
            subtitle="Credit cards, PayPal, and more"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.optionsContainer}>
          <ProfileOption
            icon="help"
            title="HELP CENTER"
            subtitle="Get help and support"
            onPress={() => {}}
          />
          <ProfileOption
            icon="feedback"
            title="SEND FEEDBACK"
            subtitle="Tell us how we can improve"
            onPress={() => {}}
          />
          <ProfileOption
            icon="info"
            title="ABOUT"
            subtitle="App version and legal information"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Developer Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DEVELOPER</Text>
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
                title="ACTIVATE MERCHANT MODE"
                subtitle="Create a Dev Merchant account"
                onPress={async () => {
                    try {
                        await createDevMerchant();
                        router.replace("/(merchant)");
                    } catch (e: any) {
                        alert("Error: " + e.message);
                    }
                }}
            />
          )}
        </View>
      </View>

      {/* Sign Out */}
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

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </AnimatedHeaderLayout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginHorizontal: 20,
    marginBottom: 12,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  optionsContainer: {
    backgroundColor: NEO_THEME.colors.white,
    marginHorizontal: 20,
    borderRadius: NEO_THEME.borders.radius,
    overflow: "hidden",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: NEO_THEME.borders.radius,
    marginRight: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  largeUserInfo: {
    flex: 1,
  },
  largeUserName: {
    fontSize: 24,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeUserEmail: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    marginBottom: 8,
  },
  userTypeBadge: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  userTypeText: {
    color: NEO_THEME.colors.black,
    fontSize: 12,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  bottomSpacing: {
    height: 100,
  },
});
