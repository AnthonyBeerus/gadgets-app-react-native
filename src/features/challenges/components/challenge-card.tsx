import React from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '../types/challenge';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
}

export const ChallengeCard = ({ challenge, onPress }: ChallengeCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(challenge)}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: challenge.image_url }} 
        style={styles.image} 
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Ionicons name="business" size={12} color="#fff" />
            <Text style={styles.brandName}>{challenge.brand_name}</Text>
          </View>
          
          <View style={styles.badgesRow}>
            {challenge.is_premium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={12} color={NEO_THEME.colors.black} />
                <Text style={styles.premiumText}>PLUS</Text>
              </View>
            )}
            {challenge.entry_fee ? (
              <View style={styles.feeBadge}>
                <Ionicons name="diamond" size={12} color={NEO_THEME.colors.white} />
                <Text style={styles.feeText}>{challenge.entry_fee}</Text>
              </View>
            ) : (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>FREE</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>{challenge.title.toUpperCase()}</Text>
          <View style={styles.rewardContainer}>
            <Ionicons name="trophy" size={14} color="#FFD700" />
            <Text style={styles.rewardText}>{challenge.reward}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.deadlineContainer}>
              <Ionicons name="time-outline" size={12} color="#E0E0E0" />
              <Text style={styles.deadlineText}>Ends {challenge.deadline}</Text>
            </View>
            <View style={styles.participantsContainer}>
              <Ionicons name="people" size={12} color="#E0E0E0" />
              <Text style={styles.deadlineText}>{challenge.participants_count} joined</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 280,
    borderRadius: NEO_THEME.borders.radius,
    overflow: 'hidden',
    backgroundColor: NEO_THEME.colors.backgroundLight,
    marginBottom: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.white,
  },
  brandName: {
    color: NEO_THEME.colors.white,
    fontSize: 12,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  premiumText: {
    color: NEO_THEME.colors.black,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
  },
  feeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.white,
  },
  feeText: {
    color: NEO_THEME.colors.white,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
  },
  freeBadge: {
    backgroundColor: NEO_THEME.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.white,
  },
  freeText: {
    color: NEO_THEME.colors.white,
    fontSize: 10,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    gap: 8,
  },
  title: {
    color: NEO_THEME.colors.white,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textTransform: 'uppercase',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NEO_THEME.colors.yellow,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  rewardText: {
    color: NEO_THEME.colors.black,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: NEO_THEME.fonts.black,
    textTransform: 'uppercase',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deadlineText: {
    color: NEO_THEME.colors.white,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: NEO_THEME.fonts.bold,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
