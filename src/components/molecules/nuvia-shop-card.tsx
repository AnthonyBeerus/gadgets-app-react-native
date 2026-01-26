import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NuviaText } from '../atoms/nuvia-text';
import { NuviaTag } from '../../shared/components/ui/nuvia-tag';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { SCALE, TIMING_CONFIG } from '../../shared/constants/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NuviaShopCardProps {
  shop: {
    id: string | number;
    name: string;
    image_url?: string;
    is_open?: boolean;
    rating?: number | string;
    category?: { name: string };
  };
  onPress: () => void;
}

export const NuviaShopCard: React.FC<NuviaShopCardProps> = ({ shop, onPress }) => {
  const scale = useSharedValue<number>(SCALE.normal);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(SCALE.pressed, TIMING_CONFIG.fast);
  };

  const handlePressOut = () => {
    scale.value = withTiming(SCALE.normal, TIMING_CONFIG.fast);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, rStyle]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: shop.image_url || 'https://via.placeholder.com/400x200' }} 
          style={styles.image} 
          contentFit="cover"
          transition={200}
        />
        {shop.is_open === false && (
          <NuviaTag 
            label="CLOSED" 
            color={NEO_THEME.colors.black} 
            style={styles.closedBadge} 
            textStyle={{ color: NEO_THEME.colors.white }}
          />
        )}
        {shop.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={NEO_THEME.colors.secondary} />
            <NuviaText variant="label" color={NEO_THEME.colors.white} style={{ fontSize: 12 }}>
              {shop.rating}
            </NuviaText>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <NuviaText variant="h3" numberOfLines={1} style={styles.title}>
          {shop.name}
        </NuviaText>
        
        <View style={styles.footer}>
          <NuviaTag 
            label={shop.category?.name || 'SHOP'} 
            color={NEO_THEME.colors.mint} 
          />
          <View style={styles.arrowCircle}>
             <Ionicons name="arrow-forward" size={18} color={NEO_THEME.colors.black} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 20,
    overflow: 'hidden',
    // Hard Shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: NEO_THEME.colors.background,
    borderBottomWidth: 2,
    borderColor: NEO_THEME.colors.black,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.dark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: NEO_THEME.colors.background,
      borderWidth: 1.5,
      borderColor: NEO_THEME.colors.black,
      alignItems: 'center',
      justifyContent: 'center',
  }
});
