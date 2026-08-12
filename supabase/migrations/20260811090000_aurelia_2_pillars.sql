-- Aurelia 2.0 additive metadata. Existing rows remain valid and all new fields are nullable.

alter table if exists public.user_preferences
  add column if not exists preferred_pillars text[],
  add column if not exists current_intention text;

alter table if exists public.custom_affirmations
  add column if not exists pillar text,
  add column if not exists tags text[];

alter table if exists public.journal_entries
  add column if not exists pillar text;

alter table if exists public.daily_checkins
  add column if not exists selected_pillar text;

alter table if exists public.growth_events
  add column if not exists pillar text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'custom_affirmations_aurelia_pillar_check') then
    alter table public.custom_affirmations add constraint custom_affirmations_aurelia_pillar_check check (pillar is null or pillar in ('rooted','eternal','growth','light'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'journal_entries_aurelia_pillar_check') then
    alter table public.journal_entries add constraint journal_entries_aurelia_pillar_check check (pillar is null or pillar in ('rooted','eternal','growth','light'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'daily_checkins_aurelia_pillar_check') then
    alter table public.daily_checkins add constraint daily_checkins_aurelia_pillar_check check (selected_pillar is null or selected_pillar in ('rooted','eternal','growth','light'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'growth_events_aurelia_pillar_check') then
    alter table public.growth_events add constraint growth_events_aurelia_pillar_check check (pillar is null or pillar in ('rooted','eternal','growth','light'));
  end if;
end $$;
