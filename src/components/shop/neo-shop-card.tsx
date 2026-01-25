import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { SCALE, TIMING_CONFIG } from '../../shared/constants/animations';
import { Ionicons } from '@expo/vector-icons';

interface NeoShopCardProps {
  shop: any;
  onPress: () => void;
}

export const NeoShopCard = ({ shop, onPress }: NeoShopCardProps) => {
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
          <Image source={{ uri: shop.image_url }} style={styles.image} />
          {shop.is_open === false && (
            <View style={styles.closedBadge}>
              <Text style={styles.closedText}>CLOSED</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{shop.name}</Text>
            {shop.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={NEO_THEME.colors.yellow} />
                <Text style={styles.ratingText}>{shop.rating}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.categoryTag}>
              <Ionicons name="pricetag" size={14} color={NEO_THEME.colors.black} />
              <Text style={styles.categoryText}>{shop.category?.name || 'SHOP'}</Text>
            </View>
            
            <View style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={20} color={NEO_THEME.colors.white} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    overflow: 'hidden',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.white,
  },
  closedText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 12,
    color: NEO_THEME.colors.white,
    fontWeight: '900',
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
    color: NEO_THEME.colors.black,
    fontWeight: '900',
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  ratingText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.white,
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
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  arrowButton: {
    width: 40,
    height: 40,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
});

