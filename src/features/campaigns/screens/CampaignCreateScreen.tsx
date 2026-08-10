import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import {
  Button,
  Input,
  Money,
  PinnedActionBar,
  Rule,
  StackScreenTemplate,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';
import { AssetUploadField } from '../../../shared/components/media/AssetUploadField';
import { useAuth } from '../../../shared/providers/auth-provider';
import { usePublishCampaign, useSaveCampaignDraft } from '../api/campaigns';
import { campaignAssetUrl } from '../api/signed-urls';
import { BulletListField } from '../components/BulletListField';
import { OptionPicker } from '../components/OptionPicker';
import {
  CAMPAIGN_GOALS,
  CAMPAIGN_WIZARD_STEPS,
  CONTENT_FORMATS,
  USAGE_RIGHTS,
  emptyCampaignForm,
  type CampaignFormValues,
} from '../domain/campaign-schema';
import { allocateToWinners } from '../domain/winner-selection';
import { useCampaignAssetUpload } from '../media/useAssetUpload';

export default function CampaignCreateScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { merchantShopId } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<CampaignFormValues>(emptyCampaignForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftId, setDraftId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const saveDraft = useSaveCampaignDraft();
  const publish = usePublishCampaign();
  const assetUpload = useCampaignAssetUpload({
    shopId: merchantShopId ?? 0,
    challengeId: draftId ?? 'draft',
  });

  const step = CAMPAIGN_WIZARD_STEPS[stepIndex];
  const isLastStep = stepIndex === CAMPAIGN_WIZARD_STEPS.length - 1;

  const set = <K extends keyof CampaignFormValues>(key: K, value: CampaignFormValues[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key as string]: '' }));
  };

  // Brand asset paths live in the upload hook until the step is committed.
  const valuesWithAssets = useMemo(
    () => ({ ...values, brandAssetPaths: assetUpload.assets.map(a => a.path) }),
    [assetUpload.assets, values],
  );

  const validateStep = (): boolean => {
    const result = step.schema.safeParse(valuesWithAssets);
    if (result.success) {
      setErrors({});
      return true;
    }
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  };

  const persist = async (): Promise<number | null> => {
    try {
      const saved = await saveDraft.mutateAsync({ id: draftId, values: valuesWithAssets });
      setDraftId(saved.id);
      return saved.id;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save your draft');
      return null;
    }
  };

  const onNext = async () => {
    setSubmitError(null);
    if (!validateStep()) return;
    setValues(valuesWithAssets);

    // Save on every step so a merchant who drops out mid-wizard keeps their work.
    const id = await persist();
    if (id == null) return;

    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }

    try {
      await publish.mutateAsync(id);
      router.replace(`/(merchant)/campaigns/${id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not publish this campaign');
    }
  };

  const prizePreview = useMemo(() => {
    if (!values.potValue || values.potValue <= 0) return [];
    try {
      return allocateToWinners([1, 2, 3, 4, 5], values.potValue, null);
    } catch {
      return [];
    }
  }, [values.potValue]);

  const busy = saveDraft.isPending || publish.isPending;

  return (
    <StackScreenTemplate
      title="New campaign"
      fallbackHref="/(merchant)/campaigns"
      step={{ current: stepIndex + 1, total: CAMPAIGN_WIZARD_STEPS.length }}
      footer={
        <PinnedActionBar>
          <View style={styles.actions}>
            {stepIndex > 0 ? (
              <Button
                variant="outline"
                onPress={() => setStepIndex(stepIndex - 1)}
                style={styles.action}
              >
                Back
              </Button>
            ) : null}
            <Button onPress={onNext} loading={busy} style={styles.action}>
              {isLastStep ? 'Publish campaign' : 'Continue'}
            </Button>
          </View>
        </PinnedActionBar>
      }
    >
      <Text variant="h1">{step.title}</Text>

      {step.key === 'basics' ? (
        <>
          <Input
            label="Campaign title"
            placeholder="Weekend braai content"
            value={values.title}
            onChangeText={t => set('title', t)}
            error={errors.title}
          />
          <Input
            label="The brief"
            placeholder="Tell creators what you want them to make, and why."
            value={values.description}
            onChangeText={t => set('description', t)}
            error={errors.description}
            multiline
            numberOfLines={6}
            inputStyle={styles.multiline}
          />
          <OptionPicker
            label="What is this campaign for?"
            options={CAMPAIGN_GOALS}
            value={values.campaignGoal}
            onChange={v => set('campaignGoal', v)}
            error={errors.campaignGoal}
          />
        </>
      ) : null}

      {step.key === 'brief' ? (
        <>
          <OptionPicker
            label="What should creators make?"
            options={CONTENT_FORMATS}
            value={values.contentFormat}
            onChange={v => set('contentFormat', v)}
          />
          <Input
            label="How many files per entry?"
            keyboardType="number-pad"
            value={String(values.deliverableCount)}
            onChangeText={t => set('deliverableCount', Number(t) || 1)}
            error={errors.deliverableCount}
          />
          {values.contentFormat !== 'photo' ? (
            <View style={styles.row}>
              <Input
                label="Min length (s)"
                keyboardType="number-pad"
                value={values.videoMinSeconds ? String(values.videoMinSeconds) : ''}
                onChangeText={t => set('videoMinSeconds', t ? Number(t) : null)}
                error={errors.videoMinSeconds}
                containerStyle={styles.half}
              />
              <Input
                label="Max length (s)"
                keyboardType="number-pad"
                value={values.videoMaxSeconds ? String(values.videoMaxSeconds) : ''}
                onChangeText={t => set('videoMaxSeconds', t ? Number(t) : null)}
                error={errors.videoMaxSeconds}
                containerStyle={styles.half}
              />
            </View>
          ) : null}

          <Rule />
          <BulletListField
            label="Talking points"
            hint="What should the creator actually say or show?"
            placeholder="Mention the P65 lunch special"
            values={values.talkingPoints}
            onChange={v => set('talkingPoints', v)}
          />
          <BulletListField
            label="Do"
            placeholder="Film in natural light"
            values={values.dos}
            onChange={v => set('dos', v)}
          />
          <BulletListField
            label="Don't"
            placeholder="No competitor branding on screen"
            values={values.donts}
            onChange={v => set('donts', v)}
          />
        </>
      ) : null}

      {step.key === 'assets' ? (
        <>
          <Text variant="body">
            Give creators your logo, product shots or a reference video. Campaigns with real
            reference material get usable content back far more often.
          </Text>
          <AssetUploadField
            title="Add brand assets"
            hint="Logos, product photos, reference clips or a PDF brand guide."
            assets={assetUpload.assets}
            progress={assetUpload.progress}
            isUploading={assetUpload.isUploading}
            error={assetUpload.error ?? errors.brandAssetPaths ?? null}
            maxAssets={10}
            onPick={assetUpload.pick}
            onRemove={assetUpload.remove}
          />
          {assetUpload.assets.length > 0 && !values.imageUrl ? (
            <Button
              variant="secondary"
              onPress={() => set('imageUrl', campaignAssetUrl(assetUpload.assets[0].path))}
            >
              Use the first asset as the cover
            </Button>
          ) : null}
          {errors.imageUrl ? (
            <Text variant="caption" style={styles.error}>
              {errors.imageUrl}
            </Text>
          ) : null}
        </>
      ) : null}

      {step.key === 'prize' ? (
        <>
          <Input
            label={`Prize pot (${values.potCurrency})`}
            keyboardType="decimal-pad"
            value={String(values.potValue)}
            onChangeText={t => set('potValue', Number(t) || 0)}
            error={errors.potValue}
          />

          <View style={styles.preview}>
            <Text variant="label">How the pot splits</Text>
            {prizePreview.map(allocation => (
              <View key={allocation.rank} style={styles.previewRow}>
                <Text variant="body">
                  {['1st', '2nd', '3rd', '4th', '5th'][allocation.rank - 1]}
                </Text>
                <Money amount={allocation.prize} format="charge" emphasis="body" />
              </View>
            ))}
            <Text variant="caption" style={styles.muted}>
              If you pick fewer than five winners, the whole pot is shared between the winners you
              choose.
            </Text>
          </View>

          <Rule />
          <Text variant="label">Deadline</Text>
          <Pressable accessibilityRole="button" onPress={() => setShowDatePicker(true)}>
            <Text variant="body" style={styles.dateValue}>
              {values.deadline.toDateString()}
            </Text>
          </Pressable>
          {errors.deadline ? (
            <Text variant="caption" style={styles.error}>
              {errors.deadline}
            </Text>
          ) : null}
          {showDatePicker ? (
            <DateTimePicker
              value={values.deadline}
              mode="date"
              minimumDate={new Date(Date.now() + 86_400_000)}
              onChange={(_event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) set('deadline', date);
              }}
            />
          ) : null}
        </>
      ) : null}

      {step.key === 'terms' ? (
        <>
          <OptionPicker
            label="What may you do with the content?"
            options={USAGE_RIGHTS}
            value={values.usageRights}
            onChange={v => set('usageRights', v)}
          />
          <Input
            label="Revisions allowed per entry"
            keyboardType="number-pad"
            value={String(values.revisionsAllowed)}
            onChangeText={t => set('revisionsAllowed', Number(t) || 0)}
            error={errors.revisionsAllowed}
          />
          <Input
            label="Review turnaround (days)"
            keyboardType="number-pad"
            value={String(values.reviewSlaDays)}
            onChangeText={t => set('reviewSlaDays', Number(t) || 5)}
            error={errors.reviewSlaDays}
          />
          <Text variant="caption" style={styles.muted}>
            Creators see this promise on the brief. Most platforms turn entries around in three to
            seven days.
          </Text>
        </>
      ) : null}

      {submitError ? (
        <Text variant="caption" style={styles.error}>
          {submitError}
        </Text>
      ) : null}
    </StackScreenTemplate>
  );
}

function createStyles(c: SemanticColors) {
  return {
    actions: { flexDirection: 'row' as const, gap: space.sm },
    action: { flex: 1 },
    row: { flexDirection: 'row' as const, gap: space.sm },
    half: { flex: 1 },
    multiline: { minHeight: 120, textAlignVertical: 'top' as const },
    preview: { gap: space.xs, padding: space.sm, backgroundColor: c.surfaceSunken },
    previewRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    dateValue: {
      borderWidth: 2,
      borderColor: c.stroke,
      backgroundColor: c.surface,
      padding: space.sm,
    },
    muted: { color: c.inkMuted },
    error: { color: c.danger },
  };
}
