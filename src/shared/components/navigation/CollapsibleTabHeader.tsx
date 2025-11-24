import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useCollapsibleTab } from '../../context/CollapsibleTabContext';

interface CollapsibleTabHeaderProps extends MaterialTopTabBarProps {
  title: string;
  subtitle?: string;
  renderHeaderRight?: (props: { small?: boolean }) => React.ReactNode;
  tabNames?: Record<string, string>;
}

export const CollapsibleTabHeader: React.FC<CollapsibleTabHeaderProps> = ({ 
  state, 
  descriptors, 
  navigation,
  title,
  subtitle,
  renderHeaderRight,
  tabNames
}) => {
  const { top } = useSafeAreaInsets();
  const { scrollY, headerHeight, smallHeaderHeight, tabBarHeight } = useCollapsibleTab();

  const getDisplayTitle = (routeName: string) => {
    if (tabNames && tabNames[routeName]) {
      return tabNames[routeName];
    }
    return routeName.toUpperCase();
  };

  const scrollDistance = headerHeight - smallHeaderHeight;

  // Animate the entire header container up/down
  const containerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [0, -scrollDistance],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  // Animate the large title opacity/scale
  const largeHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, scrollDistance * 0.5],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Animate the small header (sticky) opacity
  const smallHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [scrollDistance * 0.5, scrollDistance],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.headerWrapper, { paddingTop: top }, containerStyle]}>
      
      {/* Header Area Container */}
      <View style={{ height: headerHeight }}>
        
        {/* Large Title Area (Fades Out) */}
        <Animated.View style={[styles.largeTitleContainer, largeHeaderStyle]}>
          <View style={styles.largeTitleRow}>
            <View>
              <Text style={styles.largeHeaderTitle}>{title}</Text>
              {subtitle && <Text style={styles.largeHeaderSubtitle}>{subtitle}</Text>}
            </View>
            {renderHeaderRight && renderHeaderRight({ small: false })}
          </View>
        </Animated.View>

        {/* Small Header Area (Fades In, positioned at bottom of header area) */}
        <Animated.View 
          style={[
            styles.smallHeaderContainer, 
            { height: smallHeaderHeight, top: scrollDistance }, 
            smallHeaderStyle
          ]}
        >
           <Text style={styles.smallHeaderTitle}>{title}</Text>
           {renderHeaderRight && renderHeaderRight({ small: true })}
        </Animated.View>

      </View>

      {/* Tab Bar (Sticky Part, sits below Header Area) */}
      <View style={[styles.tabBarContainer, { height: tabBarHeight }]}>
        {state.routes.map((route: { key: any; name: string; params?: any }, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, params: route.params, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused,
                index < state.routes.length - 1 && styles.tabItemBorder,
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isFocused && styles.tabLabelFocused,
                ]}
                numberOfLines={1}
              >
                {getDisplayTitle(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  largeTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  largeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  largeHeaderSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: 'uppercase',
  },
  smallHeaderContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    zIndex: 20,
  },
  smallHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  tabBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
    overflow: 'hidden',
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: NEO_THEME.colors.white,
  },
  tabItemFocused: {
    backgroundColor: NEO_THEME.colors.primary,
  },
  tabItemBorder: {
    borderRightWidth: NEO_THEME.borders.width,
    borderRightColor: NEO_THEME.colors.black,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tabLabelFocused: {
    color: NEO_THEME.colors.white,
  },
});
