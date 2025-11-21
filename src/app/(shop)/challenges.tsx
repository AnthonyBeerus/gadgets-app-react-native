import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useChallengeStore } from '../../store/challenge-store';
import { ChallengeCard } from '../../components/challenge-card';
import { Challenge } from '../../types/challenge';
import { useRouter } from 'expo-router';

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
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
        <Text style={styles.headerSubtitle}>Create content, win rewards</Text>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
});
