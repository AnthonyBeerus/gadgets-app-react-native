import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  EmptyState,
  Money,
  ScreenHeader,
  Skeleton,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useMyEntries } from '../api/submissions';
import { SubmissionStatusTag, describeDeadline } from '../components/StatusTag';

const PLACE_LABELS = ['1st', '2nd', '3rd', '4th', '5th'];

export default function MyEntriesScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { data: entries, isLoading } = useMyEntries();

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="My entries" />
        <EmptyState
          title="Sign in to track your entries"
          rule="Browsing campaigns never needs an account, but entering one does."
          actionLabel="Sign in"
          onAction={() => router.push('/auth?returnTo=/(shop)/entries')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="My entries" />
      <View style={styles.list}>
        {isLoading ? (
          <>
            <Skeleton style={styles.skeleton} />
            <Skeleton style={styles.skeleton} />
          </>
        ) : (entries ?? []).length === 0 ? (
          <EmptyState
            title="No entries yet"
            rule="Find a campaign you like, join it, and upload your content to enter."
            actionLabel="Browse campaigns"
            onAction={() => router.push('/(shop)')}
          />
        ) : (
          (entries ?? []).map(entry => {
            const voucher = entry.voucher?.[0];
            return (
              <Pressable
                key={entry.id}
                accessibilityRole="button"
                onPress={() =>
                  router.push(
                    entry.status === 'draft' || entry.status === 'revision_requested'
                      ? `/opportunity/${entry.challenge_id}/submit`
                      : `/opportunity/${entry.challenge_id}`,
                  )
                }
              >
                <Surface style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text variant="h2" style={styles.title} numberOfLines={2}>
                      {entry.campaign?.title ?? 'Campaign'}
                    </Text>
                    <SubmissionStatusTag status={entry.status} />
                  </View>

                  <Text variant="caption" style={styles.muted}>
                    {entry.campaign?.brand_name}
                    {entry.campaign?.deadline
                      ? ` · ${describeDeadline(entry.campaign.deadline)}`
                      : ''}
                  </Text>

                  {entry.status === 'draft' ? (
                    <Text variant="caption" style={styles.muted}>
                      You joined but have not uploaded anything yet.
                    </Text>
                  ) : null}

                  {entry.merchant_note ? (
                    <Text variant="caption" style={styles.muted}>
                      {entry.status === 'revision_requested' ? 'Changes requested: ' : 'Note: '}
                      {entry.merchant_note}
                    </Text>
                  ) : null}

                  {entry.final_rank ? (
                    <View style={styles.winRow}>
                      <Text variant="label">
                        {PLACE_LABELS[entry.final_rank - 1]} place
                      </Text>
                      {voucher ? (
                        <Money amount={voucher.value} format="charge" emphasis="body" />
                      ) : null}
                    </View>
                  ) : null}

                  {voucher ? (
                    <Text variant="caption" style={styles.muted}>
                      Payout code {voucher.code}
                    </Text>
                  ) : null}
                </Surface>
              </Pressable>
            );
          })
        )}
      </View>
    </SafeAreaView>
  );
}

function createStyles(c: SemanticColors) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    list: { padding: space.lg, gap: space.sm },
    skeleton: { height: 96 },
    card: { padding: space.md, gap: space.xs },
    cardTop: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: space.sm },
    title: { flex: 1 },
    winRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    muted: { color: c.inkMuted },
  };
}
