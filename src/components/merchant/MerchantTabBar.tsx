import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function MerchantTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  // Route Names: 'index', 'catalog', 'create', 'community', 'profile'
  // FAB: 'create'
  // Pill: others

  const fabRouteName = 'create';
  const fabRoute = state.routes.find((r: any) => r.name === fabRouteName);
  const pillRoutes = state.routes.filter((r: any) => r.name !== fabRouteName);

  // Animation style (placeholder)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(0, { duration: 300 }) }],
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20 },
        animatedStyle,
      ]}
    >
      {/* 1. Left Pill - Navigation Items */}
      <View style={styles.pillContainer}>
        {pillRoutes.map((route: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.indexOf(route);

          let iconName: any = 'circle';
          
          if (route.name === 'index') { iconName = 'dashboard'; }
          else if (route.name === 'catalog') { iconName = 'store'; }
          else if (route.name === 'community') { iconName = 'groups'; }
          else if (route.name === 'profile') { iconName = 'person'; }

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
              style={styles.tabItem}
            >
              <MaterialIcons
                name={iconName}
                size={24}
                color={isFocused ? NEO_THEME.colors.primary : NEO_THEME.colors.grey}
              />
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Right FAB - Create Button */}
      {fabRoute && (
        <TouchableOpacity
          onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: fabRoute.key,
                canPreventDefault: true,
              });
              // The listener in _layout.tsx calls preventDefault() and navigates to modal
              // So we don't need default navigation here if prevented.
              if (!event.defaultPrevented) {
                navigation.navigate(fabRoute.name, fabRoute.params);
              }
          }}
          activeOpacity={0.8}
          style={styles.fab}
        >
          <MaterialIcons name="add" size={32} color="white" />
        </TouchableOpacity>
      )}
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
    pointerEvents: 'box-none',
  },
  pillContainer: {
    flex: 1,
    marginRight: 16,
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#F5F5F5', 
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    // Neobrutalist Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEO_THEME.colors.primary,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: NEO_THEME.colors.primary,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    // Neobrutalist Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
});
