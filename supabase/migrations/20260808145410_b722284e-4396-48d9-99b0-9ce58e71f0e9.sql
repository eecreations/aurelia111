ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminder_times text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS reminder_voice boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reminder_repeat integer NOT NULL DEFAULT 1;