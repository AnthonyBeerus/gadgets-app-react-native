import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChallengeStore } from '../store/challenge-store';
import { ChallengeCard } from '../components/challenge-card';
import { Challenge } from '../types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChallengesExploreScreen() {
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
});
