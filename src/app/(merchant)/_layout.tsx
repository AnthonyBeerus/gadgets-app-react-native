import { Tabs, Redirect, useRouter } from "expo-router";
import { useAuth } from "../../shared/providers/auth-provider";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, Platform, View } from "react-native";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import React from "react";
import MerchantTabBar from "../../components/merchant/MerchantTabBar";

const MerchantTabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { isMerchant, activeRole, mounting } = useAuth();
  const router = useRouter();
  
  // Only allow if actually a merchant AND in merchant mode
  if (!isMerchant || activeRole !== 'merchant') return <Redirect href="/(shop)" />;

  return (
    <Tabs
      tabBar={(props) => <MerchantTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
        }}
      />
      
      {/* Middle Create Button - Empty listener to open modal */}
        <Tabs.Screen
            name="create"
            options={{
                title: "Create",
            }}
            listeners={() => ({
                tabPress: (e) => {
                    e.preventDefault();
                    router.push('/(modal)/create');
                },
            })}
        />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default MerchantTabsLayout;


