import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { getSavedCreatorOpportunities, restoreCreatorOpportunityPreference } from '../api';

function createStyles(c: { black: string; white: string; grey: string; border: string; background: string; secondary: string; primary: string; success: string }) {
  return {
    container: { flex: 1, backgroundColor: c.background },
    content: { gap: 18, padding: 16, paddingBottom: 48 },
    header: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 12 },
    headerCopy: { flex: 1, gap: 3 },
    iconButton: { width: 46, height: 46, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: c.border, borderRadius: 14, backgroundColor: c.white },
    card: { overflow: 'hidden' as const, borderWidth: 1, borderColor: c.border, borderRadius: 20, backgroundColor: c.white, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
    image: { width: '100%' as const, aspectRatio: 1.8 },
    cardBody: { gap: 8, padding: 14 },
    badges: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 7 },
    badge: { borderWidth: 1, borderColor: c.border, borderRadius: 999, backgroundColor: c.white, paddingHorizontal: 9, paddingVertical: 5 },
    eligibleBadge: { backgroundColor: c.success },
    rewardBadge: { backgroundColor: c.secondary },
    potBadge: { backgroundColor: c.secondary },
    action: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, borderWidth: 1, borderColor: c.border, borderRadius: 999, backgroundColor: c.secondary, paddingHorizontal: 18 },
    eligibleAction: { backgroundColor: c.success },
    removeButton: { alignSelf: 'center' as const, padding: 8 },
    empty: { alignItems: 'center' as const, gap: 14, borderWidth: 1, borderColor: c.border, borderRadius: 20, backgroundColor: c.white, padding: 28 },
  };
}

export default function SavedOpportunitiesScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
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
            <Ionicons name="arrow-back" size={22} color={c.black} />
          </Pressable>
          <View style={styles.headerCopy}>
            <NuviaText variant="display">SAVED</NuviaText>
            <NuviaText variant="body">Challenges you hearted in Discover. Saving does not enter you.</NuviaText>
          </View>
        </View>

        {saved.isLoading ? (
          <ActivityIndicator size="large" color={c.primary} />
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
              : `P${Number(item.accepted_entry_fee).toFixed(0)} ACCEPTED-ENTRY FEE`;

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
                  <NuviaText variant="h3" color={c.primary}>FROM P{Number(item.price).toFixed(0)}</NuviaText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/challenges/${item.opportunity_id}`)}
                    style={[styles.action, eligible && styles.eligibleAction]}
                  >
                    <NuviaText variant="bodyBold">
                      {eligible ? 'ENTER CHALLENGE' : competitive ? 'VIEW CHALLENGE' : 'VIEW PRODUCT + BRIEF'}
                    </NuviaText>
                    <Ionicons name="arrow-forward" size={18} color={c.black} />
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
            <Ionicons name="heart-outline" size={54} color={c.primary} />
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
