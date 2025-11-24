import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NeoView } from '../../../shared/components/ui/neo-view';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const { top } = useSafeAreaInsets();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingTop: headerHeight + tabBarHeight + top + 20,
        paddingBottom: 100,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <NeoView style={styles.placeholderCard}>
        <Text style={styles.title}>LEADERBOARD</Text>
        <Text style={styles.subtitle}>COMING SOON</Text>
        <Text style={styles.description}>
          Compete with other creators and climb the ranks to win exclusive rewards!
        </Text>
      </NeoView>
      
      {/* Dummy content to demonstrate scrolling */}
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={{ height: 100, backgroundColor: 'rgba(0,0,0,0.05)', marginTop: 16, borderRadius: 12 }} />
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
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
