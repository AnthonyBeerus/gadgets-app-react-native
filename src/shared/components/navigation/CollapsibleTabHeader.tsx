import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useCollapsibleTab } from '../../context/CollapsibleTabContext';
import { useNeoStyles } from '../../hooks/useNeoStyles';

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
  const styles = useNeoStyles(createStyles);
  const { top } = useSafeAreaInsets();
  const { scrollY, headerHeight, smallHeaderHeight, tabBarHeight } = useCollapsibleTab();

  const getDisplayTitle = (routeName: string) => {
    if (tabNames && tabNames[routeName]) {
      return tabNames[routeName];
    }
    return routeName.toUpperCase();
  };

  const scrollDistance = headerHeight - smallHeaderHeight;

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
      <View style={{ height: headerHeight }}>
        <Animated.View style={[styles.largeTitleContainer, largeHeaderStyle]}>
          <View style={styles.largeTitleRow}>
            <View>
              <Text style={styles.largeHeaderTitle}>{title}</Text>
              {subtitle && <Text style={styles.largeHeaderSubtitle}>{subtitle}</Text>}
            </View>
            {renderHeaderRight && renderHeaderRight({ small: false })}
          </View>
        </Animated.View>

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

function createStyles(c: {
  black: string;
  white: string;
  grey: string;
  border: string;
  background: string;
  primary: string;
}) {
  return {
    headerWrapper: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: c.background,
    },
    largeTitleContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    largeTitleRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
    largeHeaderTitle: {
      fontSize: 32,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.black,
      textTransform: 'uppercase' as const,
    },
    largeHeaderSubtitle: {
      fontSize: 14,
      color: c.grey,
      marginTop: 4,
      fontWeight: '700' as const,
      fontFamily: NEO_THEME.fonts.bold,
      textTransform: 'uppercase' as const,
    },
    smallHeaderContainer: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 20,
      backgroundColor: c.background,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      zIndex: 20,
    },
    smallHeaderTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.black,
      textTransform: 'uppercase' as const,
    },
    tabBarContainer: {
      flexDirection: 'row' as const,
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: NEO_THEME.borders.radius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.white,
      overflow: 'hidden' as const,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 4,
      backgroundColor: c.white,
    },
    tabItemFocused: {
      backgroundColor: c.primary,
    },
    tabItemBorder: {
      borderRightWidth: 1,
      borderRightColor: c.black,
    },
    tabLabel: {
      fontSize: 12,
      fontFamily: NEO_THEME.fonts.bold,
      color: c.black,
      fontWeight: '700' as const,
      textTransform: 'uppercase' as const,
    },
    tabLabelFocused: {
      color: c.white,
    },
  };
}
