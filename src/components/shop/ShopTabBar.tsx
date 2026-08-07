import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { NuviaText } from '../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useCartStore } from '../../store/cart-store';

/** Primary shop tabs — mirrors Yapanese: left pill + right FAB. */
const pillRoutes = ['index', 'marketplace', 'profile'] as const;

type PillRoute = (typeof pillRoutes)[number];

function routeIcon(name: PillRoute): keyof typeof Ionicons.glyphMap {
  if (name === 'index') return 'flame';
  if (name === 'marketplace') return 'storefront';
  return 'person';
}

function routeLabel(name: PillRoute) {
  if (name === 'index') return 'Discover';
  if (name === 'marketplace') return 'Marketplace';
  return 'Profile';
}

export default function ShopTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const itemCount = useCartStore(s => s.getItemCount());
  const focusedRoute = state.routes[state.index]?.name;

  if (!focusedRoute || !pillRoutes.includes(focusedRoute as PillRoute)) {
    return null;
  }

  const routes = state.routes.filter(route =>
    pillRoutes.includes(route.name as PillRoute),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(0, { duration: 300 }) }],
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        { bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20 },
        animatedStyle,
      ]}
    >
      {/* Left pill — navigation */}
      <View style={styles.pill}>
        {routes.map(route => {
          const index = state.routes.indexOf(route);
          const focused = state.index === index;
          const name = route.name as PillRoute;
          const title =
            descriptors[route.key]?.options?.title?.toString() ?? routeLabel(name);

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={title}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={styles.tab}
            >
              {focused ? <View style={styles.activeHalo} /> : null}
              <Ionicons
                name={routeIcon(name)}
                size={focused ? 26 : 24}
                color={focused ? NEO_THEME.colors.primary : NEO_THEME.colors.grey}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Right FAB — bag (cart + saved) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={itemCount > 0 ? `Bag, ${itemCount} items` : 'Bag and saved'}
        onPress={() => router.push('/bag')}
        style={styles.fab}
      >
        <Ionicons name="bag-handle" size={28} color={NEO_THEME.colors.white} />
        {itemCount > 0 ? (
          <View style={styles.badge}>
            <NuviaText variant="caption" style={styles.badgeText}>
              {itemCount > 9 ? '9+' : String(itemCount)}
            </NuviaText>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
  },
  pill: {
    flex: 1,
    marginRight: 16,
    flexDirection: 'row',
    height: 64,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: NEO_THEME.colors.secondary,
    opacity: 0.55,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.secondary,
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
  },
});
