import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

interface MetaInfoCardProps {
  deadline: string;
  participants: number;
}

export function MetaInfoCard({ deadline, participants }: MetaInfoCardProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.metaSection}>
      <View style={styles.metaItem}>
        <Ionicons name="time" size={20} color={theme.colors.black} />
        <Text style={styles.metaLabel}>Deadline</Text>
        <Text style={styles.metaValue}>{deadline}</Text>
      </View>
      <View style={styles.metaDivider} />
      <View style={styles.metaItem}>
        <Ionicons name="people" size={20} color={theme.colors.black} />
        <Text style={styles.metaLabel}>Joined</Text>
        <Text style={styles.metaValue}>{participants}</Text>
      </View>
    </View>
  );
}

function createStyles(c: { white: string; greyLight: string; grey: string; black: string }) {
  return {
    metaSection: {
      flexDirection: 'row' as const,
      padding: 20,
      backgroundColor: c.white,
      marginBottom: 20,
    },
    metaItem: {
      flex: 1,
      alignItems: 'center' as const,
      gap: 4,
    },
    metaDivider: {
      width: 2,
      backgroundColor: c.greyLight,
    },
    metaLabel: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 12,
      color: c.grey,
      textTransform: 'uppercase' as const,
    },
    metaValue: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 18,
      color: c.black,
    },
  };
}
