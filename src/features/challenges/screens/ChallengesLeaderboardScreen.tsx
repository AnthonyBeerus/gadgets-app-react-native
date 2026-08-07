import React from 'react';
import { Text } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NeoView } from '../../../shared/components/ui/neo-view';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';

export default function ChallengesLeaderboardScreen() {
  const styles = useNeoStyles(createStyles);
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
    </Animated.ScrollView>
  );
}

function createStyles(c: { white: string; black: string; primary: string; grey: string }) {
  return {
    placeholderCard: {
      backgroundColor: c.white,
      padding: 32,
      alignItems: 'center' as const,
    },
    title: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: c.black,
      fontFamily: NEO_THEME.fonts.black,
      marginBottom: 8,
      textTransform: 'uppercase' as const,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: c.primary,
      fontFamily: NEO_THEME.fonts.bold,
      marginBottom: 16,
      textTransform: 'uppercase' as const,
    },
    description: {
      fontSize: 16,
      color: c.grey,
      textAlign: 'center' as const,
      lineHeight: 24,
    },
  };
}
