import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { calculatePrizeAllocations, DEFAULT_PRIZE_SPLITS, validateCompetitionBudget } from '../../features/opportunities/domain/competition';
import { initializeChallengePaymentSheet, presentChallengePaymentSheet } from '../../shared/lib/stripe';
import { supabase } from '../../shared/lib/supabase';

export default function CreateCreatorOpportunityScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [entryFee, setEntryFee] = useState('50');
  const [maximumEntries, setMaximumEntries] = useState('20');
  const [prizePot, setPrizePot] = useState('1000');
  const [daysLive, setDaysLive] = useState('14');
  const [submitting, setSubmitting] = useState(false);

  const budget = useMemo(() => {
    const acceptedEntryFeeMinor = Math.round(Number(entryFee || 0) * 100);
    const maximumAcceptedEntries = Number(maximumEntries || 0);
    const prizePotMinor = Math.round(Number(prizePot || 0) * 100);
    if (![acceptedEntryFeeMinor, maximumAcceptedEntries, prizePotMinor].every(Number.isInteger)) return null;
    try {
      return validateCompetitionBudget({ acceptedEntryFeeMinor, maximumAcceptedEntries, prizePotMinor, fundedAmountMinor: 0 });
    } catch {
      return null;
    }
  }, [entryFee, maximumEntries, prizePot]);

  const allocations = useMemo(() => {
    const minor = Math.round(Number(prizePot || 0) * 100);
    try { return calculatePrizeAllocations(minor, DEFAULT_PRIZE_SPLITS); } catch { return []; }
  }, [prizePot]);

  const fundOpportunity = async () => {
    if (!budget || title.trim().length < 3 || brief.trim().length < 20 || Number(daysLive) < 1) {
      Alert.alert('Complete the brief', 'Add a title, a useful brief, valid fees, a prize pot, and a deadline.');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('fund-creator-opportunity', {
        body: {
          title: title.trim(),
          brief: brief.trim(),
          acceptedEntryFeeMinor: Math.round(Number(entryFee) * 100),
          maximumAcceptedEntries: Number(maximumEntries),
          prizePotMinor: Math.round(Number(prizePot) * 100),
          endsAt: new Date(Date.now() + Number(daysLive) * 86_400_000).toISOString(),
        },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message || 'Funding setup failed');
      const initialized = await initializeChallengePaymentSheet({
        merchantDisplayName: 'Muse',
        paymentIntentClientSecret: data.paymentIntentClientSecret,
        returnURL: 'muse://stripe-redirect',
      });
      if (initialized.error) throw new Error(initialized.error.message);
      const presented = await presentChallengePaymentSheet();
      if (presented.error) {
        if (presented.error.code === 'Canceled') return;
        throw new Error(presented.error.message);
      }
      Alert.alert('Funding received', 'Muse will publish this opportunity after operator approval.');
      router.replace('/(merchant)/community/challenges');
    } catch (error) {
      Alert.alert('Could not fund opportunity', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 20, backgroundColor: '#F8F6F8' }}>
      <Stack.Screen options={{ title: 'New creator opportunity' }} />
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 30, lineHeight: 36, fontWeight: '800', color: '#171217' }}>Fund the work before it goes live.</Text>
        <Text style={helper}>Creators see exactly what an accepted entry earns and what the top five can win.</Text>
      </View>

      <Field label="Opportunity title"><TextInput value={title} onChangeText={setTitle} placeholder="Show us your best Molapo lunch break" style={input} /></Field>
      <Field label="Creator brief"><TextInput multiline value={brief} onChangeText={setBrief} placeholder="What should the post show, disclose, and avoid?" style={[input, { minHeight: 130, textAlignVertical: 'top', paddingTop: 15 }]} /></Field>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Field label="Accepted entry (P)" flex><TextInput keyboardType="decimal-pad" value={entryFee} onChangeText={setEntryFee} style={input} /></Field>
        <Field label="Maximum accepted" flex><TextInput keyboardType="number-pad" value={maximumEntries} onChangeText={setMaximumEntries} style={input} /></Field>
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Field label="Prize pot (P)" flex><TextInput keyboardType="decimal-pad" value={prizePot} onChangeText={setPrizePot} style={input} /></Field>
        <Field label="Days live" flex><TextInput keyboardType="number-pad" value={daysLive} onChangeText={setDaysLive} style={input} /></Field>
      </View>

      <View style={summaryCard}>
        <Text style={eyebrow}>UPFRONT FUNDING</Text>
        <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF' }}>P{((budget?.requiredAmountMinor ?? 0) / 100).toFixed(2)}</Text>
        <Text style={{ color: '#CFC6CF', lineHeight: 20 }}>Accepted-entry liability plus the full prize pot. Stripe confirms funding by webhook before Muse can approve the opportunity.</Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#171217' }}>Top-five prize split</Text>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          {allocations.map((amount, index) => <View key={index} style={{ flex: 1, alignItems: 'center', gap: 3, borderRadius: 12, backgroundColor: '#F2EAF7', paddingVertical: 11 }}><Text style={eyebrow}>#{index + 1}</Text><Text style={{ color: '#171217', fontWeight: '800' }}>P{(amount / 100).toFixed(0)}</Text></View>)}
        </View>
      </View>

      <Pressable disabled={submitting} onPress={fundOpportunity} style={{ minHeight: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#171217', opacity: submitting ? 0.55 : 1 }}>
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Continue to Stripe test payment</Text>}
      </Pressable>
    </ScrollView>
  );
}

function Field({ children, flex, label }: { children: ReactNode; flex?: boolean; label: string }) {
  return <View style={[{ gap: 7 }, flex && { flex: 1 }]}><Text style={{ color: '#3E373E', fontSize: 13, fontWeight: '700' }}>{label}</Text>{children}</View>;
}

const input = { minHeight: 52, borderWidth: 1, borderColor: '#D9D1D9', borderRadius: 14, paddingHorizontal: 15, backgroundColor: '#FFFFFF', color: '#171217' };
const helper = { color: '#655C65', fontSize: 15, lineHeight: 22 };
const eyebrow = { color: '#B47AD0', fontSize: 10, fontWeight: '800' as const, letterSpacing: 0.7 };
const summaryCard = { gap: 8, borderRadius: 18, backgroundColor: '#171217', padding: 18 };
