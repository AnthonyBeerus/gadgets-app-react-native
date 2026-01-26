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
  Text,
  StyleSheet,
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
  const { top, bottom } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Large title: fades and translates up
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

  // Small header & Background: fades in
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLDS.smallHeaderFadeStart, SCROLL_THRESHOLDS.smallHeaderFadeEnd],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const headerHeight = 52 + top;

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
      {/* Background (Fades in) */}
      <Animated.View style={[styles.headerBackground, headerAnimatedStyle]} />
      
      {/* Status Bar Spacer */}
      <View style={{ height: top + 10 }} />

      {/* Small Header (Fixed, Fades in) */}
      <Animated.View style={[styles.smallHeader, headerAnimatedStyle]}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
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

      {/* Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Header Content */}
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
                <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
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

      {/* Sticky Footer */}
      {stickyFooter && (
        <View style={[styles.stickyFooter, { paddingBottom: bottom || 20 }]}>
          {stickyFooter}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.background,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Sufficient to cover status bar + small header
    backgroundColor: NEO_THEME.colors.backgroundLight,
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    zIndex: 10,
    // Add a slight shadow to the sticky header
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100, // Matches background
    flexDirection: "row",
    alignItems: "flex-end",
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
    justifyContent: "flex-end",
  },
  smallHeaderRight: {
    marginRight: 0,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  largeHeaderContainer: {
    // Structural container
  },
  largeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  largeBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    borderTopWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    paddingTop: 16,
    paddingHorizontal: 20,
    elevation: 10,
    zIndex: 100,
  },
});
