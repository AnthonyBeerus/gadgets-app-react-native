import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../primitives/Text';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { space, layout } from '../tokens/space';
import { targets } from '../tokens/structure';

export interface TabBarItem {
  key: string;
  label: string;
  /** Ionicons glyph name. The bar renders it at icon.md, stroke 2. */
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

export interface TabBarProps {
  items: TabBarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  style?: ViewStyle;
}

/**
 * The single tab bar for every Muse tab root — consumer and merchant alike.
 * Merchant mode is a chip in the header, not a different bar.
 */
export const TabBar: React.FC<TabBarProps> = ({ items, activeKey, onSelect, style }) => {
  const insets = useSafeAreaInsets();
  const { colors, icons } = useDesignTokens();

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: insets.bottom + layout.safeBottom },
        style,
      ]}
    >
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.surface, borderColor: colors.stroke },
        ]}
      >
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              style={[styles.item, active && { backgroundColor: colors.surfaceSunken }]}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={item.icon}
                size={icons.md}
                color={active ? colors.ink : colors.inkMuted}
              />
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
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 0,
    borderWidth: 2,
  },
  item: {
    flex: 1,
    minHeight: targets.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderRadius: 0,
    gap: 2,
  },
  label: {
    fontSize: 11,
  },
});
