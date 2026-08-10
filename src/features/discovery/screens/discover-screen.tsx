import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Text,
  Button,
  Chip,
  DashedWell,
  Money,
  Plate,
  ScreenHeader,
  Skeleton,
  useDesignTokens,
  useThemedStyles,
  space,
  layout,
  fonts,
  type SemanticColors,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useShopStore } from '../../../store/shop-store';
import { useNetworkStatus } from '../../../shared/hooks/use-network-status';
import {
  getCreatorOpportunityFeed,
  getSavedCreatorOpportunities,
  mergeGuestCreatorOpportunityPreferences,
  recordCreatorOpportunityEvent,
  restoreCreatorOpportunityPreference,
  setCreatorOpportunityPreference,
} from '../api';
import { OpportunityCard } from '../components/opportunity-card';
import { DiscoverAdCard } from '../components/discover-ad-card';
import { buildDiscoveryDeck } from '../deck';
import { useDiscoveryStore } from '../discovery-store';
import type { CreatorOpportunityFeedItem, DiscoveryDeckEntry, OpportunityPreferenceState } from '../types';

const SWIPE_DECK_MIN = 5;
const FEED_LIMIT = 150;
/** The undo bar exists only while undo is possible — it is not permanent header chrome. */
const UNDO_WINDOW_MS = 6_000;

function createStyles(c: SemanticColors) {
  return {
    container: { flex: 1, backgroundColor: c.canvas },
    banner: { paddingHorizontal: layout.screenGutter, paddingVertical: 9, backgroundColor: c.ink },
    bannerRow: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, gap: space.sm },
    disclosureRow: { paddingHorizontal: layout.screenGutter, paddingTop: space.xs },
    deckMeta: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
      paddingHorizontal: layout.screenGutter,
      paddingTop: space.xs,
    },
    deck: { flex: 1, justifyContent: 'center' as const, paddingHorizontal: space.md, paddingBottom: 6 },
    listContent: { paddingBottom: 100 },
    /** Depth is a second stroked plane behind, off-axis — never a shadow. */
    backPlane: {
      position: 'absolute' as const,
      left: 12,
      right: -8,
      top: 8,
      bottom: -6,
      borderWidth: 2,
      borderRadius: 0,
      borderColor: c.stroke,
      backgroundColor: c.surfaceSunken,
    },
    exhausted: { gap: space.md },
    shortlist: { padding: space.md, gap: space.xs },
    shortlistRow: { flexDirection: 'row' as const, alignItems: 'flex-end' as const, justifyContent: 'space-between' as const, gap: space.sm },
    errorPlate: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: space.md,
      padding: space.lg,
    },
    undoBar: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: space.sm,
      marginHorizontal: space.md,
      marginTop: space.xs,
      paddingHorizontal: space.sm,
      paddingVertical: 9,
      borderWidth: 2,
      borderRadius: 0,
      borderColor: c.stroke,
      backgroundColor: c.surface,
    },
    undoAction: { minHeight: 44, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, paddingHorizontal: space.xs },
    hint: { paddingBottom: 84, color: c.inkMuted, fontFamily: fonts.regular },
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

  // The undo bar auto-dismisses; the next card is already in place beneath it.
  useEffect(() => {
    if (history.length === 0) return;
    const timer = setTimeout(() => setHistory([]), UNDO_WINDOW_MS);
    return () => clearTimeout(timer);
  }, [history]);

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
  const offline = !network.isConnected || network.isInternetReachable === false || Boolean(feed.error);
  const location = malls.find(mall => mall.id === selectedMall)?.name ?? 'Molapo';

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
    // Only a save is undoable — a pass simply returns to the deck in 30 days.
    if (!useList && state === 'saved') setHistory([entry]);
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

  // A1's card tap has exactly one destination: A8. Live briefs used to fall through
  // to the legacy /challenges/[id] screen, which the redesign never covered.
  const openDetails = (item: CreatorOpportunityFeedItem) => {
    recordCreatorOpportunityEvent(item.opportunity_id, 'detail_open', 'discover').catch(() => undefined);
    router.push(`/opportunity/${item.opportunity_id}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScreenHeader
        variant="brand"
        title="Muse"
        right={
          <Pressable
            onPress={() => router.push('/mall-selector')}
            accessibilityRole="button"
            accessibilityLabel="Change location"
            hitSlop={10}
          >
            <Text variant="label" color={colors.inkMuted}>{location.toUpperCase()} ▾</Text>
          </Pressable>
        }
      />
      {feedItems.some(item => item.is_prototype) && (
        <View style={styles.disclosureRow}>
          <Chip kind="disclosure" tone="ink" label="ALPHA PREVIEW · CONCEPTS ARE ILLUSTRATIVE" />
        </View>
      )}
      {offline && feedItems.length ? (
        <View style={styles.banner}>
          <View style={styles.bannerRow}>
            <Text variant="label" color={colors.onInk}>Offline · showing your last deck</Text>
            <Pressable onPress={() => feed.refetch()} accessibilityRole="button" accessibilityLabel="Try again" hitSlop={10}>
              <Text variant="label" color={colors.payout}>Try again</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      {!useList && deck.length > 0 && (
        <View style={styles.deckMeta}>
          <Text variant="label" color={colors.inkMuted}>{opportunityCount} pots · {deck.length} left</Text>
        </View>
      )}

      <View style={styles.deck}>
        {feed.isLoading ? (
          <DeckSkeleton location={location} />
        ) : feed.error && !feedItems.length ? (
          <Plate style={styles.errorPlate}>
            <Ionicons name="cloud-offline" size={48} color={colors.inkMuted} />
            <Text variant="h2" align="center">Discovery took a break</Text>
            <Text variant="body" align="center" color={colors.inkMuted}>Check your connection and try again.</Text>
            <Button onPress={() => feed.refetch()}>Try again</Button>
          </Plate>
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
            ListEmptyComponent={<DeckExhausted />}
          />
        ) : current ? (
          <>
            {deck[1] && <View pointerEvents="none" style={styles.backPlane} />}
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
                // Passing a sponsored slot is a continue, not a preference — it never enters the model.
                onContinue={() => markActed(current)}
                onLearnMore={() => router.push(`/shop/${current.item.merchantId}`)}
              />
            )}
          </>
        ) : (
          <DeckExhausted />
        )}
      </View>

      {!useList && history.length > 0 ? (
        <View style={styles.undoBar}>
          <Text variant="bodySm">Saved to your shortlist</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Undo last swipe" onPress={undo} style={styles.undoAction}>
            <Ionicons name="arrow-undo" size={17} color={colors.ink} />
            <Text variant="bodySm">Undo</Text>
          </Pressable>
        </View>
      ) : null}
      {!useList && (
        <Text variant="caption" align="center" style={styles.hint}>
          Swipe left to pass · right to save
        </Text>
      )}
    </SafeAreaView>
  );
}

/** A5 — an empty deck still carries the proposition: the rule that emptied it, then the shortlist. */
function DeckExhausted() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const shortlist = useQuery({
    queryKey: ['creator-opportunity-saved'],
    queryFn: getSavedCreatorOpportunities,
    staleTime: 15_000,
  });
  const saved = shortlist.data ?? [];
  const openPots = saved.reduce((total, item) => total + Number(item.pot_value ?? 0), 0);
  return (
    <View style={styles.exhausted}>
      <DashedWell title="You're caught up">
        <Text variant="body" align="center">
          Passed briefs return in 30 days. Your shortlist is waiting whenever you are.
        </Text>
      </DashedWell>
      {saved.length ? (
        <Plate style={styles.shortlist}>
          <Text variant="label">Your shortlist</Text>
          <View style={styles.shortlistRow}>
            <Text variant="bodySm">{saved.length} brief{saved.length === 1 ? '' : 's'}</Text>
            <Money amount={openPots} format="prize" emphasis="strong" />
          </View>
          <Text variant="caption">Combined open pots</Text>
        </Plate>
      ) : null}
      <Button onPress={() => router.push('/saved-opportunities')}>View saved</Button>
      <Button variant="secondary" onPress={() => router.push('/(shop)/marketplace')}>Browse shops</Button>
    </View>
  );
}

/** A4 — the skeleton carries the card's exact anatomy so nothing jumps when data lands. */
function DeckSkeleton({ location }: { location: string }) {
  const { colors } = useDesignTokens();
  return <View style={{ flex: 1, gap: 12 }}>
    <View style={{ flex: 1, borderWidth: 2, borderColor: colors.strokeDim, backgroundColor: colors.surfaceSunken }}>
      <View style={{ height: 250, borderBottomWidth: 2, borderBottomColor: colors.strokeDim }} />
      <View style={{ padding: 16, gap: 11 }}>
        <Skeleton style={{ height: 18, width: '55%', borderColor: colors.strokeQuiet }} />
        <Skeleton style={{ height: 62, borderColor: colors.strokeQuiet }} />
        <View style={{ height: 2, backgroundColor: colors.strokeQuiet }} />
        <Skeleton style={{ height: 70, borderColor: colors.strokeQuiet }} />
      </View>
    </View>
    <Text variant="caption" align="center">Finding funded briefs near {location}</Text>
  </View>;
}
