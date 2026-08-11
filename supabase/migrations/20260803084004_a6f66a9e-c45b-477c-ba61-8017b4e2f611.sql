-- profiles: onboarding flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false;

-- user_preferences
CREATE TABLE public.user_preferences (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  focus_areas text[] NOT NULL DEFAULT ARRAY[]::text[],
  tone text NOT NULL DEFAULT 'gentle',
  text_size text NOT NULL DEFAULT 'default',
  reduced_motion boolean NOT NULL DEFAULT false,
  high_contrast boolean NOT NULL DEFAULT false,
  haptics_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own preferences" ON public.user_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- daily_checkins
CREATE TABLE public.daily_checkins (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  mood smallint,
  energy smallint,
  action_status text NOT NULL DEFAULT 'pending',
  ritual_seconds integer NOT NULL DEFAULT 0,
  affirmation_day integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_checkins TO authenticated;
GRANT ALL ON public.daily_checkins TO service_role;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own check-ins" ON public.daily_checkins
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER daily_checkins_updated_at BEFORE UPDATE ON public.daily_checkins
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX daily_checkins_user_date_idx ON public.daily_checkins (user_id, entry_date DESC);

-- gratitude_entries
CREATE TABLE public.gratitude_entries (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  position smallint NOT NULL DEFAULT 1,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date, position)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gratitude_entries TO authenticated;
GRANT ALL ON public.gratitude_entries TO service_role;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own gratitude entries" ON public.gratitude_entries
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER gratitude_entries_updated_at BEFORE UPDATE ON public.gratitude_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- journal_entries
CREATE TABLE public.journal_entries (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  mood_tag text,
  affirmation_day integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
GRANT ALL ON public.journal_entries TO service_role;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own journal entries" ON public.journal_entries
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX journal_entries_user_date_idx ON public.journal_entries (user_id, entry_date DESC);

-- custom_affirmations
CREATE TABLE public.custom_affirmations (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'Positive Energy',
  affirmation text NOT NULL,
  reflection text NOT NULL DEFAULT '',
  action text NOT NULL DEFAULT '',
  in_rotation boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_affirmations TO authenticated;
GRANT ALL ON public.custom_affirmations TO service_role;
ALTER TABLE public.custom_affirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own custom affirmations" ON public.custom_affirmations
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER custom_affirmations_updated_at BEFORE UPDATE ON public.custom_affirmations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- path_progress
CREATE TABLE public.path_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step smallint NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, step)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.path_progress TO authenticated;
GRANT ALL ON public.path_progress TO service_role;
ALTER TABLE public.path_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own path progress" ON public.path_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- growth_events
CREATE TABLE public.growth_events (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  points smallint NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.growth_events TO authenticated;
GRANT ALL ON public.growth_events TO service_role;
ALTER TABLE public.growth_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own growth events" ON public.growth_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add their own growth events" ON public.growth_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX growth_events_user_idx ON public.growth_events (user_id, created_at DESC);