import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useChallengeStore } from '../store/challenge-store';
import { Challenge } from '../types/challenge';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { ChallengeBadge } from '../components/ChallengeBadge';
import { RewardCard } from '../components/RewardCard';
import { RequirementsList } from '../components/RequirementsList';
import { AIPromoCard } from '../components/AIPromoCard';
import { MetaInfoCard } from '../components/MetaInfoCard';

export default function ChallengeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { challenges } = useChallengeStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (id && challenges.length > 0) {
      const found = challenges.find(c => c.id === Number(id));
      setChallenge(found || null);
    }
  }, [id, challenges]);

  if (!challenge) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
      </View>
    );
  }

  const isPremium = challenge.is_premium;
  const isPaid = challenge.type === 'paid';

  return (
    <View style={styles.container}>
      <StaticHeader title="CHALLENGE DETAILS" onBackPress={() => router.back()} />
      
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: challenge.image_url }} style={styles.image} />
          <View style={styles.overlay}>
            <View style={styles.brandBadge}>
              <Ionicons name="business" size={14} color={NEO_THEME.colors.white} />
              <Text style={styles.brandText}>{challenge.brand_name}</Text>
            </View>
          </View>
        </View>

        {/* Title & Status */}
        <View style={styles.headerSection}>
          <View style={styles.badgesRow}>
            {isPremium && (
              <ChallengeBadge type="premium" text="PLUS MEMBER ONLY" icon="star" />
            )}
            {isPaid && (
              <ChallengeBadge type="fee" text={`ENTRY: ${challenge.entry_fee} GEMS`} icon="diamond" />
            )}
            <ChallengeBadge type="status" text={challenge.status.toUpperCase()} />
            {challenge.ai_allowed && (
              <ChallengeBadge type="ai" text="AI ALLOWED" icon="sparkles" />
            )}
          </View>
          
          <Text style={styles.title}>{challenge.title.toUpperCase()}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          <AIPromoCard onPress={() => router.push('/gem-shop/ai-tools')} />
        </View>

        {/* Reward Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THE REWARD</Text>
          <RewardCard reward={challenge.reward} />
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REQUIREMENTS</Text>
          <RequirementsList requirements={challenge.requirements} />
        </View>

        {/* Deadline & Participants */}
        <MetaInfoCard deadline={challenge.deadline} participants={challenge.participants_count} />
      </ScrollView>

      {/* Sticky Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={[
            styles.ctaButton, 
            isPremium ? { backgroundColor: NEO_THEME.colors.yellow } : 
            isPaid ? { backgroundColor: NEO_THEME.colors.primary } : 
            { backgroundColor: NEO_THEME.colors.black }
          ]}
          activeOpacity={0.9}
          onPress={() => {
            router.push(`/challenges/entry/${challenge.id}`);
          }}
        >
          <Text style={[
            styles.ctaText,
            (isPremium || isPaid) ? { color: NEO_THEME.colors.black } : { color: NEO_THEME.colors.white }
          ]}>
            {isPremium ? 'UNLOCK WITH PLUS' : 
             isPaid ? `UNLOCK FOR ${challenge.entry_fee} GEMS` : 
             'JOIN CHALLENGE'}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={(isPremium || isPaid) ? NEO_THEME.colors.black : NEO_THEME.colors.white} 
          />
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    padding: 0,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 6,
  },
  brandText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.white,
    textTransform: 'uppercase',
  },
  headerSection: {
    padding: 20,
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    backgroundColor: NEO_THEME.colors.white,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 28,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    lineHeight: 22,
  },
  section: {
    padding: 20,
    borderBottomWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderTopWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    gap: 8,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  ctaText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
