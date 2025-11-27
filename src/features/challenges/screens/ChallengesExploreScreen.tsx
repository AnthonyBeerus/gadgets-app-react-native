import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChallengeStore } from '../store/challenge-store';
import { ChallengeCard } from '../components/challenge-card';
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
        // Simple check for demo: if deadline is within next 30 days
        // In real app, use proper date library like date-fns
        const deadline = new Date(c.deadline);
        const now = new Date();
        const diffTime = Math.abs(deadline.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30;
      default: return true;
    }
  });

  const FilterChip = ({ label, type }: { label: FilterType, type?: 'default' | 'premium' | 'ai' | 'urgent' }) => {
    const isActive = activeFilter === label;
    
    let activeColor = NEO_THEME.colors.black;
    if (type === 'premium') activeColor = NEO_THEME.colors.yellow;
    if (type === 'ai') activeColor = NEO_THEME.colors.primary;
    if (type === 'urgent') activeColor = NEO_THEME.colors.error;

    const getTextColor = () => {
      if (!isActive) return NEO_THEME.colors.black;
      // Yellow background needs black text, others (Black, Primary, Error) need white
      if (type === 'premium') return NEO_THEME.colors.black;
      return NEO_THEME.colors.white;
    };

    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          isActive && { backgroundColor: activeColor },
          isActive && type === 'ai' && { borderColor: NEO_THEME.colors.black }
        ]}
        onPress={() => setActiveFilter(label)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.filterText,
          { color: getTextColor() }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

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
      <TouchableOpacity 
        style={styles.aiBanner}
        activeOpacity={0.9}
        onPress={() => router.push('/gem-shop/ai-tools')}
      >
        <View style={styles.aiBannerContent}>
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={24} color={NEO_THEME.colors.white} />
          </View>
          <View style={styles.aiBannerText}>
            <Text style={styles.aiBannerTitle}>NEED AN EDGE?</Text>
            <Text style={styles.aiBannerDesc}>Use AI Tools to create winning content</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color={NEO_THEME.colors.white} />
        </View>
      </TouchableOpacity>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        <FilterChip label="ALL" />
        <FilterChip label="FREE" />
        <FilterChip label="PREMIUM" type="premium" />
        <FilterChip label="AI ALLOWED" type="ai" />
        <FilterChip label="ENDING SOON" type="urgent" />
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
  aiBanner: {
    backgroundColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: NEO_THEME.colors.white,
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
    marginBottom: 2,
  },
  aiBannerDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.greyLight,
  },
  filterContainer: {
    gap: 8,
    paddingBottom: 4, // Space for shadow
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    marginRight: 4,
  },
  filterText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
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
