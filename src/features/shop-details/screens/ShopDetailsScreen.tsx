import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Linking, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCampaignAwareShopById } from '../../discovery/marketplace-api';
import { Button, Text, radii, space, useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../../../shared/design-system';

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const [concept, setConcept] = useState<string | null>(null);
  const shop = useQuery({ queryKey: ['campaign-aware-shop', id], queryFn: () => getCampaignAwareShopById(Number(id)), staleTime: 60_000 });

  if (shop.isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.ink} /></View>;
  if (!shop.data) return <View style={styles.center}><Text variant="h1">Shop not found</Text><Button onPress={() => router.back()}>Go back</Button></View>;
  const profile = shop.data;
  const openProduct = (slug: string) => router.push({ pathname: '/product/[slug]', params: { slug, source: 'merchant', ...(profile.opportunity ? { opportunityId: profile.opportunity.opportunity_id } : {}) } });
  const visit = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={{ uri: profile.imageUrl }} style={styles.image} contentFit="cover" />
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={22} color={colors.ink} /></Pressable>
          {profile.isSponsored && <View style={styles.sponsored}><Text variant="caption">SPONSORED CONCEPT</Text></View>}
        </View>
        <View style={styles.body}>
          {profile.isPrototype && <View style={styles.prototype}><Text variant="caption">PARTNER PROTOTYPE · NOT A LIVE OFFER</Text></View>}
          <Text variant="caption" color={colors.accent}>{profile.intent.toUpperCase()} · MOLAPO</Text>
          <Text variant="h1">{profile.name}</Text>
          <Text variant="body" color={colors.inkMuted}>{profile.story}</Text>
          <View style={styles.actions}>
            <Button onPress={visit}>Visit at Molapo</Button>
            {profile.phone && <Button variant="secondary" onPress={() => Linking.openURL(`tel:${profile.phone}`)}>Call</Button>}
            {profile.whatsapp && <Button variant="secondary" onPress={() => Linking.openURL(`https://wa.me/${profile.whatsapp}`)}>WhatsApp</Button>}
          </View>

          {profile.opportunity && (
            <View style={styles.opportunity}>
              <Text variant="caption" color={colors.accent}>ACTIVE CREATOR OPPORTUNITY</Text>
              <Text variant="h2">{profile.opportunity.opportunity_title}</Text>
              <Text variant="body" color={colors.inkMuted}>{profile.opportunity.opportunity_description}</Text>
              <View style={styles.moneyRow}><Money label="PRIZE POT" value={`P${profile.opportunity.pot_value}`} /><Money label="ACCEPTED ENTRY" value={`P${profile.opportunity.accepted_entry_fee}`} /></View>
              <Button onPress={() => router.push(`/opportunity/${profile.opportunity!.opportunity_id}`)}>View opportunity</Button>
              {profile.products[0] && <Button variant="secondary" onPress={() => openProduct(profile.products[0].slug)}>Shop qualifying item</Button>}
            </View>
          )}

          <Text variant="h2">What creator participation can produce</Text>
          <Text variant="body" color={colors.inkMuted}>Illustrative outcomes only. Live Muse campaigns reference public posts hosted on TikTok or other social platforms.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.concepts}>
            {profile.creatorConcepts.map(item => <Pressable key={item} onPress={() => setConcept(item)} style={styles.concept}><View style={styles.play}><Ionicons name="play" size={18} color={colors.surface} /></View><Text variant="caption" color={colors.accent}>ILLUSTRATIVE CONTENT</Text><Text variant="bodyBold">{item}</Text><Text variant="caption" color={colors.inkMuted}>Tap to see how verification works</Text></Pressable>)}
          </ScrollView>

          <Text variant="h2">Qualifying and featured products</Text>
          <View style={styles.products}>{profile.products.map(product => <Pressable key={product.id} onPress={() => openProduct(product.slug)} style={styles.product}><Image source={{ uri: product.heroImage }} style={styles.productImage} contentFit="cover" /><Text variant="bodyBold" numberOfLines={2}>{product.title}</Text><Text variant="h2">P{product.price}</Text></Pressable>)}</View>

          <View style={styles.details}><Text variant="h2">Business details</Text><View style={styles.detailRow}><Ionicons name="location" size={20} color={colors.ink} /><Text variant="body" style={styles.flex}>{profile.location}</Text></View><View style={styles.detailRow}><Ionicons name="bag-handle" size={20} color={colors.ink} /><Text variant="body" style={styles.flex}>{[profile.hasCollection && 'Collection', profile.hasDelivery && 'Delivery'].filter(Boolean).join(' · ') || 'Visit in person'}</Text></View><Text variant="caption" color={colors.inkMuted}>Merchant identity and campaign details are verified before a live offer is published.</Text></View>
        </View>
      </ScrollView>

      <Modal transparent visible={Boolean(concept)} animationType="fade" onRequestClose={() => setConcept(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setConcept(null)}><Pressable style={styles.modalCard} onPress={event => event.stopPropagation()}><Ionicons name="logo-tiktok" size={32} color={colors.ink} /><Text variant="h2">External content, verified by Muse</Text><Text variant="body" color={colors.inkMuted}>{concept}</Text><Text variant="body">The creator publishes publicly, submits the post URL and grants disclosed reuse rights. Muse checks purchase eligibility and brief compliance before the accepted-entry payout or leaderboard ranking applies.</Text><Button onPress={() => setConcept(null)}>Got it</Button></Pressable></Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Money({ label, value }: { label: string; value: string }) { return <View style={{ flex: 1, gap: 4 }}><Text variant="caption">{label}</Text><Text variant="h2">{value}</Text></View>; }

function createStyles(c: SemanticColors, tokens: DesignTokens) { return {
  container: { flex: 1, backgroundColor: c.canvas }, content: { paddingBottom: 48 }, center: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: space.md, backgroundColor: c.canvas },
  hero: { height: 300, backgroundColor: c.gray100 }, image: { width: '100%' as const, height: '100%' as const }, back: { position: 'absolute' as const, top: space.md, left: space.md, width: 44, height: 44, borderRadius: 22, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: c.surface }, sponsored: { position: 'absolute' as const, right: space.md, bottom: space.md, borderRadius: radii.sm, backgroundColor: c.surface, paddingHorizontal: space.sm, paddingVertical: 6 },
  body: { padding: space.md, gap: space.md }, prototype: { alignSelf: 'flex-start' as const, borderRadius: radii.sm, backgroundColor: c.accentMuted, paddingHorizontal: space.sm, paddingVertical: 6 }, actions: { gap: space.sm },
  opportunity: { gap: space.sm, borderRadius: radii.lg, backgroundColor: c.surface, padding: space.md, ...tokens.elevation.hairline }, moneyRow: { flexDirection: 'row' as const, gap: space.md, borderRadius: radii.md, backgroundColor: c.accentMuted, padding: space.md },
  concepts: { gap: space.sm, paddingRight: space.md }, concept: { width: 220, minHeight: 180, justifyContent: 'flex-end' as const, gap: space.xs, borderRadius: radii.md, backgroundColor: c.surface, padding: space.md, ...tokens.elevation.hairline }, play: { width: 42, height: 42, borderRadius: 21, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: c.ink },
  products: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.sm }, product: { width: '48%' as const, gap: space.xs, borderRadius: radii.md, backgroundColor: c.surface, padding: space.sm, ...tokens.elevation.hairline }, productImage: { width: '100%' as const, aspectRatio: 1, borderRadius: radii.sm },
  details: { gap: space.sm, borderTopWidth: 1, borderColor: c.border, paddingTop: space.md }, detailRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm }, flex: { flex: 1 },
  modalBackdrop: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: 'rgba(0,0,0,0.55)', padding: space.lg }, modalCard: { width: '100%' as const, gap: space.md, borderRadius: radii.lg, backgroundColor: c.surface, padding: space.lg },
}; }
