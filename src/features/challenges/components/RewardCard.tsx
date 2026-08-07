import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

interface RewardCardProps {
  reward: string;
}

export function RewardCard({ reward }: RewardCardProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  return (
    <View style={styles.rewardCard}>
      <Ionicons name="trophy" size={32} color={theme.colors.yellow} />
      <Text style={styles.rewardText}>{reward}</Text>
    </View>
  );
}

function createStyles(c: { black: string; grey: string; white: string }) {
  return {
    rewardCard: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: c.black,
      padding: 20,
      borderRadius: NEO_THEME.borders.radius,
      gap: 16,
      shadowColor: c.grey,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    rewardText: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 20,
      color: c.white,
      flex: 1,
    },
  };
}
