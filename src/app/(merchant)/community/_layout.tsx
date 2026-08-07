import React from 'react';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';

export default function MerchantCommunityLayout() {
  return (
    <CollapsibleTabProvider>
      <View style={{ flex: 1, backgroundColor: NEO_THEME.colors.backgroundLight }}>
        <Slot />
      </View>
    </CollapsibleTabProvider>
  );
}
