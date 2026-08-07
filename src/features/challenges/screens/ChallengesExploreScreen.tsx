import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useChallengeStore } from '../store/challenge-store';
import { ChallengeCard } from '../components/challenge-card';
import { FilterChip } from '../components/FilterChip';
import { Challenge } from '../types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FlashListPropsWithEstimatedItemSize<T> extends FlashListProps<T> {
  estimatedItemSize: number;
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as unknown as <T>(props: FlashListPropsWithEstimatedItemSize<T> & { ref?: any }) => React.ReactElement;

type FilterType = 'ALL' | 'ENDING SOON';

export default function ChallengesExploreScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
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
      case 'ENDING SOON':
        const deadline = new Date(c.deadline);
        const now = new Date();
        const diffTime = Math.abs(deadline.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30;
      default: return true;
    }
  });

  const renderItem = ({ item }: { item: Challenge }) => (
    <ChallengeCard 
      challenge={item} 
      onPress={handlePressChallenge} 
    />
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <ScrollView
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        <FilterChip label="ALL" isActive={activeFilter === 'ALL'} onPress={() => setActiveFilter('ALL')} />
        <FilterChip label="ENDING SOON" type="urgent" isActive={activeFilter === 'ENDING SOON'} onPress={() => setActiveFilter('ENDING SOON')} />
      </ScrollView>
    </View>
  );

  if (loading && challenges.length === 0) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: headerHeight + tabBarHeight + top }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AnimatedFlashList<Challenge>
      data={filteredChallenges}
      renderItem={renderItem}
      estimatedItemSize={280}
      onScroll={onScroll}
      scrollEventThrottle={16}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{
        paddingTop: headerHeight + tabBarHeight + top + 20,
        paddingBottom: 100,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No creator opportunities match this filter.</Text>
        </View>
      }
    />
  );
}

function createStyles(c: { grey: string }) {
  return {
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    headerContainer: {
      gap: 16,
      marginBottom: 16,
    },
    filterContainer: {
      gap: 8,
      paddingBottom: 4,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center' as const,
    },
    emptyText: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 14,
      color: c.grey,
    },
  };
}
