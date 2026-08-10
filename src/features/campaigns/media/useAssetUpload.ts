import { randomUUID } from 'expo-crypto';
import { useCallback, useState } from 'react';

import { uploadToBucket } from '../../../shared/lib/storage';
import { useAuth } from '../../../shared/providers/auth-provider';
import {
  CAMPAIGN_ASSET_BUCKET,
  SUBMISSION_BUCKET,
  extensionFor,
  validateAsset,
  validateCampaignAsset,
  type AssetRules,
  type ContentFormat,
  type PickedAsset,
} from './constraints';
import { captureWithCamera, pickFromLibrary, type PickOutcome } from './pick-media';

export type UploadedAsset = {
  path: string;
  mimeType: string;
  bytes?: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  /** Local URI, kept so the UI can preview without a signing round trip. */
  localUri: string;
};

export type AssetUploadState = {
  assets: UploadedAsset[];
  progress: number;
  isUploading: boolean;
  error: string | null;
};

type SubmissionUploadOptions = {
  challengeId: number;
  rules: AssetRules;
  maxAssets: number;
};

/**
 * Pick -> validate -> stream to storage, for creator submissions.
 *
 * Paths are `{challengeId}/{profileId}/{uuid}.{ext}`, which is what the storage
 * policies key on: the creator may only write under their own profile segment, and
 * the reviewing merchant is resolved from the challenge segment.
 */
export function useSubmissionUpload({ challengeId, rules, maxAssets }: SubmissionUploadOptions) {
  const { user } = useAuth();
  const [state, setState] = useState<AssetUploadState>({
    assets: [],
    progress: 0,
    isUploading: false,
    error: null,
  });

  const uploadPicked = useCallback(
    async (picked: PickedAsset[]) => {
      if (!user?.id) {
        setState(prev => ({ ...prev, error: 'Sign in to upload content.' }));
        return;
      }

      const room = maxAssets - state.assets.length;
      if (room <= 0) {
        setState(prev => ({ ...prev, error: `This campaign takes at most ${maxAssets} file(s).` }));
        return;
      }

      const accepted: PickedAsset[] = [];
      for (const asset of picked.slice(0, room)) {
        const check = validateAsset(asset, rules);
        if (!check.ok) {
          setState(prev => ({ ...prev, error: check.reason }));
          return;
        }
        accepted.push(asset);
      }

      setState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));

      try {
        const uploaded: UploadedAsset[] = [];
        for (const [index, asset] of accepted.entries()) {
          const path = `${challengeId}/${user.id}/${randomUUID()}.${extensionFor(asset.mimeType, asset.fileName)}`;
          await uploadToBucket({
            bucket: SUBMISSION_BUCKET,
            path,
            uri: asset.uri,
            mimeType: asset.mimeType,
            onProgress: ({ fraction }) =>
              setState(prev => ({ ...prev, progress: (index + fraction) / accepted.length })),
          });
          uploaded.push({
            path,
            mimeType: asset.mimeType,
            bytes: asset.fileSize,
            durationSeconds: asset.durationSeconds,
            width: asset.width,
            height: asset.height,
            localUri: asset.uri,
          });
        }

        setState(prev => ({
          assets: [...prev.assets, ...uploaded],
          progress: 1,
          isUploading: false,
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Upload failed. Try again.',
        }));
      }
    },
    [challengeId, maxAssets, rules, state.assets.length, user?.id],
  );

  const handleOutcome = useCallback(
    async (outcome: PickOutcome) => {
      if (outcome.status === 'cancelled') return;
      if (outcome.status === 'denied') {
        setState(prev => ({ ...prev, error: outcome.reason }));
        return;
      }
      await uploadPicked(outcome.assets);
    },
    [uploadPicked],
  );

  const pick = useCallback(async () => {
    const outcome = await pickFromLibrary({
      format: rules.contentFormat,
      selectionLimit: maxAssets - state.assets.length,
      videoMaxSeconds: rules.videoMaxSeconds,
    });
    await handleOutcome(outcome);
  }, [handleOutcome, maxAssets, rules.contentFormat, rules.videoMaxSeconds, state.assets.length]);

  const capture = useCallback(async () => {
    const outcome = await captureWithCamera({
      format: rules.contentFormat,
      videoMaxSeconds: rules.videoMaxSeconds,
    });
    await handleOutcome(outcome);
  }, [handleOutcome, rules.contentFormat, rules.videoMaxSeconds]);

  // The object is left in the bucket -- a creator removing a file from a draft is
  // common, and the storage lifecycle sweeps unreferenced paths.
  const remove = useCallback((path: string) => {
    setState(prev => ({ ...prev, assets: prev.assets.filter(a => a.path !== path), error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ assets: [], progress: 0, isUploading: false, error: null });
  }, []);

  return { ...state, pick, capture, remove, reset };
}

type CampaignAssetUploadOptions = { shopId: number; challengeId: number | 'draft' };

/** Merchant-side brand asset upload into the public `campaign-assets` bucket. */
export function useCampaignAssetUpload({ shopId, challengeId }: CampaignAssetUploadOptions) {
  const [state, setState] = useState<AssetUploadState>({
    assets: [],
    progress: 0,
    isUploading: false,
    error: null,
  });

  const pick = useCallback(async () => {
    const outcome = await pickFromLibrary({ format: 'either' as ContentFormat, selectionLimit: 5 });
    if (outcome.status === 'cancelled') return;
    if (outcome.status === 'denied') {
      setState(prev => ({ ...prev, error: outcome.reason }));
      return;
    }

    for (const asset of outcome.assets) {
      const check = validateCampaignAsset(asset);
      if (!check.ok) {
        setState(prev => ({ ...prev, error: check.reason }));
        return;
      }
    }

    setState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));
    try {
      const uploaded: UploadedAsset[] = [];
      for (const [index, asset] of outcome.assets.entries()) {
        const path = `${shopId}/${challengeId}/${randomUUID()}.${extensionFor(asset.mimeType, asset.fileName)}`;
        await uploadToBucket({
          bucket: CAMPAIGN_ASSET_BUCKET,
          path,
          uri: asset.uri,
          mimeType: asset.mimeType,
          onProgress: ({ fraction }) =>
            setState(prev => ({ ...prev, progress: (index + fraction) / outcome.assets.length })),
        });
        uploaded.push({
          path,
          mimeType: asset.mimeType,
          bytes: asset.fileSize,
          width: asset.width,
          height: asset.height,
          localUri: asset.uri,
        });
      }
      setState(prev => ({
        assets: [...prev.assets, ...uploaded],
        progress: 1,
        isUploading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed. Try again.',
      }));
    }
  }, [challengeId, shopId]);

  const remove = useCallback((path: string) => {
    setState(prev => ({ ...prev, assets: prev.assets.filter(a => a.path !== path), error: null }));
  }, []);

  const setInitial = useCallback((assets: UploadedAsset[]) => {
    setState({ assets, progress: 0, isUploading: false, error: null });
  }, []);

  return { ...state, pick, remove, setInitial };
}
