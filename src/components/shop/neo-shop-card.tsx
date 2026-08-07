import React from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';
import { SCALE, TIMING_CONFIG } from '../../shared/constants/animations';
import { Ionicons } from '@expo/vector-icons';

interface NeoShopCardProps {
  shop: any;
  onPress: () => void;
}

export const NeoShopCard = ({ shop, onPress }: NeoShopCardProps) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const scale = useSharedValue<number>(SCALE.normal);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(SCALE.pressed, TIMING_CONFIG.fast);
  };

  const handlePressOut = () => {
    scale.value = withTiming(SCALE.normal, TIMING_CONFIG.fast);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}> 
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1} 
        style={styles.card}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: shop.image_url }} 
            style={styles.image} 
            contentFit="cover"
            transition={200}
          />
          {shop.is_open === false ? (
            <View style={styles.closedBadge}>
              <Text style={styles.closedText}>CLOSED</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{shop.name}</Text>
            {Number(shop.rating) > 0 ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={theme.colors.yellow} />
                <Text style={styles.ratingText}>{String(shop.rating)}</Text>
              </View>
            ) : null}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.categoryTag}>
              <Ionicons name="pricetag" size={14} color={theme.colors.black} />
              <Text style={styles.categoryText}>{shop.category?.name || 'SHOP'}</Text>
            </View>
            
            <View style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.white} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

function createStyles(c) {
  return {
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: c.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: c.white,
  },
  closedText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 12,
    color: c.white,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.black,
    color: c.black,
    fontWeight: '600',
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  ratingText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: c.white,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
    color: c.black,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  arrowButton: {
    width: 40,
    height: 40,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: c.border,
  },
  };
}

