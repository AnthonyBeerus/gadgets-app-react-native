// filepath: src/features/virtual-try-on/components/PoseSelector.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PoseOption } from '../types/TryOnTypes';
import { useTryOnStore } from "../store/tryOnStore";
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

const POSE_OPTIONS = [
  {
    value: PoseOption.ORIGINAL,
    label: "Original",
    icon: "person" as const,
    description: "Keep original pose",
  },
  {
    value: PoseOption.SELFIE,
    label: "Selfie",
    icon: "camera-reverse" as const,
    description: "Selfie angle pose",
  },
  {
    value: PoseOption.STANDING,
    label: "Standing",
    icon: "body" as const,
    description: "Standing straight",
  },
  {
    value: PoseOption.CASUAL,
    label: "Casual",
    icon: "happy" as const,
    description: "Relaxed casual pose",
  },
  {
    value: PoseOption.PROFESSIONAL,
    label: "Professional",
    icon: "briefcase" as const,
    description: "Professional stance",
  },
  {
    value: PoseOption.WALKING,
    label: "Walking",
    icon: "walk" as const,
    description: "Walking pose",
  },
];

export default function PoseSelector() {
  const { pose, setPose } = useTryOnStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POSE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {POSE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              pose === option.value && styles.selectedCard,
            ]}
            onPress={() => setPose(option.value)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.iconContainer,
                pose === option.value && styles.selectedIcon,
              ]}>
              <Ionicons
                name={option.icon}
                size={24}
                color={pose === option.value ? "#fff" : "#5B21B6"}
              />
            </View>
            <Text
              style={[
                styles.optionLabel,
                pose === option.value && styles.selectedLabel,
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
