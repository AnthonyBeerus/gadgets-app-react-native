import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../shared/lib/supabase';
import { ChallengeSubmission } from '../types/challenge';

const BUCKET = 'challenge-submissions';

// Uploads picked media to Supabase Storage and returns its public URL.
// Mirrors the FormData pattern used by uploadProductImage in shared/api/api.ts.
export async function uploadSubmissionMedia(
  uri: string,
  mediaType: 'image' | 'video'
): Promise<string> {
  const ext = mediaType === 'video' ? 'mp4' : 'jpg';
  const contentType = mediaType === 'video' ? 'video/mp4' : 'image/jpeg';
  const filename = `submission-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  const formData = new FormData();
  // @ts-ignore - React Native FormData expects this file object shape
  formData.append('file', { uri, name: filename, type: contentType });

  const { error } = await supabase.storage.from(BUCKET).upload(filename, formData, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    throw new Error('Media upload failed: ' + error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return publicUrl;
}

interface CreateSubmissionInput {
  challengeId: number;
  uri: string;
  mediaType: 'image' | 'video';
  caption?: string;
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, uri, mediaType, caption }: CreateSubmissionInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to submit an entry.');
      }

      const contentUrl = await uploadSubmissionMedia(uri, mediaType);

      const { data, error } = await supabase
        .from('challenge_submissions')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          content_url: contentUrl,
          media_type: mediaType,
          caption: caption?.trim() ? caption.trim() : null,
        })
        .select()
        .single();
      if (error) {
        throw new Error('Failed to save submission: ' + error.message);
      }

      return data as ChallengeSubmission;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challengeSubmissions', variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [] as ChallengeSubmission[];

      const { data, error } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;

      return (data ?? []) as ChallengeSubmission[];
    },
  });
}

export function useChallengeSubmissions(challengeId: number) {
  return useQuery({
    queryKey: ['challengeSubmissions', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select('*')
        .eq('challenge_id', challengeId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;

      return (data ?? []) as ChallengeSubmission[];
    },
    enabled: !!challengeId,
  });
}
