import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { getCreatorOpportunityFeed } from '../../features/discovery/api';
import {
  Button,
  Chip,
  EligibilityExplainer,
  MerchantIdentityRow,
  Money,
  PinnedActionBar,
  Rule,
  Skeleton,
  StackScreenTemplate,
  StrokedImage,
  Text,
  useDesignTokens,
} from '../../shared/design-system';

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

  if (query.isLoading) return <StackScreenTemplate title="Opportunity" fallbackHref="/(shop)" scrollProps={{ contentContainerStyle: styles.content }}>
    <Skeleton style={styles.heroSkeleton} />
    <Skeleton style={styles.lineSkeleton} />
    <Skeleton style={styles.blockSkeleton} />
  </StackScreenTemplate>;

  if (!item) return <StackScreenTemplate title="Opportunity" fallbackHref="/(shop)">
    <Text variant="h1">Opportunity unavailable</Text>
    <Text variant="body">This brief could not be loaded. Nothing about your saved briefs or bag has changed.</Text>
    <Button onPress={() => query.refetch()}>Try again</Button>
  </StackScreenTemplate>;

  // A qualifying purchase is what unlocks entry, so the footer follows eligibility:
  // buy first, or — once proof exists and is unspent — go straight to the entry form.
  const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed && !item.is_prototype);
  const footer = eligible
    ? <PinnedActionBar>
        <Text variant="caption">You are eligible to enter. Acceptance is still reviewed before any payout.</Text>
        <Button variant="commerce" onPress={() => router.push(`/challenges/entry/${item.opportunity_id}`)}>Enter this brief</Button>
      </PinnedActionBar>
    : <PinnedActionBar>
        <Text variant="caption">{item.is_prototype ? 'Illustrative · not a live payable brief' : 'Qualifying purchase required'}</Text>
        <Button
          variant="commerce"
          disabled={item.is_prototype}
          disabledReason={item.is_prototype ? 'Illustrative briefs have no payable products.' : undefined}
          onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: item.product_slug, source: 'discover', opportunityId: item.opportunity_id } })}
        >
          See qualifying products
        </Button>
      </PinnedActionBar>;

  return <StackScreenTemplate
    title="Opportunity"
    fallbackHref="/(shop)"
    footer={footer}
    scrollProps={{ contentContainerStyle: styles.content }}
  >
    <View style={styles.heroFrame}>
      <StrokedImage source={{ uri: item.hero_image }} style={styles.hero} contentFit="cover" />
      <View style={styles.badges}>
        {item.is_prototype ? <Chip kind="disclosure" tone="illustrative" label="ILLUSTRATIVE" /> : <View />}
        <Chip kind="disclosure" tone="tiktok" label="TIKTOK" />
      </View>
    </View>
    <MerchantIdentityRow merchant={{ id: item.merchant_id, name: item.merchant_name, location: item.merchant_location }} />
    <Text variant="display">{item.opportunity_title}</Text>
    <Text variant="body" color={colors.inkMuted}>{item.opportunity_description}</Text>
    <View style={[styles.payout, { backgroundColor: colors.ink, borderColor: colors.stroke }]}>
      <Text variant="label" color={colors.payout}>Prize pot</Text>
      <Money amount={Number(item.pot_value ?? 0)} format="prize" emphasis="hero" style={{ color: colors.payout }} />
      <Text variant="body" color={colors.onInk}>
        <Money amount={item.accepted_entry_fee} format="payout" emphasis="strong" style={{ color: colors.onInk }} /> per accepted entry
      </Text>
    </View>
    <Rule />
    <Text variant="label">How it works</Text>
    <EligibilityExplainer />
    <Rule />
    <Text variant="label">What to make</Text>
    {item.requirements.map(requirement => (
      <View key={requirement} style={styles.requirement}>
        <View style={[styles.bullet, { backgroundColor: colors.creator, borderColor: colors.stroke }]} />
        <Text variant="body" style={styles.flex}>{requirement}</Text>
      </View>
    ))}
  </StackScreenTemplate>;
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 150, gap: 14 },
  heroFrame: { position: 'relative' },
  hero: { height: 250, width: '100%' },
  badges: { position: 'absolute', left: 12, right: 12, top: 12, flexDirection: 'row', justifyContent: 'space-between' },
  payout: { borderWidth: 2, padding: 16, gap: 7 },
  requirement: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 18, height: 18, borderWidth: 2 },
  flex: { flex: 1 },
  heroSkeleton: { height: 250 },
  lineSkeleton: { height: 34, width: '70%' },
  blockSkeleton: { height: 180 },
});
