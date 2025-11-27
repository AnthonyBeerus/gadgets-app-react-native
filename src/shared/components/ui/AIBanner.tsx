import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../constants/neobrutalism';

interface AIBannerProps {
  onPress: () => void;
}

export function AIBanner({ onPress }: AIBannerProps) {
  return (
    <TouchableOpacity 
      style={styles.aiBanner}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.aiBannerContent}>
        <View style={styles.aiIconBox}>
          <Ionicons name="sparkles" size={24} color={NEO_THEME.colors.white} />
        </View>
        <View style={styles.aiBannerText}>
          <Text style={styles.aiBannerTitle}>NEED AN EDGE?</Text>
          <Text style={styles.aiBannerDesc}>Use AI Tools to create winning content</Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color={NEO_THEME.colors.white} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  aiBanner: {
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: NEO_THEME.colors.white,
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
    marginBottom: 2,
  },
  aiBannerDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.greyLight,
  },
});
