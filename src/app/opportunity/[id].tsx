import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getCreatorOpportunityFeed } from '../../features/discovery/api';
import { Button, EligibilityExplainer, MerchantIdentityRow, Money, PinnedActionBar, Rule, StackScreenTemplate, Text, useDesignTokens } from '../../shared/design-system';

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useDesignTokens();
  const opportunityId = Number(id);
  const query = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => (await getCreatorOpportunityFeed({ limit: 200, includeHiddenPreferences: true })).find(item => item.opportunity_id === opportunityId) ?? null,
    staleTime: 60_000,
    retry: 2,
  });
  const item = query.data;
  if (query.isLoading) return <StackScreenTemplate title="Opportunity" fallbackHref="/(shop)"><View style={[styles.skeleton, { borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }]} /></StackScreenTemplate>;
  if (!item) return <StackScreenTemplate title="Opportunity" fallbackHref="/(shop)"><Text variant="h1">Opportunity unavailable</Text><Text variant="body">This brief could not be loaded.</Text><Button onPress={() => query.refetch()}>Try again</Button></StackScreenTemplate>;
  return <StackScreenTemplate
    title="Opportunity"
    fallbackHref="/(shop)"
    footer={<PinnedActionBar><Text variant="caption">{item.is_prototype ? 'Illustrative · not a live payable brief' : 'Qualifying purchase required'}</Text><Button variant="commerce" onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: item.product_slug, source: 'discover', opportunityId: item.opportunity_id } })}>See qualifying products</Button></PinnedActionBar>}
    scrollProps={{ contentContainerStyle: styles.content }}
  >
    <Image source={{ uri: item.hero_image }} style={[styles.hero, { borderColor: colors.stroke }]} contentFit="cover" />
    <MerchantIdentityRow merchant={{ id: item.merchant_id, name: item.merchant_name, location: item.merchant_location }} />
    <Text variant="display">{item.opportunity_title}</Text>
    <Text variant="body" color={colors.inkMuted}>{item.opportunity_description}</Text>
    <View style={[styles.payout, { backgroundColor: colors.ink, borderColor: colors.stroke }]}><Text variant="label" color={colors.onInk}>Prize pot</Text><Money amount={Number(item.pot_value ?? 0)} format="prize" emphasis="hero" style={{ color: colors.payout }} /><Text variant="body" color={colors.onInk}><Money amount={item.accepted_entry_fee} format="payout" emphasis="strong" style={{ color: colors.onInk }} /> per accepted entry</Text></View>
    <Rule />
    <Text variant="label">How it works</Text><EligibilityExplainer />
    <Rule />
    <Text variant="label">What to make</Text>{item.requirements.map(requirement => <View key={requirement} style={styles.requirement}><View style={[styles.bullet, { backgroundColor: colors.creator, borderColor: colors.stroke }]} /><Text variant="body" style={styles.flex}>{requirement}</Text></View>)}
  </StackScreenTemplate>;
}

const styles = StyleSheet.create({ content: { padding: 16, paddingBottom: 150, gap: 14 }, hero: { height: 250, borderWidth: 2 }, payout: { borderWidth: 2, padding: 16, gap: 7 }, requirement: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 }, bullet: { width: 18, height: 18, borderWidth: 2 }, flex: { flex: 1 }, skeleton: { height: 520, borderWidth: 2 } });
