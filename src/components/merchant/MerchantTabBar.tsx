import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radii, space, useDesignTokens } from '../../shared/design-system';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const visibleRoutes = ['index', 'catalog', 'create', 'community', 'profile'] as const;

export default function MerchantTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, elevation } = useDesignTokens();
  const focusedRoute = state.routes[state.index]?.name;
  if (!focusedRoute || !visibleRoutes.includes(focusedRoute as (typeof visibleRoutes)[number])) {
    return null;
  }

  const fabRouteName = 'create';
  const fabRoute = state.routes.find((r: any) => r.name === fabRouteName);
  const pillRoutes = state.routes.filter((r: any) =>
    r.name !== fabRouteName && visibleRoutes.includes(r.name as (typeof visibleRoutes)[number]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(0, { duration: 300 }) }],
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20 },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.pillContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            ...elevation.soft,
          },
        ]}
      >
        {pillRoutes.map((route: any) => {
          const isFocused = state.index === state.routes.indexOf(route);

          let iconName: any = 'circle';
          if (route.name === 'index') iconName = 'dashboard';
          else if (route.name === 'catalog') iconName = 'store';
          else if (route.name === 'community') iconName = 'groups';
          else if (route.name === 'profile') iconName = 'person';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[styles.tabItem, isFocused && { backgroundColor: colors.gray100 }]}
            >
              <MaterialIcons
                name={iconName}
                size={22}
                color={isFocused ? colors.ink : colors.inkMuted}
              />
              {isFocused ? (
                <View style={[styles.activeDot, { backgroundColor: colors.ink }]} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {fabRoute ? (
        <TouchableOpacity
          onPress={() => {
            const event = navigation.emit({
              type: 'tabPress',
              target: fabRoute.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(fabRoute.name, fabRoute.params);
            }
          }}
          activeOpacity={0.8}
          style={[styles.fab, { backgroundColor: colors.ink, ...elevation.soft }]}
        >
          <MaterialIcons name="add" size={28} color={colors.surface} />
        </TouchableOpacity>
      ) : null}
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
    pointerEvents: 'box-none',
  },
  pillContainer: {
    flex: 1,
    marginRight: space.md,
    flexDirection: 'row',
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: space.xxs,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: radii.md,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
