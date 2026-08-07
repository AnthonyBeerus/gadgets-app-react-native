import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';
import { useMySubmissions, useRewardVouchers } from '../api/submissions';
import type { ChallengeSubmission } from '../types/challenge';

const STATUS_COLOR: Record<ChallengeSubmission['status'], string> = {
  pending: theme.colors.warning,
  approved: theme.colors.success,
  rejected: theme.colors.error,
};

export default function ChallengesMyEntriesScreen() {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const router = useRouter();
  const submissions = useMySubmissions();
  const vouchers = useRewardVouchers();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={theme.colors.black} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <NuviaText variant="display">ACTIVITY</NuviaText>
          <NuviaText variant="body">TikTok submissions, decisions, and merchant vouchers.</NuviaText>
        </View>
      </View>

      <NuviaText variant="h2">VOUCHERS</NuviaText>
      {vouchers.isLoading ? <ActivityIndicator color={theme.colors.primary} /> : vouchers.data?.length ? vouchers.data.map((voucher: any) => (
        <View key={voucher.id} style={styles.voucherCard}>
          <View>
            <NuviaText variant="caption">MERCHANT VOUCHER</NuviaText>
            <NuviaText variant="h1">P{Number(voucher.value).toFixed(2)}</NuviaText>
          </View>
          <View style={styles.codeBox}><NuviaText variant="h3" selectable>{voucher.code}</NuviaText></View>
          <NuviaText variant="caption">{voucher.redeemed_at ? 'REDEEMED' : `VALID UNTIL ${new Date(voucher.expires_at).toLocaleDateString()}`}</NuviaText>
        </View>
      )) : <View style={styles.empty}><NuviaText variant="body">Approved creator posts will issue vouchers here.</NuviaText></View>}

      <NuviaText variant="h2">CREATOR POSTS</NuviaText>
      {submissions.isLoading ? <ActivityIndicator color={theme.colors.primary} /> : submissions.data?.length ? submissions.data.map(submission => (
        <View key={submission.id} style={styles.entryCard}>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[submission.status] }]}>
            <NuviaText variant="caption">{submission.status.toUpperCase()}</NuviaText>
          </View>
          <NuviaText variant="bodyBold" numberOfLines={2}>{submission.post_description || 'External TikTok post'}</NuviaText>
          <NuviaText variant="caption">{submission.verification_status.replaceAll('_', ' ').toUpperCase()}</NuviaText>
          {submission.rejection_reason && <NuviaText variant="body">{submission.rejection_reason}</NuviaText>}
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(submission.public_share_url)} style={styles.openButton}>
            <Ionicons name="logo-tiktok" size={17} color={theme.colors.white} />
            <NuviaText variant="caption" color={theme.colors.white}>OPEN ON TIKTOK</NuviaText>
          </Pressable>
        </View>
      )) : (
        <View style={styles.empty}>
          <NuviaText variant="h3">NO POSTS YET</NuviaText>
          <NuviaText variant="body" align="center">Purchase a sponsored product, then submit your external TikTok post.</NuviaText>
          <Pressable onPress={() => router.replace('/(shop)')} style={styles.discoverButton}><NuviaText variant="bodyBold">DISCOVER OPPORTUNITIES</NuviaText></Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(c) {
  return {
  container: { flex: 1, backgroundColor: c.background },
  content: { gap: 16, padding: 16, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  backButton: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.border, borderRadius: 14, backgroundColor: c.white },
  voucherCard: { gap: 9, borderWidth: 1, borderColor: c.border, borderRadius: 18, backgroundColor: c.secondary, padding: 16, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
  codeBox: { alignSelf: 'flex-start', borderWidth: 1, borderColor: c.border, borderRadius: 10, backgroundColor: c.white, paddingHorizontal: 14, paddingVertical: 8 },
  entryCard: { gap: 9, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.white, padding: 15, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' },
  statusBadge: { alignSelf: 'flex-start', borderWidth: 1, borderColor: c.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  openButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, backgroundColor: c.black, paddingHorizontal: 13, paddingVertical: 9 },
  empty: { alignItems: 'center', gap: 10, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.white, padding: 22 },
  discoverButton: { minHeight: 46, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.border, borderRadius: 999, backgroundColor: c.secondary },
  };
}
