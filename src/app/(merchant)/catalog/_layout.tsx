import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';
import { CollapsibleTabHeader } from '../../../shared/components/navigation/CollapsibleTabHeader';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';

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
  const styles = useNeoStyles(createStyles);

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

function createStyles(c: { backgroundLight: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.backgroundLight,
    },
  };
}
