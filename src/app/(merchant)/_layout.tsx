import { Tabs, Redirect, useRouter } from "expo-router";
import { useAuth } from "../../shared/providers/auth-provider";
import {
  ActivityIndicator,
  View,
} from "react-native";
import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TabBar, type TabBarItem } from "../../shared/design-system";

const TABS = [
  { key: 'index', label: 'Dashboard', icon: 'grid' },
  { key: 'catalog', label: 'Catalog', icon: 'storefront' },
  { key: 'create', label: 'Create', icon: 'add-circle' },
  { key: 'community', label: 'Community', icon: 'people' },
  { key: 'profile', label: 'Profile', icon: 'person' },
] as const satisfies readonly TabBarItem[];

const KEYS = TABS.map(tab => tab.key) as readonly string[];

/** Merchant mode reuses the one tab bar — only the destinations change. */
function MerchantTabBar({ state, navigation }: BottomTabBarProps) {
  const active = state.routes[state.index]?.name;
  if (!active || !KEYS.includes(active)) return null;
  const routes = state.routes.filter(route => KEYS.includes(route.name));
  return (
    <TabBar
      activeKey={active}
      items={TABS.filter(tab => routes.some(route => route.name === tab.key))}
      onSelect={key => {
        const route = routes.find(item => item.name === key);
        if (!route) return;
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (route.name === active || event.defaultPrevented) return;
        navigation.navigate(route.name, route.params);
      }}
    />
  );
}

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


