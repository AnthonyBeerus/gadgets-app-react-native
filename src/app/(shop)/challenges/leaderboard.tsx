import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NeoView } from '../../../shared/components/ui/neo-view';

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <NeoView style={styles.placeholderCard}>
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.subtitle}>COMING SOON</Text>
        <Text style={styles.description}>
          Compete with other creators and climb the ranks to win exclusive rewards!
        </Text>
      </NeoView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
    padding: 20,
    justifyContent: 'center',
  },
  placeholderCard: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NEO_THEME.colors.primary,
    fontFamily: NEO_THEME.fonts.bold,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
    lineHeight: 24,
  },
});
