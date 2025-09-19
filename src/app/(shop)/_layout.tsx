import { Redirect, Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Platform } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../providers/auth-provider";

const COLORS = {
  primary: "#1BC464",
  inactive: "#8E8E93",
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
  const size = focused ? 26 : 24;
  const iconColor = focused ? COLORS.primary : COLORS.inactive;

  if (type === "MaterialIcons") {
    return <MaterialIcons name={name as any} size={size} color={iconColor} />;
  }

  return <FontAwesome name={name as any} size={size} color={iconColor} />;
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
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 12,
            paddingBottom: Platform.OS === "ios" ? 20 : 12,
            height: Platform.OS === "ios" ? 88 : 72,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: COLORS.shadow,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
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
});
