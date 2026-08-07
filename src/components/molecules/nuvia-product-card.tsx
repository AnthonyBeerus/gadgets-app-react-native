import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';
import React from 'react';
import { StyleSheet, Image, View, Pressable, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { NuviaText } from '../atoms/nuvia-text';
import { NuviaTag } from '../../shared/components/ui/nuvia-tag';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { SCALE, TIMING_CONFIG } from '../../shared/constants/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface Product {
    id: string;
    title: string;
    price: number | string;
    heroImage: string;
    category?: string;
}

interface NuviaProductCardProps {
  product: Product;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * NuviaProductCard Molecule
 * Combines image, text, and tagging for a consistent shop experience.
 */
export const NuviaProductCard: React.FC<NuviaProductCardProps> = ({
  product,
  onPress,
  badge,
  badgeColor,
  style,
  testID,
}) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const scale = useSharedValue<number>(SCALE.normal);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(SCALE.pressed, TIMING_CONFIG.fast);
  };

  const handlePressOut = () => {
    scale.value = withTiming(SCALE.normal, TIMING_CONFIG.normal);
  };

  return (
    <AnimatedPressable
      testID={testID}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, rStyle, style]}
    >
      {/* Image Container with Hard Border */}
      <View style={styles.imageWrapper}>
        <Image 
          source={{ uri: product.heroImage }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {badge && (
          <NuviaTag 
            label={badge} 
            color={badgeColor || theme.colors.secondary} 
            style={styles.badge} 
          />
        )}
      </View>

      {/* Product Details */}
      <View style={styles.infoWrapper}>
        <NuviaText variant="bodyBold" numberOfLines={1}>
          {product.title}
        </NuviaText>
        <NuviaText variant="h3" color={theme.colors.primary}>
          ${product.price}
        </NuviaText>
      </View>
    </AnimatedPressable>
  );
};

function createStyles(c) {
  return {
  container: {
    backgroundColor: c.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
    // Hard Shadow
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden',
    backgroundColor: c.background,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  infoWrapper: {
    marginTop: 12,
    gap: 4,
  },
  };
}
