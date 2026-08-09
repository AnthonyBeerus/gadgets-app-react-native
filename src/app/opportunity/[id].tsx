import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPrototypeOpportunity } from '../../features/discovery/prototype-opportunities';
import { Button, Text, radii, space, useDesignTokens } from '../../shared/design-system';

export default function PrototypeOpportunityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, elevation } = useDesignTokens();
  const item = getPrototypeOpportunity(Number(id));
  if (!item) return <SafeAreaView style={{ flex: 1, padding: space.lg }}><Text variant="h1">Opportunity not found</Text><Button onPress={() => router.back()}>Go back</Button></SafeAreaView>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ height: 310 }}>
          <Image source={{ uri: item.hero_image }} style={{ flex: 1 }} contentFit="cover" />
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={{ position: 'absolute', top: space.md, left: space.md, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
        </View>
        <View style={{ padding: space.md, gap: space.md }}>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: space.sm, paddingVertical: 6, borderRadius: radii.sm, backgroundColor: colors.accentMuted }}><Text variant="caption">PARTNER PROTOTYPE · NOT LIVE</Text></View>
          <Text variant="caption" color={colors.inkMuted}>{item.merchant_name}</Text>
          <Text variant="h1">{item.opportunity_title}</Text>
          <Text variant="body" color={colors.inkMuted}>{item.opportunity_description}</Text>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <View style={{ flex: 1, padding: space.md, borderRadius: radii.md, backgroundColor: colors.surface, ...elevation.hairline }}><Text variant="caption" color={colors.inkMuted}>PRIZE POT</Text><Text variant="h2">P{item.pot_value}</Text></View>
            <View style={{ flex: 1, padding: space.md, borderRadius: radii.md, backgroundColor: colors.surface, ...elevation.hairline }}><Text variant="caption" color={colors.inkMuted}>ACCEPTED ENTRY</Text><Text variant="h2">P{item.accepted_entry_fee}</Text></View>
          </View>
          <Text variant="h2">The brief</Text>
          {item.requirements.map(requirement => <View key={requirement} style={{ flexDirection: 'row', gap: space.sm }}><Ionicons name="checkmark-circle" size={20} color={colors.accent} /><Text variant="body" style={{ flex: 1 }}>{requirement}</Text></View>)}
          <View style={{ padding: space.md, borderRadius: radii.md, backgroundColor: colors.surface, gap: space.xs }}><Text variant="bodyBold">Qualifying item</Text><Text variant="body">{item.product_title} · from P{item.price}</Text><Text variant="caption" color={colors.inkMuted}>In a live campaign, a Muse order or verified till code unlocks submission.</Text></View>
          <Button onPress={() => router.push('/(shop)/marketplace')}>Explore the marketplace</Button>
          <Button variant="secondary" onPress={() => router.push('/auth')}>Preview creator sign-in</Button>
          <Text variant="caption" color={colors.inkMuted}>{item.prototype_disclaimer}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
