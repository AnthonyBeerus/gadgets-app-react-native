import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../shared/providers/auth-provider";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StyleSheet, Platform, View } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"; // Using FontAwesome5 for some
import { NEO_THEME } from "../../shared/constants/neobrutalism";

function TabBarIcon(props: {
  name:
    | React.ComponentProps<typeof MaterialIcons>["name"]
    | React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
  focused: boolean;
  type?: "MaterialIcons" | "FontAwesome5";
}) {
  const { name, focused, type = "MaterialIcons" } = props;
  const size = focused ? 28 : 24;
  const iconColor = focused ? NEO_THEME.colors.black : NEO_THEME.colors.grey;

  const IconComponent = type === "FontAwesome5" ? FontAwesome5 : MaterialIcons;

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      {/* @ts-ignore */}
      <IconComponent name={name as any} size={size} color={iconColor} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

const MerchantTabsLayout = () => {
  const insets = useSafeAreaInsets();
  const { isMerchant, activeRole, mounting } = useAuth();
  
  if (mounting) return <View />;
  // Only allow if actually a merchant AND in merchant mode
  if (!isMerchant || activeRole !== 'merchant') return <Redirect href="/(shop)" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: NEO_THEME.colors.primary,
        tabBarInactiveTintColor: NEO_THEME.colors.grey,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#F0F0F0", // Slightly different bg for Merchant
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 14,
          paddingBottom: Platform.OS === "ios" ? insets.bottom + 14 : 20,
          paddingHorizontal: Math.max(insets.left, insets.right, 8),
          height: Platform.OS === "ios" ? 74 + insets.bottom : 76,
          borderTopWidth: NEO_THEME.borders.width,
          borderTopColor: NEO_THEME.colors.black,
          elevation: 0,
          shadowColor: NEO_THEME.colors.black,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 1,
          shadowRadius: 0,
          position: "absolute",
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon({ focused }) {
            return (
              <TabBarIcon
                name="dashboard"
                type="MaterialIcons"
                focused={focused}
                color={""}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catalog",
          tabBarIcon({ focused }) {
            return (
              <TabBarIcon
                name="store"
                type="MaterialIcons"
                focused={focused}
                color={""}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon({ focused }) {
            return (
              <TabBarIcon
                name="groups"
                type="MaterialIcons"
                focused={focused}
                color={""}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon({ focused }) {
            return (
              <TabBarIcon
                name="person"
                type="MaterialIcons"
                focused={focused}
                color={""}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default MerchantTabsLayout;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    position: "relative",
  },
  iconContainerActive: {
    backgroundColor: NEO_THEME.colors.white, // Inverted for merchant? Or Keep consistent
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: 32,
    height: 4,
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
  },
});
