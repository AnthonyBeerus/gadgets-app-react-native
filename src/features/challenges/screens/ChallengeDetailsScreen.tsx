import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { useChallengeStore } from '../store/challenge-store';
import type { Challenge } from '../types/challenge';
import { useOpportunityEligibility } from '../api/submissions';

const prizeSplits = [40, 25, 15, 10, 10];

export default function ChallengeDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const challengeId = Number(id);
  const challenges = useChallengeStore(state => state.challenges);
  const fetchChallengeById = useChallengeStore(state => state.fetchChallengeById);
  const [challenge, setChallenge] = useState<Challenge | null>(
    challenges.find(item => item.id === challengeId) ?? null,
  );
  const [loading, setLoading] = useState(!challenge);
  const eligibility = useOpportunityEligibility(challengeId, challenge?.product_id, challenge?.shop_id);
  const canEnter = Boolean(eligibility.data?.some(proof => !proof.consumed_by_submission_id));

  useEffect(() => {
    if (!Number.isFinite(challengeId)) return;
    void fetchChallengeById(challengeId)
      .then(setChallenge)
      .finally(() => setLoading(false));
  }, [challengeId, fetchChallengeById]);

  if (loading) {
    return <View style={center}><ActivityIndicator color="#171217" /></View>;
  }
  if (!challenge) {
    return <View style={center}><Text selectable>Opportunity not found.</Text></View>;
  }

  const entryFee = Number(challenge.accepted_entry_fee ?? challenge.reward_value ?? 0);
  const pot = Number(challenge.pot_value ?? 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F6F8' }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 128, gap: 20 }}>
        <View style={{ height: 270, backgroundColor: '#E9E4E9' }}>
          <Image source={{ uri: challenge.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={backButton}>
            <Ionicons name="arrow-back" size={22} color="#171217" />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 8 }}>
          <Text style={{ color: '#6A1B9A', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 }}>PAID CREATOR OPPORTUNITY</Text>
          <Text style={{ color: '#171217', fontSize: 30, lineHeight: 36, fontWeight: '800' }}>{challenge.title}</Text>
          <Text style={{ color: '#655C65', fontSize: 15 }}>{challenge.brand_name}</Text>
          <Text style={{ color: '#3E373E', fontSize: 16, lineHeight: 24 }}>{challenge.description}</Text>
        </View>

        <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 10 }}>
          <MoneyBlock label="PER ACCEPTED ENTRY" value={`P${entryFee.toFixed(0)}`} />
          <MoneyBlock label="RANKED PRIZE POT" value={`P${pot.toFixed(0)}`} />
        </View>

        <Section title="How the prize is split">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {prizeSplits.map((split, index) => (
              <View key={split} style={{ flex: 1, alignItems: 'center', gap: 4, borderRadius: 12, backgroundColor: '#F2EAF7', paddingVertical: 12 }}>
                <Text style={{ color: '#6A1B9A', fontSize: 16, fontWeight: '800' }}>{split}%</Text>
                <Text style={{ color: '#655C65', fontSize: 11 }}>#{index + 1}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="How entries are judged">
          <Text style={bodyText}>Quality decides 70%: brief compliance 30, product clarity 25, creativity 25, and technical or brand safety 20.</Text>
          <Text style={bodyText}>Engagement percentile contributes the remaining 30%. Raw views never decide the winner alone.</Text>
        </Section>

        <Section title="What you need to do">
          {challenge.requirements.map(requirement => (
            <View key={requirement} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <Ionicons name="checkmark-circle" size={20} color="#16803C" />
              <Text style={[bodyText, { flex: 1 }]}>{requirement}</Text>
            </View>
          ))}
          <Text style={{ color: '#655C65', fontSize: 13 }}>Deadline: {new Date(challenge.deadline).toLocaleString()}</Text>
        </Section>
      </ScrollView>

      <View style={footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/challenges/entry/${challenge.id}`)}
          style={{ minHeight: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#171217' }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
            {canEnter ? 'Submit your post' : 'Buy or claim purchase proof'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function MoneyBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: 6, borderRadius: 18, backgroundColor: '#171217', padding: 16 }}>
      <Text style={{ color: '#CFC6CF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>{label}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <View style={{ marginHorizontal: 20, gap: 12, borderWidth: 1, borderColor: '#E2DCE2', borderRadius: 18, backgroundColor: '#FFFFFF', padding: 18 }}>
      <Text style={{ color: '#171217', fontSize: 18, fontWeight: '800' }}>{title}</Text>
      {children}
    </View>
  );
}

const center = { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#F8F6F8' };
const backButton = { position: 'absolute' as const, top: 18, left: 18, width: 44, height: 44, borderRadius: 22, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#FFFFFFE8' };
const bodyText = { color: '#3E373E', fontSize: 15, lineHeight: 22 };
const footer = { position: 'absolute' as const, left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderTopColor: '#E2DCE2', backgroundColor: '#FFFFFF', padding: 16, paddingBottom: 24 };
