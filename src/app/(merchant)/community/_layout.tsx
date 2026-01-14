import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext, useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';
import { CollapsibleTabHeader } from '../../../shared/components/navigation/CollapsibleTabHeader';

const Tab = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Tab.Navigator);

// Add displayName to prevent undefined errors
MaterialTopTabs.displayName = 'MaterialTopTabs';

const CreateButton = ({ small = false }) => {
  const router = useRouter();
  // We can determine which create button to show based on the active tab or just show a generic "Create" 
  // that opens a modal? 
  // Actually, standard "Create" buttons are usually on the screen itself. 
  // But here we can have a "Create" button in the header that navigates based on context?
  // Or just keep the detailed creates on the screens themselves as they currently are.
  // The user requested "Use the top tabs header" which has a right accessory.
  // In the reference, it's a "Result" or "Shop" button.
  // For Merchant Community, maybe we don't need a right button, or we can put a "Help" button.
  // For now I'll leave it empty or return null to keep it clean.
  return null;
};

export default function MerchantCommunityLayout() {
  return (
    <CollapsibleTabProvider>
      <View style={styles.container}>
        <MaterialTopTabs
          tabBar={(props) => (
            <CollapsibleTabHeader 
              {...props} 
              title="COMMUNITY"
              subtitle="EVENTS & CHALLENGES"
              renderHeaderRight={(props) => <CreateButton {...props} />}
              tabNames={{
                index: 'EVENTS',
                challenges: 'CHALLENGES',
              }}
            />
          )}
          screenOptions={{
            swipeEnabled: false,
            animationEnabled: true,
            lazy: true,
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "Events" }} />
          <MaterialTopTabs.Screen name="challenges" options={{ title: "Challenges" }} />
        </MaterialTopTabs>
      </View>
    </CollapsibleTabProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
});
