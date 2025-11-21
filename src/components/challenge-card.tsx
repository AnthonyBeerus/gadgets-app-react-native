import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '../types/challenge';

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
      <Image source={{ uri: challenge.image_url }} style={styles.image} />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Ionicons name="business" size={12} color="#fff" />
            <Text style={styles.brandName}>{challenge.brand_name}</Text>
          </View>
          <View style={styles.participantsBadge}>
            <Ionicons name="people" size={12} color="#fff" />
            <Text style={styles.participantsText}>{challenge.participants_count}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>{challenge.title}</Text>
          <View style={styles.rewardContainer}>
            <Ionicons name="trophy" size={14} color="#FFD700" />
            <Text style={styles.rewardText}>{challenge.reward}</Text>
          </View>
          <View style={styles.deadlineContainer}>
            <Ionicons name="time-outline" size={12} color="#E0E0E0" />
            <Text style={styles.deadlineText}>Ends {challenge.deadline}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  brandName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  participantsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  participantsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    gap: 6,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '700',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deadlineText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '500',
  },
});
