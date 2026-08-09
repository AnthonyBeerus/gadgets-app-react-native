import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radii, space, useDesignTokens } from '../../shared/design-system';
const pillRoutes = ['index', 'marketplace', 'activity', 'profile'] as const;
type PillRoute = (typeof pillRoutes)[number];

function routeIcon(name: PillRoute): keyof typeof Ionicons.glyphMap {
  if (name === 'index') return 'flame';
  if (name === 'marketplace') return 'storefront';
  if (name === 'activity') return 'pulse';
  return 'person';
}

function routeLabel(name: PillRoute) {
  if (name === 'index') return 'Discover';
  if (name === 'marketplace') return 'Marketplace';
  if (name === 'activity') return 'Activity';
  return 'Profile';
}

export default function ShopTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, elevation } = useDesignTokens();
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
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            ...elevation.soft,
          },
        ]}
      >
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
              style={[styles.tab, focused && { backgroundColor: colors.gray100 }]}
            >
              <Ionicons
                name={routeIcon(name)}
                size={22}
                color={focused ? colors.ink : colors.inkMuted}
              />
            </Pressable>
          );
        })}
      </View>

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
    paddingHorizontal: space.md,
    height: 64,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: space.xxs,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: radii.md,
  },
});
