import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

type FilterType = 'ALL' | 'FREE' | 'PREMIUM' | 'ENDING SOON';

interface FilterChipProps {
  label: FilterType;
  type?: 'default' | 'premium' | 'urgent';
  isActive: boolean;
  onPress: () => void;
}

export function FilterChip({ label, type = 'default', isActive, onPress }: FilterChipProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  let activeColor: string = theme.colors.black;
  if (type === 'premium') activeColor = theme.colors.yellow;
  if (type === 'urgent') activeColor = theme.colors.error;

  const getTextColor = () => {
    if (!isActive) return theme.colors.black;
    if (type === 'premium') return theme.colors.black;
    return theme.colors.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && { backgroundColor: activeColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterText, { color: getTextColor() }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function createStyles(c: { white: string; border: string; black: string }) {
  return {
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.border,
      marginRight: 4,
    },
    filterText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 12,
      color: c.black,
    },
  };
}
