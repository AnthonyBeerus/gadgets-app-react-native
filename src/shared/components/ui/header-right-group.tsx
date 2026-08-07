/**
 * HeaderRightGroup
 * 
 * Compact horizontal group for header right side.
 * Pilot utility group. Gems remain hidden from the consumer experience.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CartHeaderButton } from './CartHeaderButton';

export const HeaderRightGroup = () => {
  return (
    <View style={styles.container}>
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
