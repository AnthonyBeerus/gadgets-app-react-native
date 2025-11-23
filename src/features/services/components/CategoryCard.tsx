import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NEO_THEME } from "../../../shared/constants/neobrutalism";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
  };
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <View
      style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
      <MaterialIcons
        name={category.icon as any}
        size={30}
        color={category.color}
      />
    </View>
    <Text style={styles.categoryName}>{category.name}</Text>
    <Text style={styles.categoryDescription}>{category.description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryCard: {
    width: "48%",
    backgroundColor: NEO_THEME.colors.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoryDescription: {
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textAlign: "center",
    lineHeight: 16,
  },
});
