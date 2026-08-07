import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
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

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const styles = useNeoStyles(createStyles);

  return (
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
};

function createStyles(c) {
  return {
  categoryCard: {
    width: "48%",
    backgroundColor: c.white,
    borderRadius: NEO_THEME.borders.radius,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: c.black,
    textAlign: "center",
    marginBottom: 4,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  categoryDescription: {
    fontSize: 12,
    color: c.grey,
    textAlign: "center",
    lineHeight: 16,
  },
  };
}
