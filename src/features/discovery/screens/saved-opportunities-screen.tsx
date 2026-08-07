import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { getSavedCreatorOpportunities, restoreCreatorOpportunityPreference } from '../api';

export default function SavedOpportunitiesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saved = useQuery({
    queryKey: ['creator-opportunity-saved'],
    queryFn: getSavedCreatorOpportunities,
    staleTime: 15_000,
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    }, [queryClient]),
  );

  const remove = async (opportunityId: number) => {
    await restoreCreatorOpportunityPreference(opportunityId);
    queryClient.invalidateQueries({ queryKey: ['creator-opportunity-saved'] });
    queryClient.invalidateQueries({ queryKey: ['creator-opportunity-feed'] });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={NEO_THEME.colors.black} />
          </Pressable>
          <View style={styles.headerCopy}>
            <NuviaText variant="display">SAVED</NuviaText>
            <NuviaText variant="body">Challenges you hearted in Discover. Saving does not enter you.</NuviaText>
          </View>
        </View>

        {saved.isLoading ? (
          <ActivityIndicator size="large" color={NEO_THEME.colors.primary} />
        ) : saved.error ? (
          <View style={styles.empty}>
            <NuviaText variant="h2">COULDN'T LOAD SAVED</NuviaText>
            <Pressable onPress={() => saved.refetch()} style={styles.action}>
              <NuviaText variant="bodyBold">TRY AGAIN</NuviaText>
            </Pressable>
          </View>
        ) : saved.data?.length ? (
          saved.data.map(item => {
            const competitive = item.contest_mode === 'competitive_pot';
            const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed);
            const potLabel = competitive && item.pot_value != null
              ? `P${Number(item.pot_value).toFixed(0)} POT`
              : `P${Number(item.reward_value).toFixed(0)} VOUCHER`;

            return (
              <View key={item.opportunity_id} style={styles.card}>
                <Image source={{ uri: item.hero_image }} style={styles.image} contentFit="cover" />
                <View style={styles.cardBody}>
                  <View style={styles.badges}>
                    <View style={[styles.badge, eligible && styles.eligibleBadge]}>
                      <NuviaText variant="caption">{eligible ? 'READY TO ENTER' : 'SAVED'}</NuviaText>
                    </View>
                    <View style={[styles.badge, competitive ? styles.potBadge : styles.rewardBadge]}>
                      <NuviaText variant="caption">{potLabel}</NuviaText>
                    </View>
                  </View>
                  <NuviaText variant="h2">{item.opportunity_title || item.product_title}</NuviaText>
                  <NuviaText variant="body">{item.merchant_name} · {item.merchant_location}</NuviaText>
                  <NuviaText variant="caption" numberOfLines={2}>{item.opportunity_description}</NuviaText>
                  <NuviaText variant="h3" color={NEO_THEME.colors.primary}>FROM P{Number(item.price).toFixed(0)}</NuviaText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/challenges/${item.opportunity_id}`)}
                    style={[styles.action, eligible && styles.eligibleAction]}
                  >
                    <NuviaText variant="bodyBold">
                      {eligible ? 'ENTER CHALLENGE' : competitive ? 'VIEW CHALLENGE' : 'VIEW PRODUCT + BRIEF'}
                    </NuviaText>
                    <Ionicons name="arrow-forward" size={18} color={NEO_THEME.colors.black} />
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={() => remove(item.opportunity_id)} style={styles.removeButton}>
                    <NuviaText variant="caption">REMOVE FROM SAVED</NuviaText>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={54} color={NEO_THEME.colors.primary} />
            <NuviaText variant="h2">NO SAVED OPPORTUNITIES</NuviaText>
            <NuviaText variant="body" align="center">
              Swipe right in Discover when a challenge feels like a fit. Your shortlist shows up here.
            </NuviaText>
            <Pressable onPress={() => router.replace('/(shop)')} style={styles.action}>
              <NuviaText variant="bodyBold">START DISCOVERING</NuviaText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  content: { gap: 18, padding: 16, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  headerCopy: { flex: 1, gap: 3 },
  iconButton: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 14, backgroundColor: NEO_THEME.colors.white },
  card: { overflow: 'hidden', borderWidth: 3, borderColor: NEO_THEME.colors.black, borderRadius: 20, backgroundColor: NEO_THEME.colors.white, boxShadow: '5px 5px 0px #000000' },
  image: { width: '100%', aspectRatio: 1.8 },
  cardBody: { gap: 8, padding: 14 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  badge: { borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.white, paddingHorizontal: 9, paddingVertical: 5 },
  eligibleBadge: { backgroundColor: NEO_THEME.colors.success },
  rewardBadge: { backgroundColor: NEO_THEME.colors.secondary },
  potBadge: { backgroundColor: NEO_THEME.colors.secondary },
  action: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.secondary, paddingHorizontal: 18 },
  eligibleAction: { backgroundColor: NEO_THEME.colors.success },
  removeButton: { alignSelf: 'center', padding: 8 },
  empty: { alignItems: 'center', gap: 14, borderWidth: 3, borderColor: NEO_THEME.colors.black, borderRadius: 20, backgroundColor: NEO_THEME.colors.white, padding: 28 },
});
