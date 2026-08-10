import { Tabs, Redirect, useRouter } from "expo-router";
import { useAuth } from "../../shared/providers/auth-provider";
import {
  ActivityIndicator,
  View,
} from "react-native";
import React from "react";
import MerchantTabBar from "../../components/merchant/MerchantTabBar";

const MerchantTabsLayout = () => {
  const { isMerchant, activeRole, mounting } = useAuth();
  const router = useRouter();
  
  if (mounting) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  // Only allow if actually a merchant AND in merchant mode
  if (!isMerchant) return <Redirect href="/open-shop" />;
  if (activeRole !== 'merchant') return <Redirect href="/(shop)" />;

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


