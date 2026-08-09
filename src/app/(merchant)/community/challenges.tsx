import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { useAuth } from '../../../shared/providers/auth-provider';
import { getShopChallenges, deleteChallenge } from '../../../shared/api/api';
import { Alert } from 'react-native';

import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCollapsibleTab } from "../../../shared/context/CollapsibleTabContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCampaignResults, useSettleCompetitiveChallenge } from '../../../features/challenges/api/submissions';

function OpportunityResults({ challengeId }: { challengeId: number }) {
  const styles = useNeoStyles(createStyles);
  const { data } = useCampaignResults(challengeId);
  if (!data) return null;
  return (
    <View style={styles.resultsRow}>
      <Text style={styles.resultText}>{data.impressions} VIEWS</Text>
      <Text style={styles.resultText}>{data.saves} SAVES</Text>
      <Text style={styles.resultText}>{data.attributed_purchases} PURCHASES</Text>
      <Text style={styles.resultText}>{data.eligible_purchasers} ELIGIBLE</Text>
      <Text style={styles.resultText}>{data.verified_posts} VERIFIED</Text>
      <Text style={styles.resultText}>{data.payouts_paid}/{data.payouts_created} PAID</Text>
    </View>
  );
}

function SettleButton({ item }: { item: any }) {
  const styles = useNeoStyles(createStyles);
  const settle = useSettleCompetitiveChallenge();
  if (item.contest_mode !== 'competitive_pot' || item.settled_at) {
    return item.settled_at ? <Text style={styles.deadline}>Settled {new Date(item.settled_at).toLocaleDateString()}</Text> : null;
  }
  return (
    <TouchableOpacity
      style={styles.settleBtn}
      disabled={settle.isPending}
      onPress={() => Alert.alert(
        'Settle pot?',
        'Finalizes the quality and engagement ranking, then creates the disclosed cash payouts.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settle',
            style: 'destructive',
            onPress: () => settle.mutate(item.id, {
              onSuccess: (result: any) => Alert.alert('Settled', `Cash payouts created: ${result?.payouts_created ?? 0}.`),
              onError: (err: Error) => Alert.alert('Error', err.message),
            }),
          },
        ]
      )}
    >
      <Text style={styles.settleText}>{settle.isPending ? 'SETTLING…' : 'SETTLE POT'}</Text>
    </TouchableOpacity>
  );
}

export default function MerchantChallengesScreen() {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const { merchantShopId } = useAuth();
  const { data: challenges, isLoading, error } = getShopChallenges(merchantShopId || 0);

  // Collapsible Tab Logic
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const insets = useSafeAreaInsets();
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { mutate: deleteChallengeMutation } = deleteChallenge();

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteChallengeMutation(id, {
                onSuccess: () => Alert.alert("Success", "Challenge deleted"),
                onError: (err) => Alert.alert("Error", err.message)
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <MaterialIcons name="delete-outline" size={24} color="gray" />
            </TouchableOpacity>
        </View>
        <View style={[styles.statusBadge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.brand}>{item.brand_name || 'My Shop'}</Text>
        <Text style={styles.reward}>
          {item.contest_mode === 'competitive_pot'
            ? `Pot P${Number(item.pot_value ?? 0).toFixed(0)} · top 5`
            : `🏆 ${item.reward}`}
        </Text>
        <Text style={styles.deadline}>Ends: {new Date(item.deadline).toLocaleDateString()}</Text>
        <View style={styles.statsRow}>
             <Text style={styles.participants}>👥 {item.participants_count || 0} participants</Text>
        </View>
        <OpportunityResults challengeId={item.id} />
        <SettleButton item={item} />
        <TouchableOpacity onPress={() => router.push(`/challenges/leaderboard?id=${item.id}`)}>
          <Text style={styles.participants}>View leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/challenges/review')}>
          <Text style={styles.participants}>Review entries</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const AddButton = (
    <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => router.push('/challenges/create')}
    >
        <MaterialIcons name="add" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Create</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
        <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
  }

  if (error) {
    return (
        <View style={[styles.center, { paddingTop: headerHeight + tabBarHeight }]}>
            <Text style={styles.errorText}>Error loading challenges: {error.message}</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={challenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: 100,
            paddingTop: headerHeight + tabBarHeight + insets.top + 16 
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active challenges.</Text>
              <Text style={styles.emptySubtext}>Create a challenge to engage your customers!</Text>
          </View>
        }
      />
      {/* Floating Action Button for Create (since we removed the header button) */}
      <View style={[styles.fabContainer, { bottom: 20 }]}>
         {AddButton}
      </View>
    </View>
  );
}

function createStyles(c: {
  backgroundLight: string;
  primary: string;
  border: string;
  black: string;
  white: string;
  grey: string;
  secondary: string;
}) {
  return {
  container: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  center: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  fabContainer: {
      position: 'absolute' as const,
      right: 20,
      bottom: 20,
      zIndex: 10,
  },
  floatingButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: c.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  floatingButtonText: {
    color: c.white,
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    backgroundColor: c.white,
    marginBottom: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    overflow: 'hidden' as const,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    width: '100%' as const,
    height: 150,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: NEO_THEME.fonts.bold,
    flex: 1,
    marginRight: 8,
  },
  brand: {
    fontSize: 14,
    color: c.grey,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 8,
  },
  reward: {
    fontSize: 16,
    fontFamily: NEO_THEME.fonts.bold,
    color: c.primary,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: c.black,
  },
  statsRow: {
    flexDirection: 'row' as const,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  participants: {
    fontSize: 14,
    fontFamily: NEO_THEME.fonts.regular,
    color: c.grey,
  },
  resultsRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8, marginTop: 10 },
  resultText: { fontFamily: NEO_THEME.fonts.bold, fontSize: 10, color: c.black, backgroundColor: c.secondary, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: c.border },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
  },
  statusActive: {
    backgroundColor: '#C6F6D5',
  },
  statusInactive: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 12,
    fontFamily: NEO_THEME.fonts.bold,
  },
  deleteBtn: {
    padding: 4,
  },
  settleBtn: {
    marginTop: 12,
    minHeight: 42,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: c.primary,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
  },
  settleText: {
    color: c.white,
    fontFamily: NEO_THEME.fonts.bold,
  },
  errorText: {
    color: 'red',
    fontFamily: NEO_THEME.fonts.bold,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: 300,
  },
  emptyText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: NEO_THEME.fonts.regular,
    color: c.grey,
    textAlign: 'center' as const,
  },
  };
}
