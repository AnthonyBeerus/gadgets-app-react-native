import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';
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
        {shop.is_open === false ? (
          <NuviaTag 
            label="CLOSED" 
            color={theme.colors.black} 
            style={styles.closedBadge} 
            textStyle={{ color: theme.colors.white }}
          />
        ) : null}
        {Number(shop.rating) > 0 ? (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={theme.colors.secondary} />
            <NuviaText variant="label" color={theme.colors.white} style={{ fontSize: 12 }}>
              {String(shop.rating)}
            </NuviaText>
          </View>
        ) : null}
      </View>
      
      <View style={styles.content}>
        <NuviaText variant="h3" numberOfLines={1} style={styles.title}>
          {shop.name}
        </NuviaText>
        
        <View style={styles.footer}>
          <NuviaTag 
            label={shop.category?.name || 'SHOP'} 
            color={theme.colors.mint} 
          />
          <View style={styles.arrowCircle}>
             <Ionicons name="arrow-forward" size={18} color={theme.colors.black} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

function createStyles(c) {
  return {
  container: {
    backgroundColor: c.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.border,
    marginBottom: 20,
    overflow: 'hidden',
    // Hard Shadow
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: c.background,
    borderBottomWidth: 1,
    borderColor: c.border,
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
    backgroundColor: c.dark,
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
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
  }
  };
}
