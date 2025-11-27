import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface MetaInfoCardProps {
  deadline: string;
  participants: number;
}

export function MetaInfoCard({ deadline, participants }: MetaInfoCardProps) {
  return (
    <View style={styles.metaSection}>
      <View style={styles.metaItem}>
        <Ionicons name="time" size={20} color={NEO_THEME.colors.black} />
        <Text style={styles.metaLabel}>Deadline</Text>
        <Text style={styles.metaValue}>{deadline}</Text>
      </View>
      <View style={styles.metaDivider} />
      <View style={styles.metaItem}>
        <Ionicons name="people" size={20} color={NEO_THEME.colors.black} />
        <Text style={styles.metaLabel}>Joined</Text>
        <Text style={styles.metaValue}>{participants}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metaSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: NEO_THEME.colors.white,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: 2,
    backgroundColor: NEO_THEME.colors.greyLight,
  },
  metaLabel: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
  },
});
