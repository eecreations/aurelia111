ALTER TABLE public.voice_affirmations
  ADD COLUMN IF NOT EXISTS transcript text,
  ADD COLUMN IF NOT EXISTS transcript_status text NOT NULL DEFAULT 'pending';