import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "../../shared/providers/auth-provider";
import { TabBar, type TabBarItem } from "../../shared/design-system";

const TABS = [
  { key: 'index', label: 'Discover', icon: 'flame' },
  { key: 'marketplace', label: 'Shops', icon: 'storefront' },
  { key: 'entries', label: 'My entries', icon: 'pulse' },
  { key: 'profile', label: 'Profile', icon: 'person' },
] as const satisfies readonly TabBarItem[];

const KEYS = TABS.map(tab => tab.key) as readonly string[];

function ShopTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index]?.name;
  if (!active || !KEYS.includes(active)) return null;
  const routes = state.routes.filter(route => KEYS.includes(route.name));
  return (
    <TabBar
      activeKey={active}
      items={TABS.filter(tab => routes.some(route => route.name === tab.key))}
      onSelect={key => {
        const route = routes.find(item => item.name === key);
        if (!route || route.name === active) return;
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!event.defaultPrevented) navigation.navigate(route.name, route.params);
      }}
    />
  );
}

const TabsLayout = () => {
  const { mounting, isMerchant, activeRole } = useAuth();

  if (mounting) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  if (isMerchant && activeRole === 'merchant') return <Redirect href="/(merchant)" />;

  return (
    <Tabs
      tabBar={(props) => <ShopTabBar {...props} />}
      screenOptions={{
        headerShown: false, // Screens own their headers via ScreenHeader.
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
        name="entries"
        options={{
          title: "My entries",
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
