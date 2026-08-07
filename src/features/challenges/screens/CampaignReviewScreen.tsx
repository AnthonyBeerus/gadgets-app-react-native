import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Text,
  Button,
  Surface,
  Tag,
  space,
  radii,
  fonts,
  useDesignTokens,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import {
  AdminSubmission,
  useAdminSubmissions,
  useMarkManuallyVerified,
  useRefreshSubmissionMetrics,
  useReviewSubmission,
} from '../api/submissions';
import { ChallengeSubmission } from '../types/challenge';

const FILTERS: Array<{ key: ChallengeSubmission['status'] | 'all'; label: string }> = [
  { key: 'pending', label: 'To review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];
const REJECTION_REASONS = [
  'Post does not match the brief',
  'Post is not public',
  'Account ownership could not be verified',
  'Post was published outside the opportunity window',
];

export default function CampaignReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const [filter, setFilter] = useState<ChallengeSubmission['status'] | 'all'>('pending');
  const submissions = useAdminSubmissions(filter);
  const review = useReviewSubmission();
  const markVerified = useMarkManuallyVerified();
  const refreshMetrics = useRefreshSubmissionMetrics();
  const [metricsDraft, setMetricsDraft] = useState<
    Record<number, { likes: string; comments: string; saves: string; views: string }>
  >({});

  const reject = (item: AdminSubmission) =>
    Alert.alert('Reject submission', 'Select the reason shown to the creator.', [
      ...REJECTION_REASONS.map(reason => ({
        text: reason,
        onPress: () =>
          review.mutate({
            submissionId: item.id,
            decision: 'rejected',
            rejectionReason: reason,
          }),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);

  const draftFor = (item: AdminSubmission) =>
    metricsDraft[item.id] ?? {
      likes: String(item.like_count ?? 0),
      comments: String(item.comment_count ?? 0),
      saves: String(item.save_count ?? 0),
      views: String(item.view_count ?? 0),
    };

  const renderItem = ({ item }: { item: AdminSubmission }) => {
    const verified = ['api_verified', 'manually_verified'].includes(item.verification_status);
    const competitive = item.challenge?.contest_mode === 'competitive_pot';
    const draft = draftFor(item);
    return (
      <Surface style={styles.card} elevation="hairline">
        <Text variant="caption">{item.challenge?.title ?? 'Creator opportunity'}</Text>
        <Text variant="h3">{item.post_description || 'External TikTok post'}</Text>
        <Text variant="caption">
          TikTok · {item.platform_author_open_id || 'handle unavailable'}
        </Text>
        {competitive ? (
          <Text variant="caption">
            Competitive pot · score {Number(item.score ?? 0).toFixed(0)}
          </Text>
        ) : null}
        <Tag
          label={item.verification_status.replaceAll('_', ' ')}
          tone={verified ? 'success' : 'warning'}
        />
        <Button
          variant="outline"
          onPress={() => Linking.openURL(item.public_share_url)}
          style={styles.linkButton}
        >
          Open public TikTok post
        </Button>

        {item.status === 'approved' && competitive ? (
          <View style={styles.metricsBox}>
            <Text variant="label">Engagement metrics</Text>
            {(['likes', 'comments', 'saves', 'views'] as const).map(key => (
              <TextInput
                key={key}
                style={styles.metricInput}
                keyboardType="numeric"
                value={draft[key]}
                placeholder={key}
                placeholderTextColor={colors.inkMuted}
                onChangeText={text =>
                  setMetricsDraft(prev => ({
                    ...prev,
                    [item.id]: { ...draft, [key]: text },
                  }))
                }
              />
            ))}
            <Button
              variant="secondary"
              disabled={refreshMetrics.isPending}
              onPress={() =>
                refreshMetrics.mutate({
                  submissionId: item.id,
                  likeCount: Number(draft.likes) || 0,
                  commentCount: Number(draft.comments) || 0,
                  saveCount: Number(draft.saves) || 0,
                  viewCount: Number(draft.views) || 0,
                })
              }
            >
              Save score
            </Button>
          </View>
        ) : null}

        {item.status === 'pending' ? (
          <>
            {item.verification_status === 'manual_verification_required' ? (
              <Button
                variant="secondary"
                disabled={markVerified.isPending}
                onPress={() => markVerified.mutate(item.id)}
              >
                Mark ownership + post verified
              </Button>
            ) : null}
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.action, styles.reject]} onPress={() => reject(item)}>
                <Text variant="label" color={colors.surface}>
                  Reject
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.action, styles.approve, !verified && styles.disabled]}
                disabled={!verified || review.isPending}
                onPress={() =>
                  review.mutate({ submissionId: item.id, decision: 'approved' })
                }
              >
                <Text variant="label" color={colors.surface} align="center">
                  {competitive ? 'Approve for board' : 'Approve + issue voucher'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text variant="bodyBold">
            {item.status}
            {item.rejection_reason ? ` — ${item.rejection_reason}` : ''}
          </Text>
        )}
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="Moderation" onBackPress={() => router.back()} />
      <View style={styles.filters}>
        {FILTERS.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.filter, filter === item.key && styles.filterActive]}
            onPress={() => setFilter(item.key)}
          >
            <Text
              variant="caption"
              color={filter === item.key ? colors.ink : colors.inkMuted}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {submissions.isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.ink} />
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={submissions.data ?? []}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{
            padding: space.md,
            paddingBottom: insets.bottom + 24,
            gap: space.md,
          }}
          ListEmptyComponent={
            <Text variant="body" align="center" color={colors.inkMuted} style={styles.empty}>
              No submissions in this queue.
            </Text>
          }
        />
      )}
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    container: { flex: 1, backgroundColor: c.canvas },
    filters: {
      flexDirection: 'row' as const,
      gap: space.xs,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      marginTop: 88,
    },
    filter: {
      paddingHorizontal: space.sm,
      paddingVertical: space.xs,
      borderRadius: radii.sm,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    filterActive: {
      backgroundColor: c.gray100,
      borderColor: c.border,
    },
    card: { padding: space.md, gap: space.xs },
    linkButton: { marginTop: space.xxs },
    metricsBox: {
      gap: space.xs,
      marginTop: space.xxs,
      paddingTop: space.sm,
      borderTopWidth: 1,
      borderColor: c.border,
    },
    metricInput: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      paddingHorizontal: space.sm,
      paddingVertical: space.xs,
      fontFamily: fonts.regular,
      color: c.ink,
      backgroundColor: c.surface,
    },
    actions: { flexDirection: 'row' as const, gap: space.xs, marginTop: space.xs },
    action: {
      flex: 1,
      minHeight: 44,
      borderRadius: radii.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: space.xs,
    },
    reject: { backgroundColor: c.error },
    approve: { backgroundColor: c.success },
    disabled: { opacity: 0.45 },
    empty: { marginTop: space.xxl },
  };
}
