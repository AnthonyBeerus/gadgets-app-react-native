import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  Button,
  ErrorNotice,
  Money,
  Rule,
  Skeleton,
  StackScreenTemplate,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import {
  useCampaign,
  useCampaignResults,
  useCloseCampaign,
  usePublishCampaign,
  useSettleCampaign,
} from '../api/campaigns';
import { CampaignStatusTag, describeDeadline } from '../components/StatusTag';
import { nextMerchantActions, type MerchantAction } from '../domain/campaign-status';

export default function CampaignDashboardScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Number(id);

  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const { data: results } = useCampaignResults(campaignId);
  const publish = usePublishCampaign();
  const close = useCloseCampaign();
  const settle = useSettleCampaign();
  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading || !campaign) {
    return (
      <StackScreenTemplate title="Campaign" fallbackHref="/(merchant)/campaigns">
        {error ? (
          <ErrorNotice
            title="Could not load this campaign"
            impact="We could not reach Muse just now."
            recovery="Go back and try again in a moment."
          />
        ) : (
          <>
            <Skeleton style={styles.skeleton} />
            <Skeleton style={styles.skeleton} />
          </>
        )}
      </StackScreenTemplate>
    );
  }

  const actions = nextMerchantActions({
    status: campaign.status,
    deadline: campaign.deadline,
    approvedCount: results?.approved ?? 0,
    rankedCount: results?.winners ?? 0,
  });

  const run = async (action: MerchantAction) => {
    setActionError(null);
    try {
      switch (action) {
        case 'edit':
          router.push('/(merchant)/campaigns/new');
          return;
        case 'publish':
          await publish.mutateAsync(campaignId);
          return;
        case 'close':
          await close.mutateAsync(campaignId);
          return;
        case 'review_submissions':
          router.push(`/(merchant)/campaigns/${campaignId}/submissions`);
          return;
        case 'select_winners':
          router.push(`/(merchant)/campaigns/${campaignId}/winners`);
          return;
        case 'settle':
          await settle.mutateAsync(campaignId);
          return;
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'That did not work. Try again.');
    }
  };

  const busy = publish.isPending || close.isPending || settle.isPending;

  return (
    <StackScreenTemplate title={campaign.title} fallbackHref="/(merchant)/campaigns">
      <View style={styles.header}>
        <CampaignStatusTag status={campaign.status} />
        <Text variant="caption" style={styles.muted}>
          {campaign.status === 'settled' ? 'Prizes paid' : describeDeadline(campaign.deadline)}
        </Text>
      </View>

      {campaign.pot_value != null ? (
        <View style={styles.potRow}>
          <Text variant="label">Prize pot</Text>
          <Money amount={campaign.pot_value} format="prize" emphasis="hero" />
        </View>
      ) : null}

      <Rule />

      <Text variant="label">Submissions</Text>
      <View style={styles.stats}>
        <Stat label="In review" value={results?.submitted ?? 0} />
        <Stat label="Changes asked" value={results?.revision_requested ?? 0} />
        <Stat label="Approved" value={results?.approved ?? 0} />
        <Stat label="Not selected" value={results?.rejected ?? 0} />
      </View>

      {actionError ? (
        <Text variant="caption" style={styles.error}>
          {actionError}
        </Text>
      ) : null}

      <Rule />

      <View style={styles.actions}>
        {actions.map((action, index) => (
          <Button
            key={action}
            variant={index === 0 ? 'primary' : 'outline'}
            onPress={() => run(action)}
            loading={busy && index === 0}
          >
            {ACTION_LABELS[action]}
          </Button>
        ))}
      </View>
    </StackScreenTemplate>
  );
}

const ACTION_LABELS: Record<MerchantAction, string> = {
  edit: 'Edit the brief',
  publish: 'Publish campaign',
  review_submissions: 'Review submissions',
  close: 'Close the campaign',
  select_winners: 'Pick winners',
  settle: 'Pay the winners',
};

function Stat({ label, value }: { label: string; value: number }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Surface style={styles.stat}>
      <Text variant="h1">{value}</Text>
      <Text variant="caption" style={styles.muted}>
        {label}
      </Text>
    </Surface>
  );
}

function createStyles(c: SemanticColors) {
  return {
    skeleton: { height: 96 },
    header: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    potRow: { gap: space.xxs },
    stats: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.sm },
    stat: { flexBasis: '47%' as const, flexGrow: 1, padding: space.md, gap: 2 },
    actions: { gap: space.sm },
    muted: { color: c.inkMuted },
    error: { color: c.danger },
  };
}
