-- challenges had RLS disabled while exposing policies (security advisor ERROR).
-- Enable RLS and add an explicit public read policy so shoppers can still browse,
-- while write access remains limited to the existing shop-owner policy.
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view challenges" ON public.challenges;
CREATE POLICY "Anyone can view challenges" ON public.challenges
  FOR SELECT TO authenticated, anon
  USING (true);
