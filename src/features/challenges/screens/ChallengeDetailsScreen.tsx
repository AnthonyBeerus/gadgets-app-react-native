import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useChallengeStore } from '../store/challenge-store';
import { Challenge } from '../types/challenge';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { ChallengeBadge } from '../components/ChallengeBadge';
import { RewardCard } from '../components/RewardCard';
import { RequirementsList } from '../components/RequirementsList';
import { MetaInfoCard } from '../components/MetaInfoCard';
import { useChallengeLeaderboard, useOpportunityEligibility } from '../api/submissions';

export default function ChallengeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const challengeId = Number(Array.isArray(id) ? id[0] : id);
  const challenges = useChallengeStore(s => s.challenges);
  const loading = useChallengeStore(s => s.loading);
  const fetchChallengeById = useChallengeStore(s => s.fetchChallengeById);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [notFound, setNotFound] = useState(false);
  const eligibility = useOpportunityEligibility(challengeId, challenge?.product_id, challenge?.shop_id);
  const leaderboard = useChallengeLeaderboard(challengeId);
  const proof = eligibility.data?.[0];
  const canEnter = Boolean(proof && !proof.consumed_by_submission_id);
  const competitive = challenge?.contest_mode === 'competitive_pot';

  useEffect(() => {
    if (!Number.isFinite(challengeId) || challengeId <= 0) {
      setNotFound(true);
      return;
    }

    const cached = challenges.find(c => c.id === challengeId);
    if (cached) {
      setChallenge(cached);
      setNotFound(false);
      return;
    }

    let cancelled = false;
    void fetchChallengeById(challengeId).then(found => {
      if (cancelled) return;
      setChallenge(found);
      setNotFound(!found);
    });
    return () => {
      cancelled = true;
    };
  }, [challengeId, challenges, fetchChallengeById]);

  const handlePrimary = () => {
    if (!challenge) return;
    if (canEnter) {
      router.push(`/challenges/entry/${challenge.id}`);
      return;
    }
    router.push(`/challenges/entry/${challenge.id}`);
  };

  if (notFound) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontFamily: NEO_THEME.fonts.bold, color: NEO_THEME.colors.grey }}>
          Challenge not found.
        </Text>
      </View>
    );
  }

  if (!challenge || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  const rewardCopy = competitive && challenge.pot_value != null
    ? `P${challenge.pot_value.toFixed(0)} pot · Top 5 share · Consolation P${Number(challenge.consolation_voucher_value ?? 0).toFixed(0)}`
    : challenge.reward;

  return (
    <View style={styles.container}>
      <StaticHeader title={competitive ? 'COMPETITIVE CHALLENGE' : 'CREATOR OPPORTUNITY'} onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: challenge.image_url }} style={styles.image} />
          <View style={styles.overlay}>
            <View style={styles.brandBadge}>
              <Ionicons name="business" size={14} color={NEO_THEME.colors.white} />
              <Text style={styles.brandText}>{challenge.brand_name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerSection}>
          <View style={styles.badgesRow}>
            <ChallengeBadge type="status" text={challenge.status.toUpperCase()} />
            {competitive ? <ChallengeBadge type="status" text="POT CONTEST" /> : null}
          </View>
          <Text style={styles.title}>{challenge.title.toUpperCase()}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{competitive ? 'THE POT' : 'THE REWARD'}</Text>
          <RewardCard reward={rewardCopy} />
          {competitive ? (
            <Text style={styles.helper}>
              Ranked by likes + 3×comments + 2×saves after merchant approval. Views are shown but do not decide winners.
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REQUIREMENTS</Text>
          <RequirementsList requirements={challenge.requirements} />
        </View>

        <MetaInfoCard deadline={challenge.deadline} participants={challenge.participants_count} />

        {competitive ? (
          <View style={styles.section}>
            <View style={styles.boardHeader}>
              <Text style={styles.sectionTitle}>LEADERBOARD</Text>
              <TouchableOpacity onPress={() => router.push(`/challenges/leaderboard?id=${challenge.id}`)}>
                <Text style={styles.link}>FULL BOARD</Text>
              </TouchableOpacity>
            </View>
            {(leaderboard.data ?? []).slice(0, 5).map((row, index) => (
              <TouchableOpacity
                key={row.submission_id}
                style={styles.boardRow}
                onPress={() => row.public_share_url && Linking.openURL(row.public_share_url)}
              >
                <Text style={styles.rank}>#{row.final_rank ?? index + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.score}>Score {row.score.toFixed(0)}</Text>
                  <Text style={styles.meta}>{row.like_count} likes · {row.comment_count} comments · {row.save_count} saves</Text>
                </View>
              </TouchableOpacity>
            ))}
            {(leaderboard.data ?? []).length === 0 ? (
              <Text style={styles.helper}>Approved entries appear here once the merchant verifies posts.</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: NEO_THEME.colors.black }]}
          activeOpacity={0.9}
          onPress={handlePrimary}
        >
          <Text style={[styles.ctaText, { color: NEO_THEME.colors.white }]}>
            {canEnter ? 'SUBMIT ENTRY' : 'BUY TO ENTER / CLAIM CODE'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={NEO_THEME.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.backgroundLight },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 0 },
  imageContainer: { height: 250, width: '100%', position: 'relative', borderBottomWidth: NEO_THEME.borders.width, borderColor: NEO_THEME.colors.black },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, justifyContent: 'flex-end', alignItems: 'flex-start' },
  brandBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: NEO_THEME.colors.black, paddingHorizontal: 12, paddingVertical: 6, borderRadius: NEO_THEME.borders.radius, gap: 6 },
  brandText: { fontFamily: NEO_THEME.fonts.bold, fontSize: 12, color: NEO_THEME.colors.white, textTransform: 'uppercase' },
  headerSection: { padding: 20, borderBottomWidth: NEO_THEME.borders.width, borderColor: NEO_THEME.colors.black, backgroundColor: NEO_THEME.colors.white },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  title: { fontFamily: NEO_THEME.fonts.black, fontSize: 28, color: NEO_THEME.colors.black, marginBottom: 8, lineHeight: 32 },
  description: { fontFamily: NEO_THEME.fonts.regular, fontSize: 16, color: NEO_THEME.colors.black, lineHeight: 22 },
  section: { padding: 20, borderBottomWidth: NEO_THEME.borders.width, borderColor: NEO_THEME.colors.black },
  sectionTitle: { fontFamily: NEO_THEME.fonts.black, fontSize: 18, color: NEO_THEME.colors.black, marginBottom: 16, textTransform: 'uppercase' },
  helper: { marginTop: 10, fontFamily: NEO_THEME.fonts.regular, color: NEO_THEME.colors.grey, lineHeight: 20 },
  boardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { fontFamily: NEO_THEME.fonts.bold, color: NEO_THEME.colors.primary, marginBottom: 16 },
  boardRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: NEO_THEME.colors.greyLight },
  rank: { fontFamily: NEO_THEME.fonts.black, fontSize: 18, width: 40 },
  score: { fontFamily: NEO_THEME.fonts.bold },
  meta: { fontFamily: NEO_THEME.fonts.regular, color: NEO_THEME.colors.grey, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: NEO_THEME.colors.white, padding: 16, borderTopWidth: NEO_THEME.borders.width, borderColor: NEO_THEME.colors.black },
  ctaButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: NEO_THEME.borders.radius, gap: 8, borderWidth: NEO_THEME.borders.width, borderColor: NEO_THEME.colors.black },
  ctaText: { fontFamily: NEO_THEME.fonts.black, fontSize: 16, textTransform: 'uppercase' },
});
