import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { useCreatorPayouts, useMySubmissions } from '../api/submissions';

export default function ChallengesMyEntriesScreen() {
  const router = useRouter();
  const submissions = useMySubmissions();
  const payouts = useCreatorPayouts();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 100, gap: 22, backgroundColor: '#F8F6F8', flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={iconButton}>
          <Ionicons name="arrow-back" size={21} color="#171217" />
        </Pressable>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#171217' }}>My entries</Text>
          <Text style={{ color: '#655C65' }}>Submission, judging, and payout status.</Text>
        </View>
      </View>

      <SectionTitle>Payouts</SectionTitle>
      {payouts.isLoading ? <ActivityIndicator color="#171217" /> : payouts.data?.length ? payouts.data.map((payout: any) => (
        <View key={payout.id} style={card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ gap: 4 }}>
              <Text style={eyebrow}>{String(payout.kind).replaceAll('_', ' ')}</Text>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#171217' }}>P{(Number(payout.amount_minor) / 100).toFixed(2)}</Text>
            </View>
            <Status value={payout.status} />
          </View>
          <Text selectable style={{ color: '#655C65', fontSize: 13 }}>
            {payout.provider} {payout.provider_reference ? `· ${payout.provider_reference}` : ''}
          </Text>
        </View>
      )) : <Empty text="Accepted-entry fees and ranked prizes will appear here." />}

      <SectionTitle>Creator posts</SectionTitle>
      {submissions.isLoading ? <ActivityIndicator color="#171217" /> : submissions.data?.length ? submissions.data.map(submission => (
        <View key={submission.id} style={card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <Text style={{ flex: 1, color: '#171217', fontSize: 16, fontWeight: '700' }} numberOfLines={2}>
              {submission.post_description || 'Public TikTok post'}
            </Text>
            <Status value={submission.status} />
          </View>
          <Text style={{ color: '#655C65', fontSize: 13 }}>{submission.verification_status.replaceAll('_', ' ')}</Text>
          {submission.rejection_reason ? <Text selectable style={{ color: '#B42318' }}>{submission.rejection_reason}</Text> : null}
          <Pressable onPress={() => Linking.openURL(submission.public_share_url)} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 13, backgroundColor: '#171217' }}>
            <Ionicons name="open-outline" size={17} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Open public post</Text>
          </Pressable>
        </View>
      )) : <Empty text="Choose an opportunity, publish your post, then submit its public URL." />}
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={{ fontSize: 19, fontWeight: '800', color: '#171217' }}>{children}</Text>;
}

function Status({ value }: { value: string }) {
  return <View style={{ alignSelf: 'flex-start', borderRadius: 999, backgroundColor: '#F2EAF7', paddingHorizontal: 10, paddingVertical: 6 }}><Text style={eyebrow}>{value}</Text></View>;
}

function Empty({ text }: { text: string }) {
  return <View style={[card, { alignItems: 'center' }]}><Text style={{ color: '#655C65', textAlign: 'center', lineHeight: 21 }}>{text}</Text></View>;
}

const card = { gap: 12, borderWidth: 1, borderColor: '#E2DCE2', borderRadius: 18, backgroundColor: '#FFFFFF', padding: 16 };
const iconButton = { width: 44, height: 44, borderWidth: 1, borderColor: '#E2DCE2', borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center' as const, justifyContent: 'center' as const };
const eyebrow = { color: '#6A1B9A', fontSize: 11, fontWeight: '800' as const, textTransform: 'uppercase' as const };
