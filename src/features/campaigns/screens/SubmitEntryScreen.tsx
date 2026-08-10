import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AssetUploadField } from '../../../shared/components/media/AssetUploadField';
import {
  Button,
  Input,
  PinnedActionBar,
  Rule,
  StackScreenTemplate,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { useCampaign } from '../api/campaigns';
import { useMyEntry, useSubmitEntry } from '../api/submissions';
import { USAGE_RIGHTS } from '../domain/campaign-schema';
import { useSubmissionUpload } from '../media/useAssetUpload';

export default function SubmitEntryScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaignId = Number(id);

  const { data: campaign } = useCampaign(campaignId);
  const { data: entry } = useMyEntry(campaignId);
  const submit = useSubmitEntry();

  const [caption, setCaption] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useSubmissionUpload({
    challengeId: campaignId,
    rules: {
      contentFormat: campaign?.content_format ?? 'either',
      videoMinSeconds: campaign?.video_min_seconds ?? null,
      videoMaxSeconds: campaign?.video_max_seconds ?? null,
    },
    maxAssets: campaign?.deliverable_count ?? 1,
  });

  const rights = USAGE_RIGHTS.find(r => r.value === campaign?.usage_rights);
  const required = campaign?.deliverable_count ?? 1;
  const ready = upload.assets.length >= required && consented && !upload.isUploading;
  const isRevision = entry?.status === 'revision_requested';

  const onSubmit = async () => {
    setError(null);
    try {
      await submit.mutateAsync({
        challengeId: campaignId,
        assets: upload.assets,
        caption: caption.trim() || undefined,
        publicShareUrl: shareUrl.trim() || undefined,
      });
      router.replace('/(shop)/entries');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit your entry');
    }
  };

  return (
    <StackScreenTemplate
      title={isRevision ? 'Resubmit your entry' : 'Submit your content'}
      fallbackHref={`/opportunity/${campaignId}`}
      footer={
        <PinnedActionBar>
          <Button
            onPress={onSubmit}
            loading={submit.isPending}
            disabled={!ready}
            disabledReason={
              upload.assets.length < required
                ? `Add ${required} file${required === 1 ? '' : 's'} to submit`
                : 'Agree to the content rights to submit'
            }
          >
            {isRevision ? 'Resubmit' : 'Submit entry'}
          </Button>
        </PinnedActionBar>
      }
    >
      {isRevision && entry?.merchant_note ? (
        <View style={styles.callout}>
          <Text variant="label">Changes requested</Text>
          <Text variant="body">{entry.merchant_note}</Text>
        </View>
      ) : null}

      <Text variant="body">
        {campaign?.content_format === 'photo'
          ? 'Upload your photos.'
          : campaign?.content_format === 'video'
            ? 'Upload your video.'
            : 'Upload your video or photos.'}{' '}
        {campaign?.video_max_seconds
          ? `Keep video between ${campaign.video_min_seconds ?? 0}s and ${campaign.video_max_seconds}s.`
          : null}
      </Text>

      <AssetUploadField
        title={`Add your ${required > 1 ? `${required} files` : 'file'}`}
        hint="Muse hosts your content so the business can review it."
        assets={upload.assets}
        progress={upload.progress}
        isUploading={upload.isUploading}
        error={upload.error}
        maxAssets={required}
        onPick={upload.pick}
        onCapture={upload.capture}
        onRemove={upload.remove}
      />

      <Rule />

      <Input
        label="Caption (optional)"
        placeholder="Anything the business should know"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <Input
        label="Already posted it? (optional)"
        placeholder="https://tiktok.com/@you/video/…"
        value={shareUrl}
        onChangeText={setShareUrl}
        autoCapitalize="none"
        keyboardType="url"
      />

      <Rule />

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consented }}
        onPress={() => setConsented(!consented)}
        style={styles.consent}
      >
        <Text variant="body">{consented ? '☑' : '☐'}</Text>
        <Text variant="caption" style={styles.consentText}>
          I made this content and I grant {campaign?.brand_name ?? 'this business'}{' '}
          {rights ? rights.label.toLowerCase() : 'the stated usage rights'}.
          {rights?.detail ? ` ${rights.detail}` : ''}
        </Text>
      </Pressable>

      {error ? (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </StackScreenTemplate>
  );
}

function createStyles(c: SemanticColors) {
  return {
    callout: { padding: space.md, backgroundColor: c.warningSoft, gap: space.xxs },
    consent: { flexDirection: 'row' as const, gap: space.xs, alignItems: 'flex-start' as const },
    consentText: { flex: 1, color: c.inkMuted },
    error: { color: c.danger },
  };
}
