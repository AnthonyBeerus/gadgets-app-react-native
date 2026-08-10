import { useQuery } from '@tanstack/react-query';

import { createSignedReadUrl, publicUrl } from '../../../shared/lib/storage';
import { CAMPAIGN_ASSET_BUCKET, SUBMISSION_BUCKET } from '../media/constraints';

const SIGNED_URL_TTL_SECONDS = 3600;
// Refetch a little before the URL actually dies so a merchant scrubbing through a long
// review session never hits a dead link mid-playback.
const STALE_TIME_MS = 50 * 60 * 1000;

export const signedUrlKeys = {
  submission: (path: string) => ['signed-url', SUBMISSION_BUCKET, path] as const,
};

/** Submission media lives in a private bucket, so every read needs a signed URL. */
export function useSignedSubmissionUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: signedUrlKeys.submission(path ?? ''),
    queryFn: () => createSignedReadUrl(SUBMISSION_BUCKET, path!, SIGNED_URL_TTL_SECONDS),
    enabled: Boolean(path),
    staleTime: STALE_TIME_MS,
    gcTime: STALE_TIME_MS,
    retry: 1,
  });
}

/** Brand assets are public, so this is a pure string build with no network call. */
export function campaignAssetUrl(path: string): string {
  return publicUrl(CAMPAIGN_ASSET_BUCKET, path);
}

export function campaignAssetUrls(paths: readonly string[] | null | undefined): string[] {
  return (paths ?? []).map(campaignAssetUrl);
}
