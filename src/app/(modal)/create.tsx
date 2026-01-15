import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { NEO_THEME } from "../../shared/constants/neobrutalism";
import { StatusBar } from "expo-status-bar";

export default function MerchantCreateScreen() {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    // Dismiss the modal first, then navigate? 
    // Or navigate from within the form sheet context?
    // Usually pushing a new route from a modal stays in the modal stack unless we replace.
    // Let's just push for now.
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
            <Text style={styles.title}>Create New</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={NEO_THEME.colors.black} />
            </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/create-product")}>
          <View style={[styles.iconBox, { backgroundColor: NEO_THEME.colors.primary }]}>
            <MaterialIcons name="inventory" size={32} color="white" />
          </View>
          <Text style={styles.itemLabel}>Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/services/create")}>
          <View style={[styles.iconBox, { backgroundColor: NEO_THEME.colors.yellow }]}>
            <MaterialIcons name="design-services" size={32} color="black" />
          </View>
          <Text style={styles.itemLabel}>Service</Text>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/challenges/create")}>
          <View style={[styles.iconBox, { backgroundColor: NEO_THEME.colors.red }]}>
              <MaterialIcons name="emoji-events" size={32} color="white" />
          </View>
          <Text style={styles.itemLabel}>Challenge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => handleNavigation("/events/create")}>
          <View style={[styles.iconBox, { backgroundColor: NEO_THEME.colors.blue }]}>
            <MaterialIcons name="event" size={32} color="white" />
          </View>
          <Text style={styles.itemLabel}>Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: NEO_THEME.colors.black,
  },
  closeBtn: {
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  item: {
    width: '45%', // 2 columns approx
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 8,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: NEO_THEME.colors.black,
  },
});
