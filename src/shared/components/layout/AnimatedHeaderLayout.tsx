import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NEO_THEME } from "../../constants/neobrutalism";

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
}) => {
  const { top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, 40],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ scale }] };
  });

  const smallHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [40, 80],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [40, 80],
      [20, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const headerHeight = 60 + top;

  const DefaultSmallTitle = () => (
    <TouchableOpacity 
      onPress={onTitlePress} 
      activeOpacity={onTitlePress ? 0.7 : 1}
      disabled={!onTitlePress}
    >
      <Text style={styles.smallHeaderTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const DefaultLargeTitle = () => (
    <TouchableOpacity 
      onPress={onTitlePress} 
      activeOpacity={onTitlePress ? 0.7 : 1}
      disabled={!onTitlePress}
    >
      <Text style={styles.largeHeaderTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Small Header (Fixed) */}
      <Animated.View
        style={[
          styles.smallHeader,
          { height: headerHeight, paddingTop: top },
          smallHeaderStyle,
        ]}
      >
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
          </TouchableOpacity>
        )}
        <View style={styles.smallHeaderContent}>
          {renderSmallTitle ? renderSmallTitle() : <DefaultSmallTitle />}
        </View>
        {smallHeaderRight && (
          <View style={styles.smallHeaderRight}>{smallHeaderRight}</View>
        )}
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={[
          {
            paddingTop: headerHeight + 10,
            paddingBottom: 100,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Header (Scrolls) */}
        <Animated.View style={[styles.largeHeaderContainer, largeTitleStyle]}>
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.largeBackButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={28} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          )}
          <View style={styles.largeHeaderRow}>
            <View style={{ flex: 1 }}>
              {renderLargeTitle ? renderLargeTitle() : <DefaultLargeTitle />}
            </View>
            {largeHeaderRight && (
              <View style={styles.largeHeaderRight}>{largeHeaderRight}</View>
            )}
          </View>
        </Animated.View>

        <View style={styles.content}>{children}</View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  smallHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
  },
  smallHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  smallHeaderRight: {
    position: "absolute",
    right: 16,
    bottom: 12, // Approximate alignment
  },
  largeHeaderContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  largeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  largeHeaderTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 32,
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  largeHeaderRight: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 12,
    padding: 4,
    zIndex: 20,
  },
  largeBackButton: {
    marginBottom: 12,
    padding: 4,
  },
});
