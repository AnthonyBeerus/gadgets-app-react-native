import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

import {
  Button,
  EmptyState,
  ErrorNotice,
  Money,
  ScreenHeader,
  Skeleton,
  Surface,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { useAuth } from '../../../shared/providers/auth-provider';
import { useMerchantCampaigns, type Campaign } from '../api/campaigns';
import { CampaignStatusTag, describeDeadline } from '../components/StatusTag';

export default function CampaignListScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { merchantShopId } = useAuth();
  const { data: campaigns, isLoading, error, refetch, isRefetching } = useMerchantCampaigns();

  if (merchantShopId == null) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Campaigns" />
        <EmptyState
          title="Open a shop first"
          rule="Campaigns are funded and reviewed by a business, so you need a shop before you can launch one."
          actionLabel="Open a shop"
          onAction={() => router.push('/open-shop')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Campaigns" />

      {error ? (
        <View style={styles.padded}>
          <ErrorNotice
            title="Could not load your campaigns"
            impact="We could not reach Muse just now."
            recovery="Pull to refresh, or try again in a moment."
          />
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.padded}>
          <Skeleton style={styles.skeleton} />
          <Skeleton style={styles.skeleton} />
          <Skeleton style={styles.skeleton} />
        </View>
      ) : (
        <FlashList
          data={campaigns ?? []}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <EmptyState
              title="No campaigns yet"
              rule="Launch a campaign to brief creators, fund a prize, and collect content you can reuse."
              actionLabel="Create a campaign"
              onAction={() => router.push('/(merchant)/campaigns/new')}
            />
          }
          renderItem={({ item }) => <CampaignRow campaign={item} />}
        />
      )}

      <View style={styles.footer}>
        <Button onPress={() => router.push('/(merchant)/campaigns/new')}>Create a campaign</Button>
      </View>
    </SafeAreaView>
  );
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/(merchant)/campaigns/${campaign.id}`)}
    >
      <Surface style={styles.card}>
        <View style={styles.cardTop}>
          <Text variant="h2" style={styles.cardTitle} numberOfLines={2}>
            {campaign.title}
          </Text>
          <CampaignStatusTag status={campaign.status} />
        </View>

        <View style={styles.cardMeta}>
          {campaign.pot_value != null ? (
            <Money amount={campaign.pot_value} format="charge" emphasis="body" />
          ) : null}
          <Text variant="caption" style={styles.muted}>
            {campaign.status === 'settled'
              ? 'Prizes paid'
              : describeDeadline(campaign.deadline)}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
}

function createStyles(c: SemanticColors) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    padded: { padding: space.lg, gap: space.sm },
    skeleton: { height: 88 },
    list: { padding: space.lg, gap: space.sm },
    card: { padding: space.md, gap: space.sm },
    cardTop: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: space.sm },
    cardTitle: { flex: 1 },
    cardMeta: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.sm },
    muted: { color: c.inkMuted },
    footer: { padding: space.lg },
  };
}
