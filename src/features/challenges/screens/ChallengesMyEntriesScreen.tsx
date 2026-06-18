import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { NeoView } from '../../../shared/components/ui/neo-view';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useCollapsibleTab } from '../../../shared/context/CollapsibleTabContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMySubmissions } from '../api/submissions';
import { ChallengeSubmission } from '../types/challenge';

const STATUS_COLOR: Record<ChallengeSubmission['status'], string> = {
  pending: NEO_THEME.colors.warning,
  approved: NEO_THEME.colors.success,
  rejected: NEO_THEME.colors.error,
};

export default function ChallengesMyEntriesScreen() {
  const { scrollY, headerHeight, tabBarHeight } = useCollapsibleTab();
  const { top } = useSafeAreaInsets();
  const { data: submissions, isLoading } = useMySubmissions();

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
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
        </View>
      ) : !submissions || submissions.length === 0 ? (
        <NeoView style={styles.placeholderCard}>
          <Text style={styles.title}>MY ENTRIES</Text>
          <Text style={styles.subtitle}>NO ENTRIES YET</Text>
          <Text style={styles.description}>
            Join a challenge and submit your content to see it here.
          </Text>
        </NeoView>
      ) : (
        submissions.map((submission) => (
          <NeoView key={submission.id} style={styles.entryCard}>
            <Image source={{ uri: submission.content_url }} style={styles.entryImage} />
            <View style={styles.entryFooter}>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[submission.status] }]}>
                <Text style={styles.statusText}>{submission.status.toUpperCase()}</Text>
              </View>
              {!!submission.caption && (
                <Text style={styles.caption} numberOfLines={2}>
                  {submission.caption}
                </Text>
              )}
            </View>
          </NeoView>
        ))
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    paddingVertical: 60,
    alignItems: 'center',
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
  entryCard: {
    backgroundColor: NEO_THEME.colors.white,
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  entryImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  entryFooter: {
    padding: 16,
    gap: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  statusText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.black,
  },
  caption: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
});
