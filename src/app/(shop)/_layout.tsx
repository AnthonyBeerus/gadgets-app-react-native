import { Redirect, Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Platform, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../providers/auth-provider";

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
  const iconColor = focused ? COLORS.primary : COLORS.inactive;

  const IconComponent = type === "MaterialIcons" ? MaterialIcons : FontAwesome;

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <IconComponent name={name as any} size={size} color={iconColor} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

const TabsLayout = () => {
  const { session, mounting } = useAuth();

  if (mounting) return <ActivityIndicator />;
  if (!session) return <Redirect href="/auth" />;

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.inactive,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 14,
            paddingBottom: Platform.OS === "ios" ? 28 : 20,
            height: Platform.OS === "ios" ? 88 : 76,
            borderTopWidth: 0,
            elevation: 24,
            shadowColor: COLORS.shadow,
            shadowOffset: {
              width: 0,
              height: -8,
            },
            shadowOpacity: 0.12,
            shadowRadius: 16,
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
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon({ focused }) {
              return (
                <TabBarIcon
                  name="receipt-long"
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
    </SafeAreaView>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 40,
    borderRadius: 16,
    position: "relative",
  },
  iconContainerActive: {
    backgroundColor: COLORS.primaryLight,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: 32,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
