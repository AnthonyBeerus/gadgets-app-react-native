import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../shared/hooks/useNeoStyles';
import { useTheme } from '../../shared/providers/theme-provider';

interface PopProductCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    price: number | string;
    image_url?: string;
    heroImage?: string;
    imagesUrl?: string[];
    category?: { name: string } | string;
    description?: string;
    duration_minutes?: number; // For services
    shop_id?: number;
  };
  index: number;
  onPress?: () => void;
  actionButton?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  type?: 'product' | 'service';
  variant?: 'default' | 'compact';
}

export const PopProductCard: React.FC<PopProductCardProps> = ({ 
  item, 
  index, 
  onPress, 
  actionButton,
  style,
  type = 'product',
  variant = 'default'
}) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  // Robust image source logic
  const imageSource = item.heroImage 
    ? { uri: item.heroImage } 
    : (item.imagesUrl && item.imagesUrl[0]) 
      ? { uri: item.imagesUrl[0] } 
      : item.image_url 
        ? { uri: item.image_url }
        : { uri: 'https://placehold.co/100' };

  const isCompact = variant === 'compact';
  const backgroundColor = NEO_THEME.pastels[index % NEO_THEME.pastels.length];
  const title = item.title || item.name || 'UNTITLED';
  const price = (Number(item.price) || 0).toFixed(2);
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;

  const CardContent = (
    <View style={[
        styles.card, 
        { backgroundColor }, 
        isCompact && styles.compactCard,
        style
    ]}>
      {/* Compact Header: Title Top */}
      {isCompact && (
          <View style={{ padding: 12, paddingBottom: 0 }}>
             <Text style={[styles.title, styles.compactTitle]} numberOfLines={2}>{title}</Text>
             <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryName || 'Item'}</Text>
             </View>
          </View>
      )}

      <View style={[styles.imageContainer, isCompact && styles.compactImageContainer]}>
        <Image 
            source={imageSource}
            style={[styles.image, isCompact && styles.compactImage]} 
            resizeMode="cover"
        />
        {/* Absolute Star Icon for Compact */}
        {isCompact && (
             <View style={[styles.compactStarBadge, { backgroundColor: theme.colors.white, borderColor: theme.colors.border }]}>
                 <Text style={{ fontSize: 12 }}>⭐</Text>
             </View>
        )}
      </View>

      <View style={[styles.cardContent, isCompact && styles.compactCardContent]}>
        {!isCompact && (
            <>
                <View style={styles.headerRow}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{categoryName || (type === 'service' ? 'Service' : 'Item')}</Text>
                    </View>
                </View>
            
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
            </>
        )}
        
        <View style={isCompact ? styles.compactFooterRow : styles.footerRow}>
          <View>
            {!isCompact && <Text style={styles.priceLabel}>Price</Text>}
            <Text style={[styles.price, isCompact && styles.compactPrice]}>${price}</Text>
          </View>
          
          <View style={styles.actionsContainer}>
             {type === 'service' && item.duration_minutes && !isCompact && (
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration_minutes}m</Text>
                </View>
             )}
             {actionButton || (isCompact ? (
                  <View style={[styles.compactCartButton, { borderColor: theme.colors.border }]}>
                      <Text style={{fontSize: 10}}>🛒</Text>
                  </View>
             ) : null)}
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
      return (
          <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
              {CardContent}
          </TouchableOpacity>
      );
  }

  return CardContent;
};

function createStyles(c) {
  return {
  card: {
    flexDirection: 'row' as const,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden' as const,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
  },
  compactCard: {
      flexDirection: 'column' as const,
      minHeight: 220,
      padding: 0,
  },
  imageContainer: {
    width: 120,
    backgroundColor: 'transparent',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 10,
  },
  compactImageContainer: {
      width: '100%' as const,
      height: 140,
      marginBottom: -25,
      zIndex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.white,
    backgroundColor: c.white,
    transform: [{ rotate: '-3deg' }],
  },
  compactImage: {
      width: 110,
      height: 110,
      marginTop: 10,
      transform: [{ rotate: '3deg' }],
  },
  compactStarBadge: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
    borderRadius: 15,
    padding: 4,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    justifyContent: 'space-between' as const,
  },
  compactCardContent: {
      padding: 8,
      paddingBottom: 12,
      justifyContent: 'flex-end' as const,
      paddingTop: 30,
      zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: c.white,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: NEO_THEME.fonts.bold,
    color: c.black,
    textTransform: 'uppercase' as const,
  },
  title: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.black,
    color: c.black,
    textTransform: 'uppercase' as const,
    marginBottom: 8,
    lineHeight: 22,
    textShadowColor: c.white,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  compactTitle: {
    fontSize: 13,
    lineHeight: 15,
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  footerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
  },
  compactFooterRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: c.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginTop: 'auto' as const,
    width: '100%' as const,
  },
  compactCartButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: NEO_THEME.fonts.bold,
    color: c.grey,
    marginBottom: -2,
  },
  price: {
    fontSize: 24,
    fontFamily: NEO_THEME.fonts.black,
    color: c.black,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  actionsContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
  },
  durationBadge: {
    backgroundColor: c.black,
    paddingHorizontal: 8, 
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: c.white,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
  },
  };
}
