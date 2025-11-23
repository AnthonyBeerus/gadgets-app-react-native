import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NEO_THEME } from "../../constants/neobrutalism";

interface StaticHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export const StaticHeader: React.FC<StaticHeaderProps> = ({
  title,
  onBackPress,
  rightElement,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: top + 12 }]}>
      {onBackPress && (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={NEO_THEME.colors.black} />
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightElement && <View style={styles.headerRight}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  headerRight: {
    marginLeft: 12,
  },
});
