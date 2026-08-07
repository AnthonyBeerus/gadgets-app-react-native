import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { NuviaText } from '../../../components/atoms/nuvia-text';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useMySubmissions, useRewardVouchers } from '../api/submissions';
import type { ChallengeSubmission } from '../types/challenge';

const STATUS_COLOR: Record<ChallengeSubmission['status'], string> = {
  pending: NEO_THEME.colors.warning,
  approved: NEO_THEME.colors.success,
  rejected: NEO_THEME.colors.error,
};

export default function ChallengesMyEntriesScreen() {
  const router = useRouter();
  const submissions = useMySubmissions();
  const vouchers = useRewardVouchers();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={NEO_THEME.colors.black} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <NuviaText variant="display">ACTIVITY</NuviaText>
          <NuviaText variant="body">TikTok submissions, decisions, and merchant vouchers.</NuviaText>
        </View>
      </View>

      <NuviaText variant="h2">VOUCHERS</NuviaText>
      {vouchers.isLoading ? <ActivityIndicator color={NEO_THEME.colors.primary} /> : vouchers.data?.length ? vouchers.data.map((voucher: any) => (
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
      {submissions.isLoading ? <ActivityIndicator color={NEO_THEME.colors.primary} /> : submissions.data?.length ? submissions.data.map(submission => (
        <View key={submission.id} style={styles.entryCard}>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[submission.status] }]}>
            <NuviaText variant="caption">{submission.status.toUpperCase()}</NuviaText>
          </View>
          <NuviaText variant="bodyBold" numberOfLines={2}>{submission.post_description || 'External TikTok post'}</NuviaText>
          <NuviaText variant="caption">{submission.verification_status.replaceAll('_', ' ').toUpperCase()}</NuviaText>
          {submission.rejection_reason && <NuviaText variant="body">{submission.rejection_reason}</NuviaText>}
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(submission.public_share_url)} style={styles.openButton}>
            <Ionicons name="logo-tiktok" size={17} color={NEO_THEME.colors.white} />
            <NuviaText variant="caption" color={NEO_THEME.colors.white}>OPEN ON TIKTOK</NuviaText>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEO_THEME.colors.background },
  content: { gap: 16, padding: 16, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  backButton: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 14, backgroundColor: NEO_THEME.colors.white },
  voucherCard: { gap: 9, borderWidth: 3, borderColor: NEO_THEME.colors.black, borderRadius: 18, backgroundColor: NEO_THEME.colors.secondary, padding: 16, boxShadow: '5px 5px 0px #000000' },
  codeBox: { alignSelf: 'flex-start', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 10, backgroundColor: NEO_THEME.colors.white, paddingHorizontal: 14, paddingVertical: 8 },
  entryCard: { gap: 9, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, backgroundColor: NEO_THEME.colors.white, padding: 15, boxShadow: '4px 4px 0px #000000' },
  statusBadge: { alignSelf: 'flex-start', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  openButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, backgroundColor: NEO_THEME.colors.black, paddingHorizontal: 13, paddingVertical: 9 },
  empty: { alignItems: 'center', gap: 10, borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 16, backgroundColor: NEO_THEME.colors.white, padding: 22 },
  discoverButton: { minHeight: 46, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: NEO_THEME.colors.black, borderRadius: 999, backgroundColor: NEO_THEME.colors.secondary },
});
