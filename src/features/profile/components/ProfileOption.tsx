import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { fonts, radii, useDesignTokens } from '../../../shared/design-system';

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
  const { colors } = useDesignTokens();
  const IconComponent =
    iconType === "FontAwesome" ? FontAwesome : MaterialIcons;

  return (
    <TouchableOpacity
      style={[styles.optionItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.gray100 }]}>
          <IconComponent name={icon as any} size={20} color={colors.ink} />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.ink }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.optionSubtitle, { color: colors.inkMuted }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <MaterialIcons name="chevron-right" size={24} color={colors.inkMuted} />
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
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: fonts.semibold,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});
