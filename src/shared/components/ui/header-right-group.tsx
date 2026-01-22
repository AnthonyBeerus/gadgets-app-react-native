/**
 * HeaderRightGroup
 * 
 * Compact horizontal group for header right side.
 * Contains GemBalanceChip and CartHeaderButton.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GemBalanceChip } from './gem-balance-chip';
import { CartHeaderButton } from './CartHeaderButton';

export const HeaderRightGroup = () => {
  return (
    <View style={styles.container}>
      <GemBalanceChip />
      <CartHeaderButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Tighter spacing for compact look
  },
});
