import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface ProfileOptionProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  iconType?: "MaterialIcons" | "FontAwesome";
  showArrow?: boolean;
}

export const ProfileOption = ({
  icon,
  title,
  subtitle,
  onPress,
  iconType = "MaterialIcons",
  showArrow = true,
}: ProfileOptionProps) => {
  const IconComponent =
    iconType === "FontAwesome" ? FontAwesome : MaterialIcons;

  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <IconComponent name={icon as any} size={20} color={NEO_THEME.colors.white} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={NEO_THEME.colors.black}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: NEO_THEME.colors.black,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: NEO_THEME.borders.radius,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    marginBottom: 2,
    fontFamily: NEO_THEME.fonts.black,
  },
  optionSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    fontWeight: "700",
    fontFamily: NEO_THEME.fonts.bold,
  },
});
