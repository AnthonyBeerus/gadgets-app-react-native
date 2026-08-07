import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useShopStore } from '../../../store/shop-store';
import {
  getCreatorOpportunityFeed,
  mergeGuestCreatorOpportunityPreferences,
  recordCreatorOpportunityEvent,
  restoreCreatorOpportunityPreference,
  setCreatorOpportunityPreference,
} from '../api';
import { DiscoverAdCard } from '../components/discover-ad-card';
import { ConsumerUtilityHeader } from '../components/consumer-utility-header';
import { OpportunityCard } from '../components/opportunity-card';
import { injectDiscoverAdSlots, type DiscoverDeckEntry } from '../deck';
import type { CreatorOpportunityFeedItem, OpportunityPreferenceState } from '../types';

const SWIPE_DECK_MIN = 5;
const FEED_LIMIT = 150;
const AD_EVERY = 5;

export default function DiscoverScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { selectedMall, malls, loadInitialData } = useShopStore();
  const [history, setHistory] = useState<DiscoverDeckEntry[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [actedKeys, setActedKeys] = useState<string[]>([]);
  const impressions = useRef(new Set<string>());
  const actionLock = useRef<string | null>(null);

  useEffect(() => {
    if (malls.length === 0) loadInitialData();
  }, [malls.length, loadInitialData]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    mergeGuestCreatorOpportunityPreferences()
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['creator-opportunity-feed'] });
        queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
      })
      .catch(error => console.warn('Could not merge guest opportunity preferences', error));
  }, [session?.user?.id, queryClient]);

  useEffect(() => {
    setActedKeys([]);
    setHistory([]);
    actionLock.current = null;
  }, [selectedMall]);

  const feed = useQuery({
    queryKey: ['creator-opportunity-feed', selectedMall],
    queryFn: async () => {
      const scoped = await getCreatorOpportunityFeed({ mallId: selectedMall, limit: FEED_LIMIT });
      if (scoped.length >= SWIPE_DECK_MIN || selectedMall == null) return scoped;
      const cityWide = await getCreatorOpportunityFeed({ mallId: null, limit: FEED_LIMIT });
      return cityWide.length > scoped.length ? cityWide : scoped;
    },
    staleTime: 60_000,
  });

  const actedSet = useMemo(() => new Set(actedKeys), [actedKeys]);
  const fullDeck = useMemo(
    () => injectDiscoverAdSlots(feed.data ?? [], AD_EVERY),
    [feed.data],
  );
  const deck = useMemo(
    () => fullDeck.filter(entry => !actedSet.has(entry.key)),
    [fullDeck, actedSet],
  );
  const useList = (feed.data?.length ?? 0) > 0 && (feed.data?.length ?? 0) < SWIPE_DECK_MIN;
  const current = deck[0];
  const opportunityCount = (feed.data ?? []).filter(
    item => !actedSet.has(`opp-${item.opportunity_id}`),
  ).length;

  useEffect(() => {
    if (!current || impressions.current.has(current.key)) return;
    impressions.current.add(current.key);
    if (current.kind === 'opportunity') {
      recordCreatorOpportunityEvent(current.item.opportunity_id, 'impression', 'discover').catch(() => undefined);
    }
  }, [current?.key]);

  const markActed = (entry: DiscoverDeckEntry) => {
    setActedKeys(previous => (previous.includes(entry.key) ? previous : [...previous, entry.key]));
  };

  const handleOpportunityAction = async (
    state: OpportunityPreferenceState,
    item: CreatorOpportunityFeedItem,
    entry: DiscoverDeckEntry,
  ) => {
    if (actionLock.current === entry.key || actedSet.has(entry.key)) return;
    actionLock.current = entry.key;
    if (!useList) setHistory(previous => [entry, ...previous].slice(0, 1));
    markActed(entry);
    try {
      await setCreatorOpportunityPreference(item.opportunity_id, state);
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    } catch (error) {
      setActedKeys(previous => previous.filter(key => key !== entry.key));
      if (!useList) setHistory([]);
      console.warn('Could not save opportunity preference', error);
    } finally {
      if (actionLock.current === entry.key) actionLock.current = null;
    }
  };

  const handleAdPass = (entry: DiscoverDeckEntry) => {
    if (actionLock.current === entry.key || actedSet.has(entry.key)) return;
    actionLock.current = entry.key;
    setHistory(previous => [entry, ...previous].slice(0, 1));
    markActed(entry);
    actionLock.current = null;
  };

  const handleAdCta = (entry: DiscoverDeckEntry) => {
    if (actionLock.current === entry.key || actedSet.has(entry.key)) return;
    actionLock.current = entry.key;
    setHistory(previous => [entry, ...previous].slice(0, 1));
    markActed(entry);
    actionLock.current = null;
    router.push('/auth');
  };

  const undo = async () => {
    const last = history[0];
    if (!last) return;
    setHistory([]);
    setActedKeys(previous => previous.filter(key => key !== last.key));
    if (last.kind === 'opportunity') {
      await restoreCreatorOpportunityPreference(last.item.opportunity_id);
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    }
  };

  const openDetails = (item: CreatorOpportunityFeedItem) => {
    recordCreatorOpportunityEvent(item.opportunity_id, 'detail_open', 'discover').catch(() => undefined);
    if (item.contest_mode === 'competitive_pot' || item.opportunity_id > 0) {
      router.push(`/challenges/${item.opportunity_id}`);
      return;
    }
    router.push({
      pathname: '/product/[slug]',
      params: { slug: item.product_slug, source: 'discover', opportunityId: item.opportunity_id },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ConsumerUtilityHeader />
      <View style={styles.locationRow}>
        <Pressable accessibilityRole="button" onPress={() => router.push('/mall-selector')} style={styles.locationButton}>
          <Ionicons name="location" size={16} color={NEO_THEME.colors.black} />
          <NuviaText variant="caption">{malls.find(mall => mall.id === selectedMall)?.name ?? 'ALL LOCATIONS'}</NuviaText>
          <Ionicons name="chevron-down" size={14} color={NEO_THEME.colors.black} />
        </Pressable>
        {!useList && history.length > 0 && (
          <Pressable accessibilityRole="button" accessibilityLabel="Undo last swipe" onPress={undo} style={styles.undoButton}>
            <Ionicons name="arrow-undo" size={17} color={NEO_THEME.colors.black} />
            <NuviaText variant="caption">UNDO</NuviaText>
          </Pressable>
        )}
        {!useList && deck.length > 0 && (
          <View style={styles.deckCount}>
            <NuviaText variant="caption">{opportunityCount} POTS · {deck.length} LEFT</NuviaText>
          </View>
        )}
      </View>

      <View style={styles.deck}>
        {feed.isLoading ? (
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
        ) : feed.error ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cloud-offline" size={52} color={NEO_THEME.colors.black} />
            <NuviaText variant="h2" align="center">DISCOVERY TOOK A BREAK</NuviaText>
            <NuviaText variant="body" align="center">Check your connection and try again.</NuviaText>
            <Pressable onPress={() => feed.refetch()} style={styles.primaryButton}><NuviaText variant="bodyBold">TRY AGAIN</NuviaText></Pressable>
          </View>
        ) : useList ? (
          <FlatList
            data={deck.filter(entry => entry.kind === 'opportunity')}
            keyExtractor={item => item.key}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <OpportunityCard
                item={item.item}
                compact
                reduceMotion={reduceMotion}
                onAction={state => handleOpportunityAction(state, item.item, item)}
                onDetails={() => openDetails(item.item)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Ionicons name="sparkles" size={52} color={NEO_THEME.colors.primary} />
                <NuviaText variant="h1" align="center">NO LIVE CHALLENGES</NuviaText>
                <NuviaText variant="body" align="center">Browse the marketplace or check saved picks.</NuviaText>
                <Pressable onPress={() => router.push('/(shop)/marketplace')} style={styles.primaryButton}>
                  <NuviaText variant="bodyBold">SEARCH MARKETPLACE</NuviaText>
                </Pressable>
              </View>
            }
          />
        ) : current ? (
          <>
            {deck[2] && <View pointerEvents="none" style={[styles.nextCard, styles.nextCardDeep]} />}
            {deck[1] && <View pointerEvents="none" style={[styles.nextCard, styles.nextCardNear]} />}
            {current.kind === 'opportunity' ? (
              <OpportunityCard
                key={current.key}
                item={current.item}
                reduceMotion={reduceMotion}
                onAction={state => handleOpportunityAction(state, current.item, current)}
                onDetails={() => openDetails(current.item)}
              />
            ) : (
              <DiscoverAdCard
                key={current.key}
                ad={current.ad}
                reduceMotion={reduceMotion}
                onPass={() => handleAdPass(current)}
                onCta={() => handleAdCta(current)}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles" size={52} color={NEO_THEME.colors.primary} />
            <NuviaText variant="h1" align="center">YOU'RE CAUGHT UP</NuviaText>
            <NuviaText variant="body" align="center">Passed challenges return after 30 days. Your saved picks are waiting whenever you are ready.</NuviaText>
            <Pressable onPress={() => router.push('/bag?tab=saved')} style={styles.primaryButton}><NuviaText variant="bodyBold">VIEW SAVED</NuviaText></Pressable>
            <Pressable onPress={() => router.push('/(shop)/marketplace')} style={styles.secondaryButton}><NuviaText variant="bodyBold">SEARCH MARKETPLACE</NuviaText></Pressable>
          </View>
        )}
      </View>
      {!useList && (
        <NuviaText variant="caption" align="center" style={styles.hint}>
          SWIPE LEFT TO PASS · RIGHT TO SAVE · ADS EVERY {AD_EVERY}
        </NuviaText>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  locationButton: { minHeight: 38, flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, paddingHorizontal: 12 },
  undoButton: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: NEO_THEME.colors.secondary, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, paddingHorizontal: 12 },
  deckCount: { minHeight: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: NEO_THEME.colors.white, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, paddingHorizontal: 12 },
  deck: { flex: 1, justifyContent: 'center', paddingHorizontal: 16, paddingBottom: 6 },
  listContent: { paddingBottom: 100 },
  nextCard: { position: 'absolute', borderRadius: 24, borderWidth: 3, borderColor: NEO_THEME.colors.black },
  nextCardNear: { left: 22, right: 10, top: 10, bottom: 2, backgroundColor: NEO_THEME.colors.secondary, transform: [{ rotate: '1.8deg' }] },
  nextCardDeep: { left: 30, right: 4, top: 18, bottom: -4, backgroundColor: NEO_THEME.colors.accent, transform: [{ rotate: '-2.2deg' }] },
  emptyCard: { alignItems: 'center', justifyContent: 'center', gap: 16, borderWidth: 3, borderColor: NEO_THEME.colors.black, borderRadius: 24, backgroundColor: NEO_THEME.colors.white, padding: 28, boxShadow: '6px 6px 0px #000000' },
  primaryButton: { minHeight: 48, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.primary },
  secondaryButton: { minHeight: 48, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.secondary },
  hint: { paddingBottom: 84, color: NEO_THEME.colors.grey, fontFamily: NEO_THEME.fonts.bold },
});
