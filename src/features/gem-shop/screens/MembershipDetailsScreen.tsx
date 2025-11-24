import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';

export default function MembershipDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;
  const [selectedTier, setSelectedTier] = useState<'plus' | 'premium'>('premium');

  const tiers = {
    plus: {
      name: 'MUSE PLUS',
      price: 'P49',
      color: NEO_THEME.colors.blue,
      benefits: [
        { icon: 'diamond', title: 'Monthly Gems', desc: 'Get a monthly gem pack' },
        { icon: 'color-wand', title: 'AI Tools', desc: 'Discounted AI generation' },
        { icon: 'trophy', title: 'Challenge Entry', desc: '20-40% off entry fees' },
        { icon: 'layers', title: 'More Entries', desc: 'Submit up to 3 entries per challenge' },
        { icon: 'flash', title: 'Fast Verification', desc: 'Priority content verification' },
        { icon: 'ticket', title: 'Event Perks', desc: '10% off event tickets' },
        { icon: 'bicycle', title: 'Delivery', desc: '1 priority delivery per month' },
        { icon: 'car', title: 'Ride Discounts', desc: '10% off one ride per week' },
      ]
    },
    premium: {
      name: 'MUSE PREMIUM',
      price: 'P99',
      color: NEO_THEME.colors.yellow,
      benefits: [
        { icon: 'diamond', title: 'Mega Gem Pack', desc: 'Larger monthly gem pack' },
        { icon: 'ticket', title: 'Free Entry', desc: 'Free entry for most gem challenges' },
        { icon: 'layers', title: 'Max Entries', desc: '5-10 entries per challenge' },
        { icon: 'infinite', title: 'Unlimited AI', desc: 'Unlimited or near-free AI tools' },
        { icon: 'star', title: 'All Access', desc: 'Access to ALL subscriber-only challenges' },
        { icon: 'ribbon', title: 'Top Priority', desc: 'Top verification priority' },
        { icon: 'ticket', title: 'Event VIP', desc: '20% off event tickets' },
        { icon: 'bicycle', title: 'Unlimited Delivery', desc: 'Unlimited priority delivery' },
        { icon: 'car', title: 'Ride Perks', desc: '3 discounted rides/week (20% off)' },
        { icon: 'trending-up', title: 'Creator Analytics', desc: 'Advanced insights & promoted visibility' },
      ]
    }
  };

  const currentTier = tiers[selectedTier];

  return (
    <View style={styles.container}>
      <StaticHeader title="MEMBERSHIPS" onBackPress={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerHeight + 20 }
        ]}
      >

        
        {/* Tier Selection */}
        <View style={styles.tierSelector}>
          <TouchableOpacity 
            style={[
              styles.tierOption, 
              selectedTier === 'plus' && styles.tierOptionSelected,
              { borderColor: selectedTier === 'plus' ? NEO_THEME.colors.black : 'transparent' }
            ]}
            onPress={() => setSelectedTier('plus')}
          >
            <Text style={[styles.tierOptionText, selectedTier === 'plus' && styles.tierOptionTextSelected]}>MUSE PLUS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tierOption, 
              selectedTier === 'premium' && styles.tierOptionSelected,
              { borderColor: selectedTier === 'premium' ? NEO_THEME.colors.black : 'transparent' }
            ]}
            onPress={() => setSelectedTier('premium')}
          >
            <Text style={[styles.tierOptionText, selectedTier === 'premium' && styles.tierOptionTextSelected]}>MUSE PREMIUM</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.heroCard, { backgroundColor: currentTier.color }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedTier === 'premium' ? 'BEST VALUE' : 'POPULAR'}</Text>
          </View>
          <Text style={styles.heroTitle}>{currentTier.name}</Text>
          <Text style={styles.heroPrice}>{currentTier.price}<Text style={styles.perMonth}>/mo</Text></Text>
          <Text style={styles.heroDesc}>Unlock the full potential of your experience.</Text>
        </View>

        <Text style={styles.sectionTitle}>WHAT'S INCLUDED</Text>
        
        <View style={styles.benefitsList}>
          {currentTier.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.iconBox}>
                <Ionicons name={benefit.icon as any} size={24} color={NEO_THEME.colors.white} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
          <Text style={styles.subscribeText}>SUBSCRIBE TO {currentTier.name}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Recurring billing. Cancel anytime.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    padding: 20,
    paddingBottom: 140, // Add extra padding for footer
  },
  tierSelector: {
    flexDirection: 'row',
    backgroundColor: NEO_THEME.colors.white,
    padding: 4,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 24,
  },
  tierOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: NEO_THEME.borders.radius - 4,
    borderWidth: 2,
  },
  tierOptionSelected: {
    backgroundColor: NEO_THEME.colors.black,
  },
  tierOptionText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
  },
  tierOptionTextSelected: {
    color: NEO_THEME.colors.white,
  },
  heroCard: {
    padding: 30,
    alignItems: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    marginBottom: 40,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  badge: {
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.white,
  },
  heroTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 32,
    color: NEO_THEME.colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroPrice: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 48,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
  },
  perMonth: {
    fontSize: 20,
    color: NEO_THEME.colors.black,
    opacity: 0.7,
  },
  heroDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  benefitsList: {
    gap: 16,
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    padding: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 4,
  },
  benefitDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.grey,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: NEO_THEME.borders.width,
    borderTopColor: NEO_THEME.colors.black,
  },
  subscribeButton: {
    backgroundColor: NEO_THEME.colors.black,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 16,
  },
  subscribeText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.white,
  },
  disclaimer: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    textAlign: 'center',
  },
});
