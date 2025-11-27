import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface AIPromoCardProps {
  onPress: () => void;
}

export function AIPromoCard({ onPress }: AIPromoCardProps) {
  return (
    <TouchableOpacity 
      style={styles.aiPromo}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.aiPromoIcon}>
        <Ionicons name="color-wand" size={20} color={NEO_THEME.colors.white} />
      </View>
      <View style={styles.aiPromoContent}>
        <Text style={styles.aiPromoTitle}>NEED AN EDGE?</Text>
        <Text style={styles.aiPromoText}>Use AI Tools to create winning content</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={NEO_THEME.colors.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  aiPromo: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 12,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  aiPromoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPromoContent: {
    flex: 1,
  },
  aiPromoTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  aiPromoText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
