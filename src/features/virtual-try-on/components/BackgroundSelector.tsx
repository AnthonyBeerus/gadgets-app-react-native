// filepath: src/features/virtual-try-on/components/BackgroundSelector.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackgroundScene } from "../types/TryOnTypes";
import { useTryOnStore } from "../store/tryOnStore";

const BACKGROUND_OPTIONS = [
  {
    value: BackgroundScene.ORIGINAL,
    label: "Original",
    icon: "image" as const,
    description: "Keep original",
  },
  {
    value: BackgroundScene.STUDIO,
    label: "Studio",
    icon: "camera" as const,
    description: "Professional studio",
  },
  {
    value: BackgroundScene.PARTY,
    label: "Party",
    icon: "balloon" as const,
    description: "Party atmosphere",
  },
  {
    value: BackgroundScene.COFFEE_DATE,
    label: "Coffee Date",
    icon: "cafe" as const,
    description: "Cozy cafe setting",
  },
  {
    value: BackgroundScene.RESTAURANT,
    label: "Restaurant",
    icon: "restaurant" as const,
    description: "Fine dining",
  },
  {
    value: BackgroundScene.OUTDOOR,
    label: "Outdoor",
    icon: "leaf" as const,
    description: "Natural outdoor",
  },
  {
    value: BackgroundScene.URBAN,
    label: "Urban",
    icon: "business" as const,
    description: "City street",
  },
];

export default function BackgroundSelector() {
  const { background, setBackground } = useTryOnStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {BACKGROUND_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              background === option.value && styles.selectedCard,
            ]}
            onPress={() => setBackground(option.value)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.iconContainer,
                background === option.value && styles.selectedIcon,
              ]}>
              <Ionicons
                name={option.icon}
                size={24}
                color={background === option.value ? "#fff" : "#9C27B0"}
              />
            </View>
            <Text
              style={[
                styles.optionLabel,
                background === option.value && styles.selectedLabel,
              ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  scrollContent: {
    gap: 10,
  },
  optionCard: {
    width: 90,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    borderColor: "#9C27B0",
    backgroundColor: "#F9FAFB",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  selectedIcon: {
    backgroundColor: "#9C27B0",
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedLabel: {
    color: "#9C27B0",
    fontWeight: "bold",
  },
});
