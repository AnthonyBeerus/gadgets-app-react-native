import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Text } from '../primitives/Text';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { space } from '../tokens/space';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  style?: ViewStyle;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  right,
  style,
  onBack,
}) => {
  const router = useRouter();
  const { colors } = useDesignTokens();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: space.xs,
          backgroundColor: colors.canvas,
          borderBottomColor: colors.stroke,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <View style={styles.titleBlock}>
          {title ? (
            <Text variant="h3" numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text variant="caption" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.xxs,
  },
  backSpacer: {
    width: 8,
  },
  titleBlock: {
    flex: 1,
  },
  right: {
    marginLeft: space.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
