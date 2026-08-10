import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { TabBarShell, useDesignTokens } from '../../shared/design-system';

const names = ['index', 'marketplace', 'activity', 'profile'] as const;
const labels = { index: 'Discover', marketplace: 'Shops', activity: 'Activity', profile: 'Profile' } as const;
const icons = { index: 'flame', marketplace: 'storefront', activity: 'pulse', profile: 'person' } as const;

export default function ShopTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useDesignTokens();
  const routes = state.routes.filter(route => names.includes(route.name as typeof names[number]));
  const active = state.routes[state.index]?.name;
  if (!active || !names.includes(active as typeof names[number])) return null;
  return <TabBarShell
    activeKey={active}
    items={routes.map(route => { const name = route.name as typeof names[number]; return { key: name, label: labels[name], icon: <Ionicons name={icons[name]} size={20} color={name === active ? colors.ink : colors.inkMuted} /> }; })}
    onSelect={key => { const route = routes.find(item => item.name === key); if (!route || route.name === active) return; navigation.navigate(route.name, route.params); }}
  />;
}
