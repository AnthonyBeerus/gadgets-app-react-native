import { Redirect, Tabs } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Platform, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../shared/providers/auth-provider";
import { NEO_THEME } from "../../shared/constants/neobrutalism";

const COLORS = {
  primary: "#9C27B0",
  primaryLight: "#E1BEE7",
  inactive: "#9E9E9E",
  background: "#FFFFFF",
  shadow: "#000000",
  text: "#1D1D1F",
};

function TabBarIcon(props: {
  name:
    | React.ComponentProps<typeof FontAwesome>["name"]
    | React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
  focused: boolean;
  type?: "FontAwesome" | "MaterialIcons";
}) {
  const { name, color, focused, type = "FontAwesome" } = props;
  const size = focused ? 28 : 24;
  const iconColor = focused ? NEO_THEME.colors.black : NEO_THEME.colors.grey;

  const IconComponent = type === "MaterialIcons" ? MaterialIcons : FontAwesome;

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <IconComponent name={name as any} size={size} color={iconColor} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

const TabsLayout = () => {
  const { session, mounting, isMerchant, activeRole } = useAuth();
  const insets = useSafeAreaInsets();

  if (mounting) return <ActivityIndicator />;
  if (!session) return <Redirect href="/auth" />;
  if (isMerchant && activeRole === 'merchant') return <Redirect href="/(merchant)" />; // Exclusive Mode

  return (
    
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: NEO_THEME.colors.primary,
          tabBarInactiveTintColor: NEO_THEME.colors.grey,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: NEO_THEME.colors.white,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            paddingTop: 14,
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 14 : 20,
            paddingHorizontal: Math.max(insets.left, insets.right, 8),
            height: Platform.OS === "ios" ? 74 + insets.bottom : 76,
            borderTopWidth: NEO_THEME.borders.width,
            borderTopColor: NEO_THEME.colors.black,
            // Hard shadow
            elevation: 0,
            shadowColor: NEO_THEME.colors.black,
            shadowOffset: {
              width: 0,
              height: -5,
            },
            shadowOpacity: 1,
            shadowRadius: 0,
            position: "absolute",
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Shop",
            tabBarIcon({ focused }) {
              return (
                <TabBarIcon
                  name="storefront"
                  type="MaterialIcons"
                  focused={focused}
                  color={""}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: "Services",
            tabBarIcon({ focused }) {
              return (
                <TabBarIcon
                  name="medical-services"
                  type="MaterialIcons"
                  focused={focused}
                  color={""}
                />
              );
            },
          }}
        />
<Tabs.Screen
          name="challenges"
          options={{
            title: "Challenges",
            tabBarIcon({ focused }) {
              return (
                <TabBarIcon
                  name="trophy"
                  type="FontAwesome"
                  focused={focused}
                  color={""}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon({ focused }) {
              return (
                <TabBarIcon
                  name="event"
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

export default TabsLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    position: "relative",
  },
  iconContainerActive: {
    backgroundColor: NEO_THEME.colors.yellow,
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
