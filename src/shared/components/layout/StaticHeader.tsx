import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, space, fonts, useDesignTokens } from '../../design-system';

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
  const { colors } = useDesignTokens();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: top + space.sm,
          backgroundColor: colors.canvas,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {onBackPress ? (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.ink} />
        </TouchableOpacity>
      ) : null}
      <View style={styles.headerContent}>
        <Text variant="h3" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
      {rightElement ? <View style={styles.headerRight}>{rightElement}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: space.sm,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.semibold,
  },
  headerRight: {
    marginLeft: space.sm,
  },
});
