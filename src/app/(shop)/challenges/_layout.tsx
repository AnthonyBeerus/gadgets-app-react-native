import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext, useRouter } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CollapsibleTabProvider } from '../../../shared/context/CollapsibleTabContext';
import { CollapsibleTabHeader } from '../../../shared/components/navigation/CollapsibleTabHeader';

const Tab = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Tab.Navigator);

// Add displayName to prevent undefined errors
MaterialTopTabs.displayName = 'MaterialTopTabs';

const GemButton = ({ small = false }) => {
  const router = useRouter();
  return (
    <TouchableOpacity 
      style={[styles.gemButton, small && styles.gemButtonSmall]}
      activeOpacity={0.7}
      onPress={() => router.push('/gem-shop')}
    >
      <View style={styles.gemIcon} />
      <Text style={[styles.gemText, small && styles.gemTextSmall]}>SHOP</Text>
    </TouchableOpacity>
  );
};

export default function ChallengesLayout() {
  return (
    <CollapsibleTabProvider>
      <View style={styles.container}>
        <MaterialTopTabs
          tabBar={(props) => (
            <CollapsibleTabHeader 
              {...props} 
              title="CHALLENGES"
              subtitle="CREATE CONTENT, WIN REWARDS"
              renderHeaderRight={(props) => <GemButton {...props} />}
              tabNames={{
                index: 'EXPLORE',
                leaderboard: 'LEADERBOARD',
                'my-entries': 'MY ENTRIES',
              }}
            />
          )}
          screenOptions={{
            swipeEnabled: true,
            animationEnabled: true,
            lazy: true,
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: "Explore" }} />
          <MaterialTopTabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
          <MaterialTopTabs.Screen name="my-entries" options={{ title: "My Entries" }} />
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
  gemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  gemButtonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowOffset: { width: 2, height: 2 },
  },
  gemIcon: {
    width: 16,
    height: 16,
    backgroundColor: NEO_THEME.colors.primary,
    marginRight: 8,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  gemText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontWeight: '700',
    color: NEO_THEME.colors.black,
    fontSize: 14,
  },
  gemTextSmall: {
    fontSize: 12,
  },
});
