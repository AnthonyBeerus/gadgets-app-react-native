import { Redirect, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMerchantCampaigns } from '../../features/campaigns/api/campaigns';
import { CampaignStatusTag, describeDeadline } from '../../features/campaigns/components/StatusTag';
import {
  Button,
  Money,
  Rule,
  ScreenHeader,
  Skeleton,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../shared/design-system';
import { useAuth } from '../../shared/providers/auth-provider';

export default function MerchantDashboard() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { isMerchant } = useAuth();
  const { data: campaigns, isLoading } = useMerchantCampaigns();

  if (!isMerchant) return <Redirect href="/open-shop" />;

  const live = useMemo(
    () => (campaigns ?? []).filter(c => c.status === 'published'),
    [campaigns],
  );
  const needsAttention = useMemo(
    () => (campaigns ?? []).filter(c => c.status === 'closed'),
    [campaigns],
  );
  const totalCommitted = useMemo(
    () =>
      (campaigns ?? [])
        .filter(c => c.status === 'published' || c.status === 'closed')
        .reduce((sum, c) => sum + Number(c.pot_value ?? 0), 0),
    [campaigns],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Dashboard" />
      <View style={styles.body}>
        {isLoading ? (
          <>
            <Skeleton style={styles.skeleton} />
            <Skeleton style={styles.skeleton} />
          </>
        ) : (
          <>
            <Surface style={styles.hero}>
              <Text variant="label">Committed to prizes</Text>
              <Money amount={totalCommitted} format="prize" emphasis="hero" />
              <Text variant="caption" style={styles.muted}>
                Across {live.length} live campaign{live.length === 1 ? '' : 's'}
              </Text>
            </Surface>

            {needsAttention.length > 0 ? (
              <Surface style={styles.callout}>
                <Text variant="label">Waiting on you</Text>
                {needsAttention.map(campaign => (
                  <View key={campaign.id} style={styles.row}>
                    <Text variant="body" style={styles.flex} numberOfLines={1}>
                      {campaign.title}
                    </Text>
                    <Button
                      variant="secondary"
                      onPress={() => router.push(`/(merchant)/campaigns/${campaign.id}`)}
                    >
                      Pick winners
                    </Button>
                  </View>
                ))}
              </Surface>
            ) : null}

            <Rule />

            <Text variant="label">Live campaigns</Text>
            {live.length === 0 ? (
              <Text variant="body" style={styles.muted}>
                Nothing running right now. Launch a campaign to start collecting content.
              </Text>
            ) : (
              live.map(campaign => (
                <Surface key={campaign.id} style={styles.card}>
                  <View style={styles.row}>
                    <Text variant="body" style={styles.flex} numberOfLines={1}>
                      {campaign.title}
                    </Text>
                    <CampaignStatusTag status={campaign.status} />
                  </View>
                  <Text variant="caption" style={styles.muted}>
                    {describeDeadline(campaign.deadline)}
                  </Text>
                </Surface>
              ))
            )}

            <Button onPress={() => router.push('/(merchant)/campaigns/new')}>
              Create a campaign
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function createStyles(c: SemanticColors) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    body: { padding: space.lg, gap: space.sm },
    skeleton: { height: 110 },
    hero: { padding: space.md, gap: space.xxs },
    callout: { padding: space.md, gap: space.sm, backgroundColor: c.warningSoft },
    card: { padding: space.md, gap: space.xxs },
    row: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    flex: { flex: 1 },
    muted: { color: c.inkMuted },
  };
}
