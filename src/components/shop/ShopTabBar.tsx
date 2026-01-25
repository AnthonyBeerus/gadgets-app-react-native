import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function ShopTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Route Names: 'index' (Shop), 'services', 'challenges', 'events', 'profile'
  // FAB: 'challenges'
  // Pill: others

  const fabRouteName = 'challenges';
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
          let IconComp: any = MaterialIcons;

          if (route.name === 'index') { iconName = 'storefront'; }
          else if (route.name === 'services') { iconName = 'medical-services'; }
          else if (route.name === 'events') { iconName = 'event'; }
          else if (route.name === 'profile') { iconName = 'person'; }
          else if (route.name === 'challenges') { 
              // Should be handled by FAB, but failsafe
              iconName = 'emoji-events'; 
          }

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
              <IconComp
                name={iconName}
                size={24}
                color={isFocused ? NEO_THEME.colors.primary : NEO_THEME.colors.grey}
              />
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Right FAB - Challenges Button */}
      {fabRoute && (
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
          style={styles.fab}
        >
            {/* Using FontAwesome Trophy for Challenges to match previous icon choice or similar */}
          <MaterialIcons name="emoji-events" size={32} color={NEO_THEME.colors.black} />
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
    backgroundColor: NEO_THEME.colors.white, 
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
    backgroundColor: NEO_THEME.colors.secondary, // Yellow Pop
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
