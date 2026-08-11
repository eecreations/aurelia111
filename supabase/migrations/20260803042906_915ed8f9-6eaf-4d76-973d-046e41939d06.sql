CREATE TABLE public.voice_affirmations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'My affirmation',
  storage_path text NOT NULL,
  duration_seconds numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.voice_affirmations TO authenticated;
GRANT ALL ON public.voice_affirmations TO service_role;

ALTER TABLE public.voice_affirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own voice affirmations"
ON public.voice_affirmations FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER voice_affirmations_set_updated_at
BEFORE UPDATE ON public.voice_affirmations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();