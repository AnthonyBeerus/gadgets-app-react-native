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
import { BackgroundScene } from '../types/TryOnTypes';
import { useTryOnStore } from "../store/tryOnStore";
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

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
      <Text style={styles.title}>BACKGROUND</Text>
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
              {option.label.toUpperCase()}
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
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 10,
    paddingHorizontal: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  scrollContent: {
    gap: 10,
  },
  optionCard: {
    width: 90,
    padding: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  selectedCard: {
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.yellow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  selectedIcon: {
    backgroundColor: NEO_THEME.colors.primary,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: NEO_THEME.colors.black,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.bold,
  },
  selectedLabel: {
    color: NEO_THEME.colors.black,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
});
