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
            color={badgeColor || NEO_THEME.colors.secondary} 
            style={styles.badge} 
          />
        )}
      </View>

      {/* Product Details */}
      <View style={styles.infoWrapper}>
        <NuviaText variant="bodyBold" numberOfLines={1}>
          {product.title}
        </NuviaText>
        <NuviaText variant="h3" color={NEO_THEME.colors.primary}>
          ${product.price}
        </NuviaText>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    // Hard Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: NEO_THEME.colors.black,
    overflow: 'hidden',
    backgroundColor: NEO_THEME.colors.background,
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
});
