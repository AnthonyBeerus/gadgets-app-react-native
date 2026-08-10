import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Rule, ScreenHeader, Text, layout, space, useDesignTokens } from '../../shared/design-system';

/**
 * Activity is the root every order deep link falls back to, so it stays a plain
 * list of destinations — no state of its own to restore.
 */
const DESTINATIONS = [
  { href: '/saved-opportunities', icon: 'bookmark-outline', title: 'Saved briefs', detail: 'Your shortlist from Discover' },
  { href: '/(shop)/challenges/my-entries', icon: 'videocam-outline', title: 'My entries', detail: 'Submission, review and judging status' },
  { href: '/orders', icon: 'receipt-outline', title: 'Orders and purchase proof', detail: 'Qualifying Muse purchases' },
] as const satisfies readonly { href: Href; icon: React.ComponentProps<typeof Ionicons>['name']; title: string; detail: string }[];

export default function ActivityScreen() {
  const { colors, icons } = useDesignTokens();
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.canvas }]}>
      <ScreenHeader variant="brand" title="Activity" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="body" color={colors.inkMuted}>
          Everything between saving a brief and getting paid.
        </Text>
        <View style={[styles.plate, { borderColor: colors.stroke, backgroundColor: colors.surface }]}>
          {DESTINATIONS.map((item, index) => (
            <View key={item.title}>
              {index > 0 ? <Rule quiet /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => router.push(item.href)}
                style={styles.row}
              >
                <View style={[styles.mark, { borderColor: colors.stroke }]}>
                  <Ionicons name={item.icon} size={icons.md} color={colors.ink} />
                </View>
                <View style={styles.copy}>
                  <Text variant="h3">{item.title}</Text>
                  <Text variant="caption">{item.detail}</Text>
                </View>
                <Ionicons name="chevron-forward" size={icons.sm} color={colors.inkMuted} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: layout.screenGutter, paddingBottom: 110, gap: space.lg },
  plate: { borderWidth: 2, borderRadius: 0 },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: layout.cardPadding },
  mark: { width: 44, height: 44, borderWidth: 2, borderRadius: 0, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 3 },
});
