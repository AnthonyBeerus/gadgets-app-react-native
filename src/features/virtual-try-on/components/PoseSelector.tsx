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
import { PoseOption } from "../types/TryOnTypes";
import { useTryOnStore } from "../store/tryOnStore";

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
      <Text style={styles.title}>Pose</Text>
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
    borderColor: "#5B21B6",
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
    backgroundColor: "#5B21B6",
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  selectedLabel: {
    color: "#5B21B6",
    fontWeight: "bold",
  },
});
