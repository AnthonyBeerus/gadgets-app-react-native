import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NeoView } from '../ui/neo-view';
import { NEO_THEME } from '../../constants/neobrutalism';
import { Ionicons } from '@expo/vector-icons';

interface NeoShopCardProps {
  shop: any;
  onPress: () => void;
}

export const NeoShopCard = ({ shop, onPress }: NeoShopCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <NeoView style={styles.card} shadowOffset={5} containerStyle={styles.cardContainer}>
        <Image source={{ uri: shop.image_url }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{shop.name}</Text>
          
          <View style={styles.footer}>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>$45.00</Text>
            </View>
            
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </NeoView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    flex: 1,
    marginHorizontal: 6,
  },
  cardContainer: {
    alignSelf: 'stretch', // Card should fill its grid column
  },
  card: {
    backgroundColor: NEO_THEME.colors.white,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.black,
    color: NEO_THEME.colors.black,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontWeight: '900',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: NEO_THEME.colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
});
