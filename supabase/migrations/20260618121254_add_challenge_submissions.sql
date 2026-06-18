BEGIN;

-- User-generated challenge submissions (authentic UGC). Media lives in the
-- 'challenge-submissions' storage bucket; rows reference it via content_url.
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  challenge_id BIGINT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id
  ON public.challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_id
  ON public.challenge_submissions(user_id);

ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.challenge_submissions;
CREATE POLICY "Users can insert their own submissions" ON public.challenge_submissions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Anyone authenticated can see approved submissions (leaderboard/feed); users always see their own.
DROP POLICY IF EXISTS "Users can view approved or own submissions" ON public.challenge_submissions;
CREATE POLICY "Users can view approved or own submissions" ON public.challenge_submissions
  FOR SELECT TO authenticated
  USING (status = 'approved' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own submissions" ON public.challenge_submissions;
CREATE POLICY "Users can update their own submissions" ON public.challenge_submissions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own submissions" ON public.challenge_submissions;
CREATE POLICY "Users can delete their own submissions" ON public.challenge_submissions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Public storage bucket for submission media.
INSERT INTO storage.buckets (id, name, public)
VALUES ('challenge-submissions', 'challenge-submissions', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read challenge submission media" ON storage.objects;
CREATE POLICY "Public read challenge submission media" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'challenge-submissions');

DROP POLICY IF EXISTS "Authenticated upload challenge submission media" ON storage.objects;
CREATE POLICY "Authenticated upload challenge submission media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'challenge-submissions');

COMMIT;
