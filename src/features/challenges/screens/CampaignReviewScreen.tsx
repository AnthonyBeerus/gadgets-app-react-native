import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
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
  { key: 'pending', label: 'TO REVIEW' }, { key: 'approved', label: 'APPROVED' },
  { key: 'rejected', label: 'REJECTED' }, { key: 'all', label: 'ALL' },
];
const REJECTION_REASONS = ['Post does not match the brief', 'Post is not public', 'Account ownership could not be verified', 'Post was published outside the opportunity window'];

export default function CampaignReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ChallengeSubmission['status'] | 'all'>('pending');
  const submissions = useAdminSubmissions(filter);
  const review = useReviewSubmission();
  const markVerified = useMarkManuallyVerified();
  const refreshMetrics = useRefreshSubmissionMetrics();
  const [metricsDraft, setMetricsDraft] = useState<Record<number, { likes: string; comments: string; saves: string; views: string }>>({});

  const reject = (item: AdminSubmission) => Alert.alert('Reject submission', 'Select the reason shown to the creator.', [
    ...REJECTION_REASONS.map(reason => ({ text: reason, onPress: () => review.mutate({ submissionId: item.id, decision: 'rejected', rejectionReason: reason }) })),
    { text: 'Cancel', style: 'cancel' },
  ]);

  const draftFor = (item: AdminSubmission) => metricsDraft[item.id] ?? {
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
      <View style={styles.card}>
        <Text style={styles.eyebrow}>{item.challenge?.title ?? 'CREATOR OPPORTUNITY'}</Text>
        <Text style={styles.title}>{item.post_description || 'External TikTok post'}</Text>
        <Text style={styles.meta}>TikTok · {item.platform_author_open_id || 'handle unavailable'}</Text>
        {competitive ? <Text style={styles.meta}>Competitive pot · score {Number(item.score ?? 0).toFixed(0)}</Text> : null}
        <View style={[styles.badge, verified ? styles.verified : styles.manual]}>
          <Text style={styles.badgeText}>{item.verification_status.replaceAll('_', ' ').toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL(item.public_share_url)}>
          <Text style={styles.linkText}>OPEN PUBLIC TIKTOK POST</Text>
        </TouchableOpacity>

        {item.status === 'approved' && competitive ? (
          <View style={styles.metricsBox}>
            <Text style={styles.metricsTitle}>ENGAGEMENT METRICS</Text>
            {(['likes', 'comments', 'saves', 'views'] as const).map(key => (
              <TextInput
                key={key}
                style={styles.metricInput}
                keyboardType="numeric"
                value={draft[key]}
                placeholder={key}
                onChangeText={text => setMetricsDraft(prev => ({
                  ...prev,
                  [item.id]: { ...draft, [key]: text },
                }))}
              />
            ))}
            <TouchableOpacity
              style={styles.secondaryButton}
              disabled={refreshMetrics.isPending}
              onPress={() => refreshMetrics.mutate({
                submissionId: item.id,
                likeCount: Number(draft.likes) || 0,
                commentCount: Number(draft.comments) || 0,
                saveCount: Number(draft.saves) || 0,
                viewCount: Number(draft.views) || 0,
              })}
            >
              <Text style={styles.secondaryText}>SAVE SCORE</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {item.status === 'pending' ? (
          <>
            {item.verification_status === 'manual_verification_required' ? (
              <TouchableOpacity style={styles.secondaryButton} disabled={markVerified.isPending} onPress={() => markVerified.mutate(item.id)}>
                <Text style={styles.secondaryText}>MARK OWNERSHIP + POST VERIFIED</Text>
              </TouchableOpacity>
            ) : null}
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.action, styles.reject]} onPress={() => reject(item)}><Text style={styles.actionText}>REJECT</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.action, styles.approve, !verified && styles.disabled]} disabled={!verified || review.isPending}
                onPress={() => review.mutate({ submissionId: item.id, decision: 'approved' })}>
                <Text style={styles.actionText}>{competitive ? 'APPROVE FOR BOARD' : 'APPROVE + ISSUE VOUCHER'}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : <Text style={styles.outcome}>{item.status.toUpperCase()}{item.rejection_reason ? ` — ${item.rejection_reason}` : ''}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StaticHeader title="MUSE MODERATION" onBackPress={() => router.back()} />
      <View style={styles.filters}>{FILTERS.map(item => (
        <TouchableOpacity key={item.key} style={[styles.filter, filter === item.key && styles.filterActive]} onPress={() => setFilter(item.key)}>
          <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}</View>
      {submissions.isLoading ? <ActivityIndicator style={{ marginTop: 60 }} color={NEO_THEME.colors.primary} /> : (
        <FlatList contentInsetAdjustmentBehavior="automatic" data={submissions.data ?? []} renderItem={renderItem}
          keyExtractor={item => String(item.id)} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 14 }}
          ListEmptyComponent={<Text style={styles.empty}>No submissions in this queue.</Text>} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.greyLight },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black },
  filterActive: { backgroundColor: NEO_THEME.colors.secondary },
  filterText: { fontFamily: NEO_THEME.fonts.bold, fontSize: 11 },
  filterTextActive: { color: NEO_THEME.colors.black },
  card: { backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, padding: 16, gap: 8 },
  eyebrow: { fontFamily: NEO_THEME.fonts.bold, fontSize: 11, color: NEO_THEME.colors.grey },
  title: { fontFamily: NEO_THEME.fonts.black, fontSize: 18 },
  meta: { fontFamily: NEO_THEME.fonts.regular, color: NEO_THEME.colors.grey },
  badge: { alignSelf: 'flex-start', borderRadius: 999, borderWidth: 2, borderColor: NEO_THEME.colors.black, paddingHorizontal: 10, paddingVertical: 4 },
  verified: { backgroundColor: NEO_THEME.colors.success },
  manual: { backgroundColor: NEO_THEME.colors.secondary },
  badgeText: { fontFamily: NEO_THEME.fonts.bold, fontSize: 10 },
  linkButton: { minHeight: 42, justifyWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontFamily: NEO_THEME.fonts.bold },
  metricsBox: { gap: 8, marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderColor: NEO_THEME.colors.greyLight },
  metricsTitle: { fontFamily: NEO_THEME.fonts.bold },
  metricInput: { borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, fontFamily: NEO_THEME.fonts.regular },
  secondaryButton: { minHeight: 42, backgroundColor: NEO_THEME.colors.secondary, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontFamily: NEO_THEME.fonts.bold },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 2, borderColor: NEO_THEME.colors.black, alignItems: 'center', justifyContent: 'center' },
  reject: { backgroundColor: NEO_THEME.colors.error },
  approve: { backgroundColor: NEO_THEME.colors.success },
  disabled: { opacity: 0.45 },
  actionText: { fontFamily: NEO_THEME.fonts.bold },
  outcome: { fontFamily: NEO_THEME.fonts.bold },
  empty: { textAlign: 'center', marginTop: 40, fontFamily: NEO_THEME.fonts.bold, color: NEO_THEME.colors.grey },
});
