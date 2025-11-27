import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useChallengeStore } from '../store/challenge-store';
import { ChallengeCard } from '../components/challenge-card';
import { FilterChip } from '../components/FilterChip';
import { AIBanner } from '../../../shared/components/ui/AIBanner';
import { Challenge } from '../types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterType = 'ALL' | 'FREE' | 'PREMIUM' | 'AI ALLOWED' | 'ENDING SOON';

export default function ChallengesExploreScreen() {
  const { challenges, loading, fetchChallenges } = useChallengeStore();
  const router = useRouter();
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const { top } = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handlePressChallenge = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.id}`);
  };

  const filteredChallenges = challenges.filter(c => {
    switch (activeFilter) {
      case 'FREE': return c.type === 'free';
      case 'PREMIUM': return c.is_premium || c.type === 'subscriber';
      case 'AI ALLOWED': return c.ai_allowed;
      case 'ENDING SOON': 
        const deadline = new Date(c.deadline);
        const now = new Date();
        const diffTime = Math.abs(deadline.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30;
      default: return true;
    }
  });

  if (loading && challenges.length === 0) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: headerHeight + tabBarHeight + top }]}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingTop: headerHeight + tabBarHeight + top + 20,
        paddingBottom: 100,
        paddingHorizontal: 20,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <AIBanner onPress={() => router.push('/gem-shop/ai-tools')} />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        <FilterChip label="ALL" isActive={activeFilter === 'ALL'} onPress={() => setActiveFilter('ALL')} />
        <FilterChip label="FREE" isActive={activeFilter === 'FREE'} onPress={() => setActiveFilter('FREE')} />
        <FilterChip label="PREMIUM" type="premium" isActive={activeFilter === 'PREMIUM'} onPress={() => setActiveFilter('PREMIUM')} />
        <FilterChip label="AI ALLOWED" type="ai" isActive={activeFilter === 'AI ALLOWED'} onPress={() => setActiveFilter('AI ALLOWED')} />
        <FilterChip label="ENDING SOON" type="urgent" isActive={activeFilter === 'ENDING SOON'} onPress={() => setActiveFilter('ENDING SOON')} />
      </ScrollView>

      {filteredChallenges.map((item) => (
        <ChallengeCard 
          key={item.id} 
          challenge={item} 
          onPress={handlePressChallenge} 
        />
      ))}
      
      {filteredChallenges.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No challenges found matching this filter.</Text>
        </View>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    gap: 8,
    paddingBottom: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
  },
});
