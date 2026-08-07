import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { useChallengeStore } from '../store/challenge-store';
import { CONSENT_TERMS, tiktokApi, useClaimPurchaseCode, useCreateSubmission, useCreatorAccount, useOpportunityEligibility, useTikTokVideos } from '../api/submissions';
import { TikTokVideo } from '../types/challenge';
import { PILOT_FEATURES } from '../../../shared/constants/pilot-features';

const VERIFIER_KEY = 'muse-tiktok-pkce-verifier';
const REDIRECT_URI = 'muse://tiktok/callback';
const toBase64Url = (value: string) => value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

export default function ChallengeEntryScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const challengeId = Number(Array.isArray(id) ? id[0] : id);
  const challenges = useChallengeStore(s => s.challenges);
  const loadingChallenge = useChallengeStore(s => s.loading);
  const fetchChallengeById = useChallengeStore(s => s.fetchChallengeById);
  const [challenge, setChallenge] = useState(() =>
    challenges.find(item => item.id === challengeId) ?? null
  );
  const accountQuery = useCreatorAccount();
  const videosQuery = useTikTokVideos(accountQuery.data?.connection_status === 'connected');
  const eligibility = useOpportunityEligibility(challengeId, challenge?.product_id, challenge?.shop_id);
  const submit = useCreateSubmission();
  const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [manualHandle, setManualHandle] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [purchaseCode, setPurchaseCode] = useState('');
  const claimCode = useClaimPurchaseCode();

  const proof = eligibility.data?.[0] ?? null;
  const manualFallback = !!challenge?.manual_verification_enabled || PILOT_FEATURES.manualTikTokVerification;

  useEffect(() => {
    if (!Number.isFinite(challengeId) || challengeId <= 0) return;
    const cached = challenges.find(item => item.id === challengeId);
    if (cached) {
      setChallenge(cached);
      return;
    }
    let cancelled = false;
    void fetchChallengeById(challengeId).then(found => {
      if (!cancelled) setChallenge(found);
    });
    return () => {
      cancelled = true;
    };
  }, [challengeId, challenges, fetchChallengeById]);

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      if (!url.startsWith(REDIRECT_URI)) return;
      const query = new URL(url).searchParams;
      const code = query.get('code');
      const state = query.get('state');
      const verifier = await SecureStore.getItemAsync(VERIFIER_KEY);
      if (!code || !state || !verifier) {
        toast.show('TikTok connection could not be completed.', { type: 'danger' });
        return;
      }
      try {
        setConnecting(true);
        await tiktokApi.callback(code, state, verifier);
        await SecureStore.deleteItemAsync(VERIFIER_KEY);
        await accountQuery.refetch();
        toast.show('TikTok connected.', { type: 'success' });
      } catch (error) {
        toast.show(error instanceof Error ? error.message : 'TikTok connection failed.', { type: 'danger' });
      } finally {
        setConnecting(false);
      }
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => { if (url) void handleUrl({ url }); });
    return () => subscription.remove();
  }, []);

  const connectTikTok = async () => {
    try {
      setConnecting(true);
      const random = Crypto.getRandomBytes(32);
      const verifier = toBase64Url(globalThis.btoa(Array.from(random, byte => String.fromCharCode(byte)).join('')));
      const challengeHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
        encoding: Crypto.CryptoEncoding.BASE64,
      });
      await SecureStore.setItemAsync(VERIFIER_KEY, verifier);
      const { authorizationUrl } = await tiktokApi.authorize(REDIRECT_URI, toBase64Url(challengeHash));
      await Linking.openURL(authorizationUrl);
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Could not open TikTok.', { type: 'danger' });
      setConnecting(false);
    }
  };

  const canSubmit = !!proof && consentAccepted && (!!selectedVideo || (manualFallback && !!manualUrl.trim() && !!manualHandle.trim()));
  const submitPost = async () => {
    if (!challenge || !proof) return;
    try {
      await submit.mutateAsync({ challengeId: challenge.id, purchaseProofId: proof.id,
        account: selectedVideo ? accountQuery.data ?? null : null, video: selectedVideo,
        manualUrl, manualHandle, consentAccepted });
      toast.show(selectedVideo ? 'Verified TikTok post submitted.' : 'Post sent to Muse for manual verification.', { type: 'success' });
      router.push('/(shop)/challenges/my-entries');
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Submission failed.', { type: 'danger' });
    }
  };

  if (!challenge) {
    return (
      <View style={styles.container}>
        <StaticHeader title="SUBMIT TIKTOK POST" onBackPress={() => router.back()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {loadingChallenge ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Text style={styles.body}>Opportunity not found.</Text>
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StaticHeader title="SUBMIT TIKTOK POST" onBackPress={() => router.back()} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>CREATOR OPPORTUNITY</Text>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.body}>Publish the content on TikTok first, then select the verified public post here.</Text>
        </View>

        {!proof && !eligibility.isLoading ? (
          <View style={[styles.card, styles.warning]}>
            <Text style={styles.cardTitle}>PURCHASE REQUIRED</Text>
            <Text style={styles.body}>A successful purchase of the sponsored product is required before submitting.</Text>
            <TextInput style={styles.input} autoCapitalize="characters" placeholder="Walk-in purchase code" value={purchaseCode} onChangeText={setPurchaseCode} />
            <TouchableOpacity style={styles.secondaryButton} disabled={!purchaseCode.trim() || claimCode.isPending}
              onPress={() => claimCode.mutate(purchaseCode, { onSuccess: () => { setPurchaseCode(''); void eligibility.refetch(); }, onError: error => toast.show(error.message, { type: 'danger' }) })}>
              <Text style={styles.secondaryText}>CLAIM PURCHASE</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. CONNECT TIKTOK</Text>
          {accountQuery.data?.connection_status === 'connected' ? (
            <Text style={styles.success}>CONNECTED AS {accountQuery.data.display_name ?? 'TIKTOK CREATOR'}</Text>
          ) : (
            <TouchableOpacity style={styles.primaryButton} disabled={connecting} onPress={connectTikTok}>
              {connecting ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.primaryText}>CONNECT TIKTOK</Text>}
            </TouchableOpacity>
          )}
        </View>

        {accountQuery.data?.connection_status === 'connected' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>2. SELECT YOUR PUBLIC POST</Text>
            {videosQuery.isLoading ? <ActivityIndicator color={theme.colors.primary} /> : null}
            {videosQuery.error ? <Text style={styles.error}>{(videosQuery.error as Error).message}</Text> : null}
            {videosQuery.data?.map(video => (
              <TouchableOpacity key={video.id} style={[styles.videoRow, selectedVideo?.id === video.id && styles.selected]}
                onPress={() => setSelectedVideo(video)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.videoTitle} numberOfLines={2}>{video.video_description || video.title || 'TikTok video'}</Text>
                  <Text style={styles.videoMeta}>{video.id}</Text>
                </View>
                <Text style={styles.check}>{selectedVideo?.id === video.id ? 'SELECTED' : 'SELECT'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {manualFallback ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>TIKTOK APPROVAL FALLBACK</Text>
            <Text style={styles.body}>If account connection is unavailable, Muse can manually verify a public post.</Text>
            <TextInput style={styles.input} autoCapitalize="none" keyboardType="url" placeholder="https://www.tiktok.com/@you/video/..."
              value={manualUrl} onChangeText={setManualUrl} />
            <TextInput style={styles.input} autoCapitalize="none" placeholder="@yourhandle" value={manualHandle} onChangeText={setManualHandle} />
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. VERIFICATION TERMS</Text>
          {CONSENT_TERMS.map(term => <Text key={term} style={styles.term}>• {term}</Text>)}
          <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: consentAccepted }}
            style={styles.consentRow} onPress={() => setConsentAccepted(value => !value)}>
            <View style={[styles.checkbox, consentAccepted && styles.checkboxChecked]}><Text style={styles.checkboxMark}>{consentAccepted ? '✓' : ''}</Text></View>
            <Text style={styles.consentText}>I agree to these terms</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.primaryButton, !canSubmit && styles.disabled]} disabled={!canSubmit || submit.isPending} onPress={submitPost}>
          {submit.isPending ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.primaryText}>SUBMIT TO MUSE FOR REVIEW</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function createStyles(c) {
  return {
  container: { flex: 1, backgroundColor: c.backgroundLight },
  content: { padding: 20, gap: 16 },
  card: { backgroundColor: c.white, borderWidth: 1, borderColor: c.border, borderRadius: NEO_THEME.borders.radius, padding: 16, gap: 10 },
  warning: { backgroundColor: c.yellow },
  eyebrow: { fontFamily: NEO_THEME.fonts.bold, fontSize: 11, color: c.primary },
  title: { fontFamily: NEO_THEME.fonts.black, fontSize: 22, color: c.black },
  cardTitle: { fontFamily: NEO_THEME.fonts.black, fontSize: 15, color: c.black },
  body: { fontFamily: NEO_THEME.fonts.regular, fontSize: 14, lineHeight: 20, color: c.black },
  success: { fontFamily: NEO_THEME.fonts.bold, color: c.success },
  error: { fontFamily: NEO_THEME.fonts.bold, color: c.error },
  primaryButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: NEO_THEME.borders.radius, borderWidth: 1, borderColor: c.border, backgroundColor: c.black },
  primaryText: { fontFamily: NEO_THEME.fonts.black, fontSize: 14, color: c.white },
  disabled: { opacity: 0.4 },
  videoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: c.border, padding: 12, borderRadius: NEO_THEME.borders.radius },
  selected: { backgroundColor: c.secondary },
  videoTitle: { fontFamily: NEO_THEME.fonts.bold, fontSize: 13, color: c.black },
  videoMeta: { fontFamily: NEO_THEME.fonts.regular, fontSize: 10, color: c.grey },
  check: { fontFamily: NEO_THEME.fonts.black, fontSize: 10, color: c.black },
  input: { minHeight: 48, borderWidth: 1, borderColor: c.border, borderRadius: NEO_THEME.borders.radius, paddingHorizontal: 12, fontFamily: NEO_THEME.fonts.regular, color: c.black },
  secondaryButton: { minHeight: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: c.white, borderWidth: 1, borderColor: c.border, borderRadius: NEO_THEME.borders.radius },
  secondaryText: { fontFamily: NEO_THEME.fonts.black, fontSize: 12, color: c.black },
  term: { fontFamily: NEO_THEME.fonts.regular, fontSize: 13, lineHeight: 19, color: c.black },
  consentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8 },
  checkbox: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.border, borderRadius: 4 },
  checkboxChecked: { backgroundColor: c.black },
  checkboxMark: { color: c.white, fontFamily: NEO_THEME.fonts.black },
  consentText: { fontFamily: NEO_THEME.fonts.bold, color: c.black },
  };
}
