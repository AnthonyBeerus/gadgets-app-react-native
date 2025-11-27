import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useChallengeStore } from '../store/challenge-store';
import { Challenge } from '../types/challenge';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';

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
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color={NEO_THEME.colors.black} />
                <Text style={styles.premiumText}>PLUS MEMBER ONLY</Text>
              </View>
            )}
            {isPaid && (
              <View style={styles.feeBadge}>
                <Ionicons name="diamond" size={12} color={NEO_THEME.colors.white} />
                <Text style={styles.feeText}>ENTRY: {challenge.entry_fee} GEMS</Text>
              </View>
            )}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{challenge.status.toUpperCase()}</Text>
            </View>
            {challenge.ai_allowed && (
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color={NEO_THEME.colors.white} />
                <Text style={styles.aiBadgeText}>AI ALLOWED</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.title}>{challenge.title.toUpperCase()}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          {/* AI Promo Banner */}
          <TouchableOpacity 
            style={styles.aiPromo}
            activeOpacity={0.9}
            onPress={() => router.push('/gem-shop/ai-tools')}
          >
            <View style={styles.aiPromoIcon}>
              <Ionicons name="color-wand" size={20} color={NEO_THEME.colors.white} />
            </View>
            <View style={styles.aiPromoContent}>
              <Text style={styles.aiPromoTitle}>NEED AN EDGE?</Text>
              <Text style={styles.aiPromoText}>Use AI Tools to create winning content</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={NEO_THEME.colors.black} />
          </TouchableOpacity>
        </View>

        {/* Reward Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THE REWARD</Text>
          <View style={styles.rewardCard}>
            <Ionicons name="trophy" size={32} color={NEO_THEME.colors.yellow} />
            <Text style={styles.rewardText}>{challenge.reward}</Text>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REQUIREMENTS</Text>
          <View style={styles.requirementsList}>
            {challenge.requirements.map((req, index) => (
              <View key={index} style={styles.reqItem}>
                <Ionicons name="checkmark-circle" size={20} color={NEO_THEME.colors.success} />
                <Text style={styles.reqText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Deadline & Participants */}
        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Ionicons name="time" size={20} color={NEO_THEME.colors.black} />
            <Text style={styles.metaLabel}>Deadline</Text>
            <Text style={styles.metaValue}>{challenge.deadline}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people" size={20} color={NEO_THEME.colors.black} />
            <Text style={styles.metaLabel}>Joined</Text>
            <Text style={styles.metaValue}>{challenge.participants_count}</Text>
          </View>
        </View>
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
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  premiumText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.black,
  },
  feeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  feeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.white,
  },
  statusBadge: {
    backgroundColor: NEO_THEME.colors.greyLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  statusText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 10,
    color: NEO_THEME.colors.black,
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
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    padding: 20,
    borderRadius: NEO_THEME.borders.radius,
    gap: 16,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  rewardText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.white,
    flex: 1,
  },
  requirementsList: {
    gap: 12,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  reqText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    flex: 1,
    lineHeight: 22,
  },
  metaSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: NEO_THEME.colors.white,
    marginBottom: 20,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: 2,
    backgroundColor: NEO_THEME.colors.greyLight,
  },
  metaLabel: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 18,
    color: NEO_THEME.colors.black,
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
    // Hard shadow
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
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  aiBadgeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 10,
    color: NEO_THEME.colors.white,
  },
  aiPromo: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 12,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
  },
  aiPromoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiPromoContent: {
    flex: 1,
  },
  aiPromoTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 14,
    color: NEO_THEME.colors.black,
  },
  aiPromoText: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
