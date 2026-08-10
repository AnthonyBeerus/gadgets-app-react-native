import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../shared/providers/auth-provider";
import ShopTabBar from "../../components/shop/ShopTabBar";

const TabsLayout = () => {
  const { mounting, isMerchant, activeRole } = useAuth();

  if (mounting) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
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
