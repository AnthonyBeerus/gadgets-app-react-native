import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Tab.Navigator);

// Add displayName to prevent undefined errors
MaterialTopTabs.displayName = 'MaterialTopTabs';

type MyTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

function MyTabBar({ state, descriptors, navigation }: MyTabBarProps) {
  const getDisplayTitle = (routeName: string) => {
    const routeMap: Record<string, string> = {
      index: 'EXPLORE',
      leaderboard: 'LEADERBOARD',
      'my-entries': 'MY ENTRIES',
    };
    return routeMap[routeName] || routeName.toUpperCase();
  };

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: { key: any; name: string }, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabItem,
              isFocused && styles.tabItemFocused,
              index < state.routes.length - 1 && styles.tabItemBorder,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                isFocused && styles.tabLabelFocused,
              ]}
              numberOfLines={1}
            >
              {getDisplayTitle(route.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ChallengesLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MaterialTopTabs
        tabBar={(props) => <MyTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: "Explore" }} />
        <MaterialTopTabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
        <MaterialTopTabs.Screen name="my-entries" options={{ title: "My Entries" }} />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  tabBarContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
    overflow: 'hidden',
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: NEO_THEME.colors.white,
  },
  tabItemFocused: {
    backgroundColor: NEO_THEME.colors.primary,
  },
  tabItemBorder: {
    borderRightWidth: NEO_THEME.borders.width,
    borderRightColor: NEO_THEME.colors.black,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
    color: NEO_THEME.colors.black,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tabLabelFocused: {
    color: NEO_THEME.colors.white,
  },
});
