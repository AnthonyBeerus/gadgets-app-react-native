import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NuviaText } from '../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../shared/constants/neobrutalism';

const visibleRoutes = ['index', 'marketplace'];

export default function ShopTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter(route => visibleRoutes.includes(route.name));

  return (
    <View pointerEvents="box-none" style={[styles.shell, { paddingBottom: Math.max(10, insets.bottom) }]}>
      <View style={styles.bar}>
        {routes.map(route => {
          const index = state.routes.indexOf(route);
          const focused = state.index === index;
          const label = route.name === 'index' ? 'DISCOVER' : 'MARKETPLACE';
          const icon = route.name === 'index' ? 'flame' : 'search';
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={descriptors[route.key]?.options?.title?.toString() ?? label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              style={[styles.tab, focused && styles.activeTab]}
            >
              <Ionicons name={icon} size={23} color={NEO_THEME.colors.black} />
              <NuviaText variant="caption" style={styles.label}>{label}</NuviaText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { position: 'absolute', left: 20, right: 20, bottom: 0 },
  bar: { height: 64, flexDirection: 'row', gap: 8, borderWidth: 3, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.white, padding: 6, boxShadow: '5px 5px 0px #000000' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderRadius: 999 },
  activeTab: { backgroundColor: NEO_THEME.colors.secondary, borderWidth: 2, borderColor: NEO_THEME.colors.black },
  label: { fontFamily: NEO_THEME.fonts.bold },
});
