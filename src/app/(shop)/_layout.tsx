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
  if (!session) return <Redirect href="/auth" />;
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
          title: "Shop",
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
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

export default TabsLayout;
