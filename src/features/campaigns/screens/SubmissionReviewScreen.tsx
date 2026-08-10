import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { AssetPlayer } from '../../../shared/components/media/AssetPlayer';
import {
  Button,
  EmptyState,
  Input,
  Rule,
  Skeleton,
  StackScreenTemplate,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { useCampaign } from '../api/campaigns';
import { useSignedSubmissionUrl } from '../api/signed-urls';
import {
  useCampaignSubmissions,
  useReviewSubmission,
  type ReviewDecision,
  type SubmissionWithCreator,
} from '../api/submissions';
import { SubmissionStatusTag } from '../components/StatusTag';
import { canRequestRevision, type SubmissionStatus } from '../domain/campaign-status';

const FILTERS: { key: 'all' | SubmissionStatus; label: string }[] = [
  { key: 'submitted', label: 'In review' },
  { key: 'revision_requested', label: 'Changes asked' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Not selected' },
  { key: 'all', label: 'All' },
];

export default function SubmissionReviewScreen() {
  const styles = useThemedStyles(createStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Number(id);

  const { data: campaign } = useCampaign(campaignId);
  const { data: submissions, isLoading } = useCampaignSubmissions(campaignId);
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('submitted');

  const visible = useMemo(() => {
    const all = submissions ?? [];
    if (filter === 'all') return all;
    if (filter === 'submitted') {
      return all.filter(s => s.status === 'submitted' || s.status === 'under_review');
    }
    return all.filter(s => s.status === filter);
  }, [filter, submissions]);

  return (
    <StackScreenTemplate
      title="Submissions"
      fallbackHref={`/(merchant)/campaigns/${campaignId}`}
    >
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <Pressable
            key={f.key}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === f.key }}
            onPress={() => setFilter(f.key)}
            style={[styles.filter, filter === f.key && styles.filterActive]}
          >
            <Text variant="caption">{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <>
          <Skeleton style={styles.skeleton} />
          <Skeleton style={styles.skeleton} />
        </>
      ) : visible.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          rule={
            filter === 'submitted'
              ? 'When creators submit content it lands here for your review.'
              : 'No submissions match this filter.'
          }
          actionLabel="Show all"
          onAction={() => setFilter('all')}
        />
      ) : (
        visible.map(submission => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            campaignId={campaignId}
            revisionsAllowed={campaign?.revisions_allowed ?? 0}
          />
        ))
      )}
    </StackScreenTemplate>
  );
}

function SubmissionCard({
  submission,
  campaignId,
  revisionsAllowed,
}: {
  submission: SubmissionWithCreator;
  campaignId: number;
  revisionsAllowed: number;
}) {
  const styles = useThemedStyles(createStyles);
  const review = useReviewSubmission(campaignId);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const primaryPath = submission.asset_paths?.[0] ?? null;
  const { data: signedUrl } = useSignedSubmissionUrl(primaryPath);
  const mimeType = submission.asset_meta?.[0]?.mime ?? (submission.media_type === 'video' ? 'video/mp4' : 'image/jpeg');

  const isOpen = submission.status === 'submitted' || submission.status === 'under_review';
  const revisionAvailable = canRequestRevision(submission.revision_count, revisionsAllowed);

  const decide = async (decision: ReviewDecision) => {
    setError(null);
    try {
      await review.mutateAsync({ submissionId: submission.id, decision, note: note.trim() || undefined });
      setNote('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save that decision');
    }
  };

  return (
    <Surface style={styles.card}>
      <View style={styles.cardTop}>
        <Text variant="label" style={styles.creator}>
          {submission.creator?.full_name ?? 'Creator'}
        </Text>
        <SubmissionStatusTag status={submission.status} />
      </View>

      <AssetPlayer uri={signedUrl ?? null} mimeType={mimeType} />

      {submission.asset_paths.length > 1 ? (
        <Text variant="caption" style={styles.muted}>
          +{submission.asset_paths.length - 1} more file(s) in this entry
        </Text>
      ) : null}

      {submission.caption ? <Text variant="body">{submission.caption}</Text> : null}

      {submission.public_share_url ? (
        <Text variant="caption" style={styles.muted}>
          Also posted at {submission.public_share_url}
        </Text>
      ) : null}

      {submission.merchant_note ? (
        <Text variant="caption" style={styles.muted}>
          Your note: {submission.merchant_note}
        </Text>
      ) : null}

      {isOpen ? (
        <>
          <Rule />
          <Input
            label="Note to the creator"
            placeholder={
              revisionAvailable
                ? 'Required if you ask for changes'
                : 'Optional — explain a rejection'
            }
            value={note}
            onChangeText={setNote}
            multiline
          />
          {error ? (
            <Text variant="caption" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button onPress={() => decide('approved')} loading={review.isPending} style={styles.action}>
              Approve
            </Button>
            {revisionAvailable ? (
              <Button
                variant="secondary"
                onPress={() => decide('revision_requested')}
                style={styles.action}
              >
                Ask for changes
              </Button>
            ) : null}
            <Button variant="outline" onPress={() => decide('rejected')} style={styles.action}>
              Reject
            </Button>
          </View>
        </>
      ) : null}
    </Surface>
  );
}

function createStyles(c: SemanticColors) {
  return {
    filters: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: space.xs },
    filter: {
      borderWidth: 2,
      borderColor: c.strokeDim,
      paddingHorizontal: space.sm,
      paddingVertical: space.xxs,
    },
    filterActive: { borderColor: c.stroke, backgroundColor: c.surfaceSunken },
    skeleton: { height: 220 },
    card: { padding: space.md, gap: space.sm },
    cardTop: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    creator: { flex: 1 },
    actions: { gap: space.xs },
    action: { width: '100%' as const },
    muted: { color: c.inkMuted },
    error: { color: c.danger },
  };
}
