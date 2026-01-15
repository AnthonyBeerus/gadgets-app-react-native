import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { NEO_THEME } from '../../shared/constants/neobrutalism';

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
             <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'white', borderRadius: 15, padding: 4, borderWidth: 2 }}>
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
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems:'center', justifyContent:'center'}}>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'black',
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    minHeight: 140,
  },
  compactCard: {
      flexDirection: 'column',
      // width: 160, // REMOVED: Let parent control width via style prop
      minHeight: 220,
      padding: 0,
  },
  imageContainer: {
    width: 120, // Keep this for default
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  compactImageContainer: {
      width: '100%',
      height: 140,
      marginBottom: -25, // layout tweak overlap
      zIndex: 1,
      alignItems: 'center', // Center image
      justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: 'white',
    transform: [{ rotate: '-3deg' }],
  },
  compactImage: {
      width: 110, // Slightly smaller to fit
      height: 110,
      marginTop: 10,
      transform: [{ rotate: '3deg' }],
  },
  cardContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    justifyContent: 'space-between',
  },
  compactCardContent: {
      padding: 8, // Reduced padding
      paddingBottom: 12,
      justifyContent: 'flex-end',
      paddingTop: 30, // Make room for image overlap
      zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
  },
  categoryText: {
    fontSize: 10,
    fontFamily: NEO_THEME.fonts.bold,
    color: 'black',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.black,
    color: 'black',
    textTransform: 'uppercase',
    marginBottom: 8,
    lineHeight: 22,
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  compactTitle: {
    fontSize: 13, // Smaller font
    lineHeight: 15,
    marginBottom: 4,
    textAlign: 'center', // Center title
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  compactFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 6, // Tighter padding
    paddingVertical: 4,
    marginTop: 'auto',
    width: '100%', // Full width pill
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: NEO_THEME.fonts.bold,
    color: '#333',
    marginBottom: -2,
  },
  price: {
    fontSize: 24,
    fontFamily: NEO_THEME.fonts.black,
    color: 'black',
  },
  compactPrice: {
    fontSize: 14, // Smaller price font
    fontWeight: '900',
  },
  actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  durationBadge: {
    backgroundColor: 'black',
    paddingHorizontal: 8, 
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: 'white',
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
  },
});
