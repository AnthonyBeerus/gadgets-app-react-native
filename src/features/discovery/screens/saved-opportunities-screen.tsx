import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  Chip,
  EmptyState,
  ErrorNotice,
  MerchantIdentityRow,
  Money,
  Rule,
  StackScreenTemplate,
  StrokedImage,
  Text,
  useDesignTokens,
} from '../../../shared/design-system';
import { getSavedCreatorOpportunities, restoreCreatorOpportunityPreference } from '../api';

export default function SavedOpportunitiesScreen() {
  const { colors, icons } = useDesignTokens();
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
    <StackScreenTemplate title="Saved briefs" fallbackHref="/(shop)">
      <Text variant="body" color={colors.inkMuted}>
        Briefs you saved in Discover. Saving shortlists a brief — it does not enter you.
      </Text>

      {saved.isLoading ? (
        <ActivityIndicator color={colors.ink} />
      ) : saved.error ? (
        <>
          <ErrorNotice
            title="Saved briefs could not load"
            impact="Your shortlist is untouched — this phone just could not reach Muse."
            recovery="Check your connection and try again."
          />
          <Button onPress={() => saved.refetch()}>Try again</Button>
        </>
      ) : saved.data?.length ? (
        saved.data.map(item => {
          const competitive = item.contest_mode === 'competitive_pot';
          const eligible = Boolean(item.eligibility_proof_id && !item.eligibility_consumed);
          return (
            <View key={item.opportunity_id} style={[styles.card, { borderColor: colors.stroke, backgroundColor: colors.surface }]}>
              <StrokedImage source={{ uri: item.hero_image }} style={styles.image} contentFit="cover" />
              <View style={styles.body}>
                <Chip
                  kind="status"
                  tone={eligible ? 'success' : 'warning'}
                  label={eligible ? 'Ready to enter' : 'Purchase to qualify'}
                />
                <Text variant="h2">{item.opportunity_title || item.product_title}</Text>
                <MerchantIdentityRow merchant={{ id: item.merchant_id, name: item.merchant_name, location: item.merchant_location }} />
                <Text variant="caption" numberOfLines={2}>{item.opportunity_description}</Text>
                <Rule />
                <View style={styles.payout}>
                  {competitive && item.pot_value != null ? (
                    <View>
                      <Text variant="label" color={colors.payout}>Prize pot</Text>
                      <Money amount={Number(item.pot_value)} format="prize" emphasis="strong" style={{ color: colors.payout }} />
                    </View>
                  ) : null}
                  <View>
                    <Text variant="label">Per accepted entry</Text>
                    <Money amount={Number(item.accepted_entry_fee)} format="payout" emphasis="strong" />
                  </View>
                </View>
                <Text variant="caption">Qualifying purchase from <Money amount={Number(item.price)} format="prize" emphasis="body" style={styles.inline} /></Text>
                <Button
                  variant={eligible ? 'commerce' : 'primary'}
                  onPress={() => router.push(eligible ? `/challenges/entry/${item.opportunity_id}` : `/opportunity/${item.opportunity_id}`)}
                >
                  {eligible ? 'Enter this brief' : 'View brief'}
                </Button>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove from saved"
                  onPress={() => remove(item.opportunity_id)}
                  style={styles.remove}
                >
                  <Ionicons name="close" size={icons.sm} color={colors.inkMuted} />
                  <Text variant="caption">Remove from saved</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      ) : (
        <EmptyState
          title="Nothing saved yet"
          rule="Swipe right in Discover when a brief feels like a fit. Your shortlist collects here."
          actionLabel="Start discovering"
          onAction={() => router.replace('/(shop)')}
        />
      )}
    </StackScreenTemplate>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderRadius: 0, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1.8, borderWidth: 0, borderBottomWidth: 2 },
  body: { padding: 16, gap: 11 },
  payout: { flexDirection: 'row', alignItems: 'flex-end', gap: 18 },
  inline: { fontSize: 12, lineHeight: 18 },
  remove: { alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
});
