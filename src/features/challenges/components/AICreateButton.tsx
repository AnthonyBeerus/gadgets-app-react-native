import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface AICreateButtonProps {
  onPress: () => void;
  gemCost?: number;
}

export function AICreateButton({ onPress, gemCost = 10 }: AICreateButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.aiCreateButton}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.aiCreateIcon}>
        <Ionicons name="sparkles" size={24} color={NEO_THEME.colors.white} />
      </View>
      <View style={styles.aiCreateContent}>
        <Text style={styles.aiCreateTitle}>CREATE WITH AI</Text>
        <Text style={styles.aiCreateSubtitle}>Stand out with professional AI tools</Text>
      </View>
      <View style={styles.gemCost}>
        <Ionicons name="diamond" size={12} color={NEO_THEME.colors.black} />
        <Text style={styles.gemCostText}>FROM {gemCost}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  aiCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 16,
    gap: 12,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  aiCreateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCreateContent: {
    flex: 1,
  },
  aiCreateTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
  },
  aiCreateSubtitle: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.white,
  },
  gemCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  gemCostText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
