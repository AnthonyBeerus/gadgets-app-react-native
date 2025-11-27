import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface RequirementsListProps {
  requirements: string[];
}

export function RequirementsList({ requirements }: RequirementsListProps) {
  return (
    <View style={styles.requirementsList}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.reqItem}>
          <Ionicons name="checkmark-circle" size={20} color={NEO_THEME.colors.success} />
          <Text style={styles.reqText}>{req}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  requirementsList: {
    gap: 12,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reqText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    flex: 1,
    lineHeight: 22,
  },
});
