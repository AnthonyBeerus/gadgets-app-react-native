import { Redirect, Tabs, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Platform, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useAuth } from "../../shared/providers/auth-provider";
import ShopTabBar from "../../components/shop/ShopTabBar";
import { consumeOpenShopIntent } from "../../features/merchant/open-shop-intent";

const TabsLayout = () => {
  const router = useRouter();
  const { session, mounting, isMerchant, activeRole } = useAuth();
  const insets = useSafeAreaInsets();
  const intentHandled = useRef(false);

  useEffect(() => {
    if (mounting || !session || isMerchant || intentHandled.current) return;
    intentHandled.current = true;
    consumeOpenShopIntent()
      .then(shouldOpen => {
        if (shouldOpen) router.replace("/open-shop");
      })
      .catch(() => undefined);
  }, [mounting, session, isMerchant, router]);

  if (mounting) return <ActivityIndicator />;
  if (isMerchant && activeRole === 'merchant') return <Redirect href="/(merchant)" />;

  return (
    <Tabs
      tabBar={(props) => <ShopTabBar {...props} />}
      screenOptions={{
        headerShown: false, // Reverted - screens use AnimatedHeaderLayout
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Shops",
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Creator Opportunities",
          href: null,
        }}
      />

    </Tabs>
  );
};

export default TabsLayout;
