import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useCampaign } from '../../../features/campaigns/api/campaigns';
import { campaignAssetUrls } from '../../../features/campaigns/api/signed-urls';
import { useJoinCampaign, useMyEntry } from '../../../features/campaigns/api/submissions';
import { describeDeadline, SubmissionStatusTag } from '../../../features/campaigns/components/StatusTag';
import { isAcceptingEntries } from '../../../features/campaigns/domain/campaign-status';
import { USAGE_RIGHTS } from '../../../features/campaigns/domain/campaign-schema';
import { allocateToWinners } from '../../../features/campaigns/domain/winner-selection';
import {
  Button,
  MerchantIdentityRow,
  Money,
  PinnedActionBar,
  Rule,
  Skeleton,
  StackScreenTemplate,
  StrokedImage,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';

const PLACE_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

export default function CampaignDetailScreen() {
  const styles = useThemedStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const campaignId = Number(id);
  const { isSignedIn } = useAuth();

  const { data: campaign, isLoading, refetch } = useCampaign(campaignId);
  const { data: entry } = useMyEntry(campaignId);
  const join = useJoinCampaign();
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <StackScreenTemplate title="Campaign" fallbackHref="/(shop)">
        <Skeleton style={styles.heroSkeleton} />
        <Skeleton style={styles.lineSkeleton} />
        <Skeleton style={styles.blockSkeleton} />
      </StackScreenTemplate>
    );
  }

  if (!campaign) {
    return (
      <StackScreenTemplate title="Campaign" fallbackHref="/(shop)">
        <Text variant="h1">Campaign unavailable</Text>
        <Text variant="body">This brief could not be loaded. Nothing you saved has changed.</Text>
        <Button onPress={() => refetch()}>Try again</Button>
      </StackScreenTemplate>
    );
  }

  const open = isAcceptingEntries(campaign);
  const rights = USAGE_RIGHTS.find(r => r.value === campaign.usage_rights);
  const assetUrls = campaignAssetUrls(campaign.brand_asset_paths);

  const splits =
    campaign.pot_value != null
      ? allocateToWinners([1, 2, 3, 4, 5], campaign.pot_value, campaign.pot_splits)
      : [];

  const onJoin = async () => {
    setError(null);
    if (!isSignedIn) {
      router.push(`/auth?returnTo=/opportunity/${campaignId}`);
      return;
    }
    try {
      await join.mutateAsync(campaignId);
      router.push(`/opportunity/${campaignId}/submit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join this campaign');
    }
  };

  const footer = (
    <PinnedActionBar>
      {error ? (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      ) : null}

      {!open ? (
        <>
          <Text variant="caption" style={styles.muted}>
            This campaign is closed to new entries.
          </Text>
          <Button disabled disabledReason="This campaign has closed">
            Closed
          </Button>
        </>
      ) : entry && entry.status !== 'draft' ? (
        <>
          <Text variant="caption" style={styles.muted}>
            Your entry is in. We will tell you when {campaign.brand_name} reviews it.
          </Text>
          <Button variant="secondary" onPress={() => router.push('/(shop)/entries')}>
            View your entry
          </Button>
        </>
      ) : entry ? (
        <>
          <Text variant="caption" style={styles.muted}>
            You joined. Upload your content to enter.
          </Text>
          <Button onPress={() => router.push(`/opportunity/${campaignId}/submit`)}>
            Submit content
          </Button>
        </>
      ) : (
        <>
          <Text variant="caption" style={styles.muted}>
            Free to enter. {describeDeadline(campaign.deadline)}.
          </Text>
          <Button onPress={onJoin} loading={join.isPending}>
            Join this campaign
          </Button>
        </>
      )}
    </PinnedActionBar>
  );

  return (
    <StackScreenTemplate title="Campaign" fallbackHref="/(shop)" footer={footer}>
      <StrokedImage source={{ uri: campaign.image_url }} style={styles.hero} contentFit="cover" />

      <MerchantIdentityRow
        merchant={{ id: campaign.shop_id ?? 0, name: campaign.brand_name, location: '' }}
      />

      <View style={styles.titleRow}>
        <Text variant="display" style={styles.flex}>
          {campaign.title}
        </Text>
        {entry ? <SubmissionStatusTag status={entry.status} /> : null}
      </View>

      <Text variant="body" style={styles.muted}>
        {campaign.description}
      </Text>

      <View style={styles.payout}>
        <Text variant="label">Prize pot</Text>
        <Money amount={Number(campaign.pot_value ?? 0)} format="prize" emphasis="hero" />
        <Text variant="caption" style={styles.muted}>
          {describeDeadline(campaign.deadline)}
        </Text>
      </View>

      {splits.length > 0 ? (
        <View style={styles.splits}>
          <Text variant="label">How the pot splits</Text>
          {splits.map(s => (
            <View key={s.rank} style={styles.splitRow}>
              <Text variant="body">{PLACE_LABELS[s.rank - 1]}</Text>
              <Money amount={s.prize} format="charge" emphasis="body" />
            </View>
          ))}
          <Text variant="caption" style={styles.muted}>
            {campaign.brand_name} picks the winners. Fewer winners means bigger shares.
          </Text>
        </View>
      ) : null}

      <Rule />

      <Text variant="label">What to make</Text>
      <Text variant="body">
        {campaign.deliverable_count} {campaign.content_format === 'photo' ? 'photo' : 'video'}
        {campaign.deliverable_count === 1 ? '' : 's'}
        {campaign.video_max_seconds
          ? `, ${campaign.video_min_seconds ?? 0}–${campaign.video_max_seconds} seconds`
          : ''}
        .
      </Text>

      <BulletSection title="Talking points" items={campaign.talking_points} />
      <BulletSection title="Do" items={campaign.dos} />
      <BulletSection title="Don't" items={campaign.donts} />

      {assetUrls.length > 0 ? (
        <>
          <Rule />
          <Text variant="label">Brand assets</Text>
          <View style={styles.assets}>
            {assetUrls.map(url => (
              <StrokedImage key={url} source={{ uri: url }} style={styles.asset} contentFit="cover" />
            ))}
          </View>
        </>
      ) : null}

      <Rule />

      <Text variant="label">The terms</Text>
      <Text variant="body">{rights?.label ?? 'Usage rights apply'}</Text>
      <Text variant="caption" style={styles.muted}>
        {rights?.detail}
      </Text>
      <Text variant="caption" style={styles.muted}>
        {campaign.revisions_allowed > 0
          ? `${campaign.brand_name} may ask for up to ${campaign.revisions_allowed} round(s) of changes.`
          : 'No revisions — entries are approved or declined as submitted.'}{' '}
        Entries are reviewed within {campaign.review_sla_days} days.
      </Text>
    </StackScreenTemplate>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  const styles = useThemedStyles(createStyles);
  if (!items || items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text variant="label">{title}</Text>
      {items.map(item => (
        <View key={item} style={styles.bulletRow}>
          <Text variant="body">•</Text>
          <Text variant="body" style={styles.flex}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    hero: { height: 250, width: '100%' as const },
    heroSkeleton: { height: 250 },
    lineSkeleton: { height: 34, width: '70%' as const },
    blockSkeleton: { height: 180 },
    titleRow: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: space.sm },
    flex: { flex: 1 },
    payout: {
      borderWidth: 2,
      borderColor: c.stroke,
      backgroundColor: c.surfaceSunken,
      padding: space.md,
      gap: space.xxs,
    },
    splits: { gap: space.xxs },
    splitRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    section: { gap: space.xxs },
    bulletRow: { flexDirection: 'row' as const, gap: space.xs, alignItems: 'flex-start' as const },
    assets: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.xs },
    asset: { width: '31%' as const, aspectRatio: 1 },
    muted: { color: c.inkMuted },
    error: { color: c.danger },
  };
}
