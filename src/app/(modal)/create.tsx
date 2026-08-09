import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useNeoStyles } from "../../shared/hooks/useNeoStyles";
import { useTheme } from "../../shared/providers/theme-provider";

export default function MerchantCreateScreen() {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
            <Text style={styles.title}>Create New</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/create-product")}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primary }]}>
            <MaterialIcons name="inventory" size={32} color="white" />
          </View>
          <Text style={styles.itemLabel}>Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/challenges/create")}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.red }]}>
              <MaterialIcons name="emoji-events" size={32} color="white" />
          </View>
          <Text style={styles.itemLabel}>Creator opportunity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(c: { white: string; black: string; border: string }) {
  return {
    container: {
      flex: 1,
      backgroundColor: c.white,
      padding: 24,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 30,
      marginTop: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold" as const,
      color: c.black,
    },
    closeBtn: {
      padding: 4,
    },
    grid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
      gap: 20,
    },
    item: {
      width: '45%' as const,
      alignItems: 'center' as const,
      marginBottom: 10,
    },
    iconBox: {
      width: 64,
      height: 64,
      borderRadius: 16,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 8,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    itemLabel: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: c.black,
    },
  };
}
