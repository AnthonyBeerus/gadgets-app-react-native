import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AssetPlayer } from '../../../shared/components/media/AssetPlayer';
import {
  Button,
  EmptyState,
  Money,
  PinnedActionBar,
  Rule,
  StackScreenTemplate,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import {
  useCampaign,
  useSelectCampaignWinners,
  useSettleCampaign,
  type WinnerPreview,
} from '../api/campaigns';
import { useSignedSubmissionUrl } from '../api/signed-urls';
import { useCampaignSubmissions, type SubmissionWithCreator } from '../api/submissions';
import { MAX_WINNERS, allocateToWinners } from '../domain/winner-selection';

const PLACE_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

export default function WinnerSelectionScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Number(id);

  const { data: campaign } = useCampaign(campaignId);
  const { data: submissions } = useCampaignSubmissions(campaignId);
  const selectWinners = useSelectCampaignWinners();
  const settle = useSettleCampaign();

  const [ranked, setRanked] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<WinnerPreview | null>(null);

  const approved = useMemo(
    () => (submissions ?? []).filter(s => s.status === 'approved'),
    [submissions],
  );

  // Live estimate while the merchant is still tapping. It mirrors campaign_prize_for_rank,
  // but the server's numbers are what they actually confirm against before settling.
  const allocations = useMemo(() => {
    if (ranked.length === 0 || !campaign?.pot_value) return [];
    try {
      return allocateToWinners(ranked, campaign.pot_value, campaign.pot_splits);
    } catch {
      return [];
    }
  }, [campaign?.pot_splits, campaign?.pot_value, ranked]);

  const toggle = (submissionId: number) => {
    setError(null);
    setRanked(prev => {
      if (prev.includes(submissionId)) return prev.filter(x => x !== submissionId);
      if (prev.length >= MAX_WINNERS) return prev;
      return [...prev, submissionId];
    });
  };

  // Two steps on purpose: assign the ranks, show the merchant the payout the server
  // actually computed, and only settle once they have seen those numbers.
  const preview = async () => {
    setError(null);
    try {
      setConfirmed(
        await selectWinners.mutateAsync({ challengeId: campaignId, rankedSubmissionIds: ranked }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not work out the payout');
    }
  };

  const confirm = async () => {
    setError(null);
    try {
      await settle.mutateAsync(campaignId);
      router.replace(`/(merchant)/campaigns/${campaignId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not pay the winners');
      setConfirmed(null);
    }
  };

  if (approved.length === 0) {
    return (
      <StackScreenTemplate title="Pick winners" fallbackHref={`/(merchant)/campaigns/${campaignId}`}>
        <EmptyState
          title="Approve some entries first"
          rule="Only approved submissions can win. Review the entries, then come back."
          actionLabel="Review submissions"
          onAction={() => router.push(`/(merchant)/campaigns/${campaignId}/submissions`)}
        />
      </StackScreenTemplate>
    );
  }

  return (
    <StackScreenTemplate
      title="Pick winners"
      fallbackHref={`/(merchant)/campaigns/${campaignId}`}
      footer={
        <PinnedActionBar>
          {confirmed ? (
            <View style={styles.confirm}>
              {confirmed.winners.map(winner => (
                <View key={winner.rank} style={styles.previewRow}>
                  <Text variant="body">{PLACE_LABELS[winner.rank - 1]}</Text>
                  <Money amount={winner.prize_value} format="charge" emphasis="body" />
                </View>
              ))}
              <Text variant="body">
                Pay {confirmed.winners.length} winner{confirmed.winners.length === 1 ? '' : 's'} and
                close this campaign? This cannot be undone.
              </Text>
              <View style={styles.actions}>
                <Button variant="outline" onPress={() => setConfirmed(null)} style={styles.action}>
                  Cancel
                </Button>
                <Button onPress={confirm} loading={settle.isPending} style={styles.action}>
                  Pay winners
                </Button>
              </View>
            </View>
          ) : (
            <Button
              onPress={preview}
              loading={selectWinners.isPending}
              disabled={ranked.length === 0}
              disabledReason="Tap entries in the order they placed"
            >
              Review payout
            </Button>
          )}
        </PinnedActionBar>
      }
    >
      <Text variant="body">
        Tap entries in the order they placed. The whole pot is shared between the winners you pick.
      </Text>

      {allocations.length > 0 ? (
        <Surface style={styles.preview}>
          <Text variant="label">Payout</Text>
          {allocations.map(allocation => (
            <View key={allocation.rank} style={styles.previewRow}>
              <Text variant="body">{PLACE_LABELS[allocation.rank - 1]}</Text>
              <Money amount={allocation.prize} format="charge" emphasis="body" />
            </View>
          ))}
        </Surface>
      ) : null}

      {error ? (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Rule />

      {approved.map(submission => (
        <WinnerCandidate
          key={submission.id}
          submission={submission}
          place={ranked.indexOf(submission.id)}
          onToggle={() => toggle(submission.id)}
        />
      ))}
    </StackScreenTemplate>
  );
}

function WinnerCandidate({
  submission,
  place,
  onToggle,
}: {
  submission: SubmissionWithCreator;
  place: number;
  onToggle: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { data: signedUrl } = useSignedSubmissionUrl(submission.asset_paths?.[0] ?? null);
  const mimeType =
    submission.asset_meta?.[0]?.mime ??
    (submission.media_type === 'video' ? 'video/mp4' : 'image/jpeg');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: place >= 0 }}
      onPress={onToggle}
    >
      <Surface style={[styles.card, place >= 0 && styles.cardSelected]}>
        <View style={styles.cardTop}>
          <Text variant="label" style={styles.creator}>
            {submission.creator?.full_name ?? 'Creator'}
          </Text>
          <Text variant="label">{place >= 0 ? PLACE_LABELS[place] : 'Tap to rank'}</Text>
        </View>
        <AssetPlayer uri={signedUrl ?? null} mimeType={mimeType} />
      </Surface>
    </Pressable>
  );
}

function createStyles(c: SemanticColors) {
  return {
    preview: { padding: space.md, gap: space.xs },
    previewRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    card: { padding: space.md, gap: space.sm, borderWidth: 2, borderColor: 'transparent' },
    cardSelected: { borderColor: c.stroke, backgroundColor: c.surfaceSunken },
    cardTop: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    creator: { flex: 1 },
    confirm: { gap: space.sm },
    actions: { flexDirection: 'row' as const, gap: space.sm },
    action: { flex: 1 },
    error: { color: c.danger },
  };
}
