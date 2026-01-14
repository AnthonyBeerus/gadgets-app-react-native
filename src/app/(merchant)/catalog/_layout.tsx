import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext, useRouter } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';
import { CollapsibleTabHeader } from '../../../shared/components/navigation/CollapsibleTabHeader';

const Tab = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Tab.Navigator);

MaterialTopTabs.displayName = 'MaterialTopTabs';

const CreateButton = () => {
  // We could put a generic "Add" button here if we wanted to unify the create flow,
  // but for now products have "Add" in their screen (alert) and services have "Create".
  // Let's keep specific actions on the screens since they handle different data types differently right now.
  return null;
};

export default function MerchantCatalogLayout() {
  return (
    <CollapsibleTabProvider>
      <View style={styles.container}>
        <MaterialTopTabs
          tabBar={(props) => (
            <CollapsibleTabHeader 
              {...props} 
              title="CATALOG"
              subtitle="MANAGE PRODUCTS & SERVICES"
              renderHeaderRight={() => <CreateButton />}
              tabNames={{
                index: 'PRODUCTS',
                services: 'SERVICES',
              }}
            />
          )}
          screenOptions={{
            swipeEnabled: false,
            animationEnabled: true,
            lazy: true,
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "Products" }} />
          <MaterialTopTabs.Screen name="services" options={{ title: "Services" }} />
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
