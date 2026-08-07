import React from 'react';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';

export default function MerchantCommunityLayout() {
  const styles = useNeoStyles(createStyles);

  return (
    <CollapsibleTabProvider>
      <View style={styles.container}>
        <Slot />
      </View>
    </CollapsibleTabProvider>
  );
}

function createStyles(c: { backgroundLight: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.backgroundLight,
    },
  };
}
