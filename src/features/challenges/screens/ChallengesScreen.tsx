import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useChallengeStore } from '../store/challenge-store';
import { ChallengeCard } from '../components/challenge-card';
import { Challenge } from '../types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { AnimatedHeaderLayout } from '../../../shared/components/layout/AnimatedHeaderLayout';

export default function ChallengesScreen() {
  const { challenges, loading, fetchChallenges } = useChallengeStore();
  const router = useRouter();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handlePressChallenge = (challenge: Challenge) => {
    // Navigate to details (to be implemented)
    console.log('Pressed challenge:', challenge.title);
  };

  const renderSmallTitle = () => (
    <Text style={styles.smallHeaderTitle}>CHALLENGES</Text>
  );

  const renderLargeTitle = () => (
    <View>
      <Text style={styles.largeHeaderTitle}>CHALLENGES</Text>
      <Text style={styles.largeHeaderSubtitle}>CREATE CONTENT, WIN REWARDS</Text>
    </View>
  );

  if (loading && challenges.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  return (
    <AnimatedHeaderLayout
      renderSmallTitle={renderSmallTitle}
      renderLargeTitle={renderLargeTitle}
    >
      <View style={styles.listContent}>
        {challenges.map((item) => (
          <ChallengeCard 
            key={item.id} 
            challenge={item} 
            onPress={handlePressChallenge} 
          />
        ))}
      </View>
    </AnimatedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  largeHeaderTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  largeHeaderSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
});
