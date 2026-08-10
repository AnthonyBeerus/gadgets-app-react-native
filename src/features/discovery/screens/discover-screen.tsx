import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Text,
  Button,
  useDesignTokens,
  useThemedStyles,
  radii,
  space,
  fonts,
  type SemanticColors,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useShopStore } from '../../../store/shop-store';
import { useNetworkStatus } from '../../../shared/hooks/use-network-status';
import {
  getCreatorOpportunityFeed,
  mergeGuestCreatorOpportunityPreferences,
  recordCreatorOpportunityEvent,
  restoreCreatorOpportunityPreference,
  setCreatorOpportunityPreference,
} from '../api';
import { ConsumerUtilityHeader } from '../components/consumer-utility-header';
import { OpportunityCard } from '../components/opportunity-card';
import { DiscoverAdCard } from '../components/discover-ad-card';
import { buildDiscoveryDeck } from '../deck';
import { useDiscoveryStore } from '../discovery-store';
import type { CreatorOpportunityFeedItem, DiscoveryDeckEntry, OpportunityPreferenceState } from '../types';

const SWIPE_DECK_MIN = 5;
const FEED_LIMIT = 150;
function createStyles(c: SemanticColors) {
  return {
    container: { flex: 1, backgroundColor: c.canvas },
    locationRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: space.xs,
      paddingHorizontal: space.md,
      paddingBottom: space.xs,
    },
    undoButton: {
      minHeight: 38,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 5,
      backgroundColor: c.accentMuted,
      borderRadius: 0,
      paddingHorizontal: space.sm,
      borderWidth: 1,
      borderColor: c.accent,
    },
    deckCount: {
      minHeight: 38,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.surface,
      borderRadius: 0,
      paddingHorizontal: space.sm,
      borderWidth: 2,
      borderColor: c.stroke,
    },
    deck: { flex: 1, justifyContent: 'center' as const, paddingHorizontal: space.md, paddingBottom: 6 },
    listContent: { paddingBottom: 100 },
    nextCard: {
      position: 'absolute' as const,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    nextCardNear: {
      left: 20,
      right: 12,
      top: 8,
      bottom: 4,
      backgroundColor: c.surface,
      opacity: 0.7,
    },
    nextCardDeep: {
      left: 28,
      right: 6,
      top: 16,
      bottom: -2,
      backgroundColor: c.gray100,
      opacity: 0.55,
    },
    emptyCard: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: space.md,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.stroke,
      backgroundColor: c.surface,
      padding: space.lg,
    },
    hint: { paddingBottom: 84, color: c.inkMuted, fontFamily: fonts.regular },
    prototypeBanner: { marginHorizontal: space.md, marginBottom: space.xs, paddingHorizontal: space.sm, paddingVertical: 7, borderRadius: radii.sm, backgroundColor: c.accentMuted },
  };
}

export default function DiscoverScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { selectedMall, malls, loadInitialData } = useShopStore();
  const [history, setHistory] = useState<DiscoveryDeckEntry[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const discoveryState = useDiscoveryStore();
  const network = useNetworkStatus();
  const actedKeys = discoveryState.actedKeys;
  const setActedKeys = (updater: string[] | ((previous: string[]) => string[])) => {
    const next = typeof updater === 'function' ? updater(discoveryState.actedKeys) : updater;
    useDiscoveryStore.setState({ actedKeys: next });
  };
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
    if (!network.isConnected || network.isInternetReachable === false || discoveryState.offlineQueue.length === 0) return;
    let cancelled = false;
    const flush = async () => {
      for (const mutation of discoveryState.offlineQueue) {
        if (cancelled) return;
        try {
          if (mutation.state === 'restore') await restoreCreatorOpportunityPreference(mutation.opportunityId);
          else await setCreatorOpportunityPreference(mutation.opportunityId, mutation.state);
          discoveryState.dequeue(mutation.id);
        } catch { return; }
      }
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    };
    void flush();
    return () => { cancelled = true; };
  }, [discoveryState.offlineQueue, network.isConnected, network.isInternetReachable, queryClient]);

  useEffect(() => {
    discoveryState.setScope(String(selectedMall ?? 'all'));
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
  useEffect(() => { if (feed.data?.length) discoveryState.setCachedFeed(feed.data); }, [feed.data, discoveryState.setCachedFeed]);
  const feedItems = feed.data ?? discoveryState.cachedFeed;

  const actedSet = useMemo(() => new Set(actedKeys), [actedKeys]);
  const fullDeck = useMemo<DiscoveryDeckEntry[]>(
    () => buildDiscoveryDeck(feedItems),
    [feedItems],
  );
  const deck = useMemo(
    () => fullDeck.filter(entry => !actedSet.has(entry.key)),
    [fullDeck, actedSet],
  );
  const useList = feedItems.length > 0 && feedItems.length < SWIPE_DECK_MIN;
  const current = deck[0];
  const opportunityCount = feedItems.filter(
    item => !actedSet.has(`opp-${item.opportunity_id}`),
  ).length;

  useEffect(() => {
    if (!current || impressions.current.has(current.key)) return;
    impressions.current.add(current.key);
    if (current.kind === 'opportunity') {
      recordCreatorOpportunityEvent(current.item.opportunity_id, 'impression', 'discover').catch(() => undefined);
    }
  }, [current?.key]);

  const markActed = (entry: DiscoveryDeckEntry) => {
    setActedKeys(previous => (previous.includes(entry.key) ? previous : [...previous, entry.key]));
  };

  const handleOpportunityAction = async (
    state: OpportunityPreferenceState,
    item: CreatorOpportunityFeedItem,
    entry: Extract<DiscoveryDeckEntry, { kind: 'opportunity' }>,
  ) => {
    if (actionLock.current === entry.key || actedSet.has(entry.key)) return;
    actionLock.current = entry.key;
    if (!useList) setHistory(previous => [entry, ...previous].slice(0, 1));
    markActed(entry);
    const mutationId = `${Date.now()}-${entry.item.opportunity_id}`;
    if (entry.kind === 'opportunity') discoveryState.act(entry.key, { id: mutationId, opportunityId: entry.item.opportunity_id, state, createdAt: new Date().toISOString() });
    try {
      await setCreatorOpportunityPreference(item.opportunity_id, state);
      discoveryState.dequeue(mutationId);
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    } catch (error) {
      console.warn('Opportunity preference queued for reconnect', error);
    } finally {
      if (actionLock.current === entry.key) actionLock.current = null;
    }
  };

  const undo = async () => {
    const last = history[0];
    if (!last) return;
    setHistory([]);
    setActedKeys(previous => previous.filter(key => key !== last.key));
    discoveryState.undo();
    if (last.kind === 'opportunity') {
      await restoreCreatorOpportunityPreference(last.item.opportunity_id);
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    }
  };

  const openDetails = (item: CreatorOpportunityFeedItem) => {
    recordCreatorOpportunityEvent(item.opportunity_id, 'detail_open', 'discover').catch(() => undefined);
    if (item.is_prototype) {
      router.push(`/opportunity/${item.opportunity_id}`);
      return;
    }
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
      {feedItems.some(item => item.is_prototype) && (
        <View style={styles.prototypeBanner}>
          <Text variant="caption" align="center">Alpha preview · campaign concepts are illustrative, not live offers</Text>
        </View>
      )}
      {feed.error && feedItems.length ? (
        <View style={{ backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 9 }}>
          <Text variant="label" color={colors.onInk}>Offline · showing your last deck</Text>
        </View>
      ) : null}
      <View style={styles.locationRow}>
        {!useList && history.length > 0 && (
          <Pressable accessibilityRole="button" accessibilityLabel="Undo last swipe" onPress={undo} style={styles.undoButton}>
            <Ionicons name="arrow-undo" size={17} color={colors.ink} />
            <Text variant="caption">Undo</Text>
          </Pressable>
        )}
        {!useList && deck.length > 0 && (
          <View style={styles.deckCount}>
            <Text variant="caption">{opportunityCount} pots · {deck.length} left</Text>
          </View>
        )}
      </View>

      <View style={styles.deck}>
        {feed.isLoading ? (
          <DeckSkeleton location={malls.find(mall => mall.id === selectedMall)?.name ?? 'Molapo'} />
        ) : feed.error && !feedItems.length ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cloud-offline" size={48} color={colors.inkMuted} />
            <Text variant="h2" align="center">Discovery took a break</Text>
            <Text variant="body" align="center" color={colors.inkMuted}>Check your connection and try again.</Text>
            <Button onPress={() => feed.refetch()}>Try again</Button>
          </View>
        ) : useList ? (
          <FlatList
            data={deck.filter((entry): entry is Extract<DiscoveryDeckEntry, { kind: 'opportunity' }> => entry.kind === 'opportunity')}
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
                <Ionicons name="sparkles" size={48} color={colors.accent} />
                <Text variant="h1" align="center">No live challenges</Text>
                <Text variant="body" align="center" color={colors.inkMuted}>Browse Shops or check saved picks.</Text>
                <Button onPress={() => router.push('/(shop)/marketplace')}>
                  Explore Shops
                </Button>
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
                item={current.item}
                onContinue={() => { setHistory([current]); markActed(current); }}
                onLearnMore={() => router.push(`/shop/${current.item.merchantId}`)}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles" size={48} color={colors.accent} />
            <Text variant="h1" align="center">You&apos;re caught up</Text>
            <Text variant="body" align="center" color={colors.inkMuted}>
              Passed challenges return after 30 days. Your saved picks are waiting whenever you are ready.
            </Text>
            <Button onPress={() => router.push('/saved-opportunities')}>View saved</Button>
            <Button variant="secondary" onPress={() => router.push('/(shop)/marketplace')}>
              Explore Shops
            </Button>
          </View>
        )}
      </View>
      {!useList && (
        <Text variant="caption" align="center" style={styles.hint}>
          Swipe left to pass · right to save
        </Text>
      )}
    </SafeAreaView>
  );
}

function DeckSkeleton({ location }: { location: string }) {
  const { colors } = useDesignTokens();
  return <View style={{ flex: 1, gap: 12 }}>
    <View style={{ flex: 1, borderWidth: 2, borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }}>
      <View style={{ height: 250, borderBottomWidth: 2, borderBottomColor: colors.strokeDim }} />
      <View style={{ padding: 16, gap: 11 }}><View style={{ height: 18, width: '55%', borderWidth: 2, borderColor: colors.strokeQuiet }} /><View style={{ height: 62, borderWidth: 2, borderColor: colors.strokeQuiet }} /><View style={{ height: 2, backgroundColor: colors.strokeQuiet }} /><View style={{ height: 70, borderWidth: 2, borderColor: colors.strokeQuiet }} /></View>
    </View>
    <Text variant="caption" align="center">Finding funded briefs near {location}</Text>
  </View>;
}
