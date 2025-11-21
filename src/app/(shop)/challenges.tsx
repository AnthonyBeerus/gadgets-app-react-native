import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useChallengeStore } from '../../store/challenge-store';
import { ChallengeCard } from '../../components/challenge-card';
import { Challenge } from '../../types/challenge';
import { useRouter } from 'expo-router';
import { NEO_THEME } from '../../constants/neobrutalism';

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

  if (loading && challenges.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CHALLENGES</Text>
        <Text style={styles.headerSubtitle}>CREATE CONTENT, WIN REWARDS</Text>
      </View>
      
      <FlatList
        data={challenges}
        renderItem={({ item }) => (
          <ChallengeCard challenge={item} onPress={handlePressChallenge} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchChallenges}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: NEO_THEME.colors.white,
    borderBottomWidth: NEO_THEME.borders.width,
    borderBottomColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 14,
    color: NEO_THEME.colors.grey,
    marginTop: 4,
    fontWeight: '700',
    fontFamily: NEO_THEME.fonts.bold,
    textTransform: 'uppercase',
  },
  listContent: {
    padding: 20,
  },
});
