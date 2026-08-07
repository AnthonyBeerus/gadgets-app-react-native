import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

interface RequirementsListProps {
  requirements: string[];
}

export function RequirementsList({ requirements }: RequirementsListProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.requirementsList}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.reqItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
          <Text style={styles.reqText}>{req}</Text>
        </View>
      ))}
    </View>
  );
}

function createStyles(c: { black: string }) {
  return {
    requirementsList: {
      gap: 12,
    },
    reqItem: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: 12,
    },
    reqText: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 16,
      color: c.black,
      flex: 1,
      lineHeight: 22,
    },
  };
}
