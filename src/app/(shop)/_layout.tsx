import { Redirect, Tabs } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Platform, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../shared/providers/auth-provider";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import ShopTabBar from "../../components/shop/ShopTabBar";

const TabsLayout = () => {
  const { session, mounting, isMerchant, activeRole } = useAuth();
  const insets = useSafeAreaInsets();

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
          title: "Marketplace",
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          href: null,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Creator Opportunities",
          href: null,
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
