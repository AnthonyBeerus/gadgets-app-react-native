import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../primitives/Text';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { space } from '../tokens/space';
import { radii } from '../tokens/radii';

export interface TabBarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface TabBarShellProps {
  items: TabBarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  style?: ViewStyle;
}

/** Shared quiet chrome for shop/merchant tab bars */
export const TabBarShell: React.FC<TabBarShellProps> = ({
  items,
  activeKey,
  onSelect,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, elevation } = useDesignTokens();

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, space.sm) },
        style,
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            ...elevation.soft,
          },
        ]}
      >
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              style={[
                styles.item,
                active && { backgroundColor: colors.gray100 },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              {active && item.activeIcon ? item.activeIcon : item.icon}
              <Text
                variant="caption"
                color={active ? colors.ink : colors.inkMuted}
                style={styles.label}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.md,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    padding: space.xxs,
    borderWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderRadius: radii.md,
    gap: 2,
  },
  label: {
    fontSize: 11,
  },
});
