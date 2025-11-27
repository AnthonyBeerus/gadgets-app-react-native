import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface RewardCardProps {
  reward: string;
}

export function RewardCard({ reward }: RewardCardProps) {
  return (
    <View style={styles.rewardCard}>
      <Ionicons name="trophy" size={32} color={NEO_THEME.colors.yellow} />
      <Text style={styles.rewardText}>{reward}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    padding: 20,
    borderRadius: NEO_THEME.borders.radius,
    gap: 16,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  rewardText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.white,
    flex: 1,
  },
});
