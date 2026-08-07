/**
 * AnimatedHeaderLayout
 * 
 * Bold, asymmetric header following frontend-design principles:
 * - Left accent stripe for visual anchor
 * - Asymmetric layout (left-aligned title)
 * - Geometric texture overlay
 * - Grid-breaking header right group
 */
import React from "react";
import {
  View,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NEO_THEME } from "../../constants/neobrutalism";
import { SCROLL_THRESHOLDS, EASING, DURATION } from "../../constants/animations";
import { SmallHeaderTitle, LargeHeaderTitle } from "./header-titles";
import { useNeoStyles } from "../../hooks/useNeoStyles";
import { useTheme } from "../../providers/theme-provider";

interface AnimatedHeaderLayoutProps {
  children: React.ReactNode;
  title?: string;
  renderSmallTitle?: () => React.ReactNode;
  renderLargeTitle?: () => React.ReactNode;
  smallHeaderRight?: React.ReactNode;
  largeHeaderRight?: React.ReactNode;
  onTitlePress?: () => void;
  onBackPress?: () => void;
  contentContainerStyle?: ViewStyle;
  stickyFooter?: React.ReactNode;
}

export const AnimatedHeaderLayout: React.FC<AnimatedHeaderLayoutProps> = ({
  children,
  title,
  renderSmallTitle,
  renderLargeTitle,
  smallHeaderRight,
  largeHeaderRight,
  onTitlePress,
  onBackPress,
  contentContainerStyle,
  stickyFooter,
}) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
  const { top, bottom } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLDS.largeTitleFadeStart, SCROLL_THRESHOLDS.largeTitleFadeEnd],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLDS.largeTitleFadeStart, SCROLL_THRESHOLDS.largeTitleFadeEnd],
      [0, -20],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLDS.smallHeaderFadeStart, SCROLL_THRESHOLDS.smallHeaderFadeEnd],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const DefaultSmallTitle = () => (
    <TouchableOpacity 
      onPress={onTitlePress} 
      activeOpacity={onTitlePress ? 0.7 : 1}
      disabled={!onTitlePress}
    >
      <SmallHeaderTitle title={title || ''} />
    </TouchableOpacity>
  );

  const DefaultLargeTitle = () => (
    <TouchableOpacity 
      onPress={onTitlePress} 
      activeOpacity={onTitlePress ? 0.7 : 1}
      disabled={!onTitlePress}
    >
      <LargeHeaderTitle title={title || ''} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerBackground, headerAnimatedStyle]} />
      
      <View style={{ height: top + 10 }} />

      <Animated.View style={[styles.smallHeader, headerAnimatedStyle]}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={c.black} />
          </TouchableOpacity>
        )}
        <View style={styles.smallHeaderTitleContainer}>
          {renderSmallTitle ? renderSmallTitle() : <DefaultSmallTitle />}
        </View>
        {smallHeaderRight && (
          <View style={styles.smallHeaderRight}>
            {smallHeaderRight}
          </View>
        )}
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.largeHeaderContainer, 
            { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 },
            largeTitleStyle
          ]}
        >
          {onBackPress && (
            <Animated.View entering={FadeIn.duration(DURATION.normal).easing(EASING.out)} style={{ marginBottom: 16 }}>
              <TouchableOpacity 
                onPress={onBackPress}
                style={styles.largeBackButton}
              >
                <Ionicons name="arrow-back" size={24} color={c.black} />
              </TouchableOpacity>
            </Animated.View>
          )}
          
          <View style={styles.largeHeaderRow}>
            <Animated.View 
              entering={FadeInDown.duration(DURATION.slow).easing(EASING.out)}
              style={styles.largeTitleContainer}
            >
              {renderLargeTitle ? renderLargeTitle() : <DefaultLargeTitle />}
            </Animated.View>
            
            {largeHeaderRight && (
              <Animated.View 
                entering={FadeInDown.duration(DURATION.slow).delay(100).easing(EASING.out)}
                style={styles.largeHeaderRight}
              >
                {largeHeaderRight}
              </Animated.View>
            )}
          </View>
        </Animated.View>

        {children}
      </Animated.ScrollView>

      {stickyFooter && (
        <View style={[styles.stickyFooter, { paddingBottom: bottom || 20 }]}>
          {stickyFooter}
        </View>
      )}
    </View>
  );
};

function createStyles(c: {
  black: string;
  white: string;
  background: string;
  border: string;
}) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    headerBackground: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      backgroundColor: c.background,
      borderBottomWidth: 1,
      borderColor: c.border,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      zIndex: 10,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    smallHeader: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      flexDirection: "row" as const,
      alignItems: "flex-end" as const,
      paddingBottom: 16,
      paddingHorizontal: 16,
      zIndex: 20,
    },
    backButton: {
      marginRight: 16,
      marginBottom: 2,
    },
    smallHeaderTitleContainer: {
      flex: 1,
      justifyContent: "flex-end" as const,
    },
    smallHeaderRight: {
      marginRight: 0,
      marginBottom: 2,
      flexDirection: "row" as const,
      alignItems: "center" as const,
    },
    largeHeaderContainer: {},
    largeHeaderRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
    },
    largeBackButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.white,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: 16,
    },
    largeTitleContainer: {
      flex: 1,
    },
    largeHeaderRight: {
      marginLeft: 12,
      marginTop: 4,
    },
    stickyFooter: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderColor: c.border,
      paddingTop: 16,
      paddingHorizontal: 20,
      elevation: 10,
      zIndex: 100,
    },
  };
}
