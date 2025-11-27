import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

type FilterType = 'ALL' | 'FREE' | 'PREMIUM' | 'AI ALLOWED' | 'ENDING SOON';

interface FilterChipProps {
  label: FilterType;
  type?: 'default' | 'premium' | 'ai' | 'urgent';
  isActive: boolean;
  onPress: () => void;
}

export function FilterChip({ label, type = 'default', isActive, onPress }: FilterChipProps) {
  let activeColor = NEO_THEME.colors.black;
  if (type === 'premium') activeColor = NEO_THEME.colors.yellow;
  if (type === 'ai') activeColor = NEO_THEME.colors.primary;
  if (type === 'urgent') activeColor = NEO_THEME.colors.error;

  const getTextColor = () => {
    if (!isActive) return NEO_THEME.colors.black;
    // Yellow background needs black text, others (Black, Primary, Error) need white
    if (type === 'premium') return NEO_THEME.colors.black;
    return NEO_THEME.colors.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && { backgroundColor: activeColor },
        isActive && type === 'ai' && { borderColor: NEO_THEME.colors.black }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.filterText,
        { color: getTextColor() }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    marginRight: 4,
  },
  filterText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
