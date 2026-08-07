// filepath: src/features/virtual-try-on/components/BackgroundSelector.tsx
import React from "react";
import {
  View,
  Text, TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackgroundScene } from '../types/TryOnTypes';
import { useTryOnStore } from "../store/tryOnStore";
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';

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
  const styles = useNeoStyles(createStyles);
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


function createStyles(c) {
  return {
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: c.black,
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
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  selectedCard: {
    borderColor: c.border,
    backgroundColor: c.yellow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: c.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  selectedIcon: {
    backgroundColor: c.primary,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: c.black,
    textAlign: "center",
    fontFamily: NEO_THEME.fonts.bold,
  },
  selectedLabel: {
    color: c.black,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  };
}