import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useChallengeStore } from '../../../features/challenges/store/challenge-store';
import { ChallengeCard } from '../../../features/challenges/components/challenge-card';
import { Challenge } from '../../../features/challenges/types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChallengesScreen() {
  const { challenges, loading, fetchChallenges } = useChallengeStore();
  const router = useRouter();
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const { top } = useSafeAreaInsets();

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
        paddingTop: headerHeight + tabBarHeight + top + 20, // Header + TabBar + StatusBar + Spacing
        paddingBottom: 100,
        paddingHorizontal: 20,
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {challenges.map((item) => (
        <ChallengeCard 
          key={item.id} 
          challenge={item} 
          onPress={handlePressChallenge} 
        />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
