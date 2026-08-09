import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, radii, space, useDesignTokens } from '../shared/design-system';

const revenue = [
  ['Campaign fee', 'Businesses pay Muse to turn a product and goal into a creator-ready campaign.'],
  ['Sponsored placement', 'Paid cards receive clearly labelled reach in Discover.'],
  ['Commerce fee', 'Muse earns when discovery leads to a qualifying purchase.'],
  ['Measurement', 'Later, merchants can pay for reporting, reuse rights and repeat campaigns.'],
];

export default function AdvertiseScreen() {
  const router = useRouter();
  const { colors, elevation } = useDesignTokens();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ padding: space.md, gap: space.lg, paddingBottom: 48 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={26} color={colors.ink} />
        </Pressable>
        <View style={{ gap: space.sm }}>
          <Text variant="caption" color={colors.accent}>THE BUSINESS MODEL</Text>
          <Text variant="h1">Social attention becomes local commerce.</Text>
          <Text variant="body" color={colors.inkMuted}>A business funds a brief and cash rewards. Creators make useful social content. People discover products through that content, then shop or visit locally. Better sales fund the next campaign.</Text>
        </View>
        <View style={{ gap: space.sm }}>
          {['Business funds a brief + creator pot', 'Creators publish and earn cash', 'Shoppers discover and buy locally', 'Performance funds the next campaign'].map((item, index) => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radii.md, backgroundColor: colors.surface, ...elevation.hairline }}>
              <Text variant="h2" color={colors.accent}>{index + 1}</Text><Text variant="bodyBold" style={{ flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={{ gap: space.sm }}>
          <Text variant="h2">Where Muse earns</Text>
          {revenue.map(([title, body]) => (
            <View key={title} style={{ paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 4 }}>
              <Text variant="bodyBold">{title}</Text><Text variant="body" color={colors.inkMuted}>{body}</Text>
            </View>
          ))}
        </View>
        <View style={{ padding: space.md, borderRadius: radii.md, backgroundColor: colors.accentMuted, gap: space.xs }}>
          <Text variant="bodyBold">Designed for institutions as well as shops</Text>
          <Text variant="body" color={colors.inkMuted}>For Miss World Botswana, sponsor-backed campaigns, tickets, supporter drops and partner commerce can help fund cultural work without pretending the organisation is a high-margin retailer.</Text>
        </View>
        <Text variant="caption" color={colors.inkMuted}>Prototype economics for partner discussion. Packages and fees are not yet priced.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
