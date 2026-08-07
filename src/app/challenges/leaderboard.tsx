import React from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { useChallengeLeaderboard } from '../../features/challenges/api/submissions';

export default function ChallengeLeaderboardRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const challengeId = Number(id);
  const board = useChallengeLeaderboard(challengeId);

  return (
    <View style={styles.container}>
      <StaticHeader title="LEADERBOARD" onBackPress={() => router.back()} />
      {board.isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={NEO_THEME.colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 10 }}>
          <Text style={styles.helper}>
            Score = likes + 3×comments + 2×saves. Views are vanity only.
          </Text>
          {(board.data ?? []).map((row, index) => (
            <TouchableOpacity
              key={row.submission_id}
              style={styles.row}
              onPress={() => row.public_share_url && Linking.openURL(row.public_share_url)}
            >
              <Text style={styles.rank}>#{row.final_rank ?? index + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.score}>Score {row.score.toFixed(0)}</Text>
                <Text style={styles.meta}>
                  {row.like_count} likes · {row.comment_count} comments · {row.save_count} saves · {row.view_count} views
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {(board.data ?? []).length === 0 ? (
            <Text style={styles.empty}>No approved entries yet.</Text>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.greyLight },
  helper: { fontFamily: NEO_THEME.fonts.regular, color: NEO_THEME.colors.grey, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    borderRadius: 14,
    padding: 14,
  },
  rank: { fontFamily: NEO_THEME.fonts.black, fontSize: 20, width: 44 },
  score: { fontFamily: NEO_THEME.fonts.bold, fontSize: 16 },
  meta: { fontFamily: NEO_THEME.fonts.regular, color: NEO_THEME.colors.grey, marginTop: 4 },
  empty: { fontFamily: NEO_THEME.fonts.bold, textAlign: 'center', marginTop: 40, color: NEO_THEME.colors.grey },
});
