import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AffirmationCard } from "@/components/affirmation-card";
import { BottomNav } from "@/components/bottom-nav";
import { DailyCheckin } from "@/components/daily-checkin";
import { PillarCompass } from "@/components/pillar-compass";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { affirmations } from "@/data/affirmations";
import { useAuth } from "@/hooks/useAuth";
import { useTodayKey } from "@/hooks/use-today";
import { currentJourneyDay, selectDailyEntry } from "@/lib/journey";
import { useCustomAffirmations } from "@/lib/custom-affirmations";
import { AURELIA_PILLARS, pillarForAffirmation, type AureliaPillar } from "@/lib/pillars";
import { greeting, usePreferences } from "@/lib/preferences";
import { normaliseTimes, useDailyReminder } from "@/lib/reminders";
import { useFavorites, useProfile, useToggleFavorite } from "@/lib/user-data";
import { useVoiceAffirmations } from "@/lib/voice";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Aurelia — Rooted in Eternity" },
    { name: "description", content: "A daily practice for remembering who you are, nurturing who you are becoming, and carrying more light into the world." },
    { property: "og:title", content: "Aurelia — Rooted in Eternity" },
    { property: "og:description", content: "Return to yourself. Grow with intention. Carry your light into the world." },
  ]}),
  component: TodayPage,
});

function TodayPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(user?.id);
  const { data: prefs } = usePreferences(user?.id);
  const { data: customs } = useCustomAffirmations(user?.id);
  const { data: favorites } = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const { data: recordings } = useVoiceAffirmations(user?.id);

  useTodayKey();
  const day = currentJourneyDay(profile?.journey_start);
  const defaultEntry = selectDailyEntry({ day, focusAreas: prefs?.focus_areas, customs: (customs ?? []).filter((item) => item.in_rotation) });
  const defaultPillar = pillarForAffirmation(defaultEntry);
  const [pillar, setPillar] = useState<AureliaPillar>(defaultPillar);

  useEffect(() => setPillar(defaultPillar), [day, defaultPillar]);

  const entry = useMemo(() => {
    if (pillar === defaultPillar) return defaultEntry;
    const matches = affirmations.filter((item) => pillarForAffirmation(item) === pillar);
    if (matches.length === 0) return defaultEntry;
    return matches[(day - 1) % matches.length]!;
  }, [day, defaultEntry, defaultPillar, pillar]);

  const isFavorite = (favorites ?? []).includes(entry.day);
  const selectedPillar = AURELIA_PILLARS.find((item) => item.id === pillar)!;
  const alarmTimes = normaliseTimes([...(profile?.reminder_times ?? []), profile?.reminder_time ?? null]);

  useDailyReminder({
    enabled: Boolean(profile?.reminder_enabled),
    times: alarmTimes,
    day,
    voiceUrl: profile?.reminder_voice === false ? null : (recordings?.[0]?.url ?? null),
    repeat: profile?.reminder_repeat ?? 1,
  });

  const needsOnboarding = Boolean(user && profile && profile.onboarding_complete === false);
  useEffect(() => { if (needsOnboarding) void navigate({ to: "/onboarding" }); }, [needsOnboarding, navigate]);

  if (!loading && !user) return <Welcome />;

  return (
    <div className="relative flex min-h-dvh flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="safe-top pad-safe-nav relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-6 sm:px-8">
        <header className="animate-silk mb-8 w-full text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-gold/75">Aurelia · Rooted in Eternity</p>
          <p className="mt-4 font-body-serif text-lg italic text-ivory/75">{greeting(prefs?.tone ?? "gentle", prefs?.display_name ?? profile?.display_name)}</p>
          <Ornament className="mx-auto mt-3" />
        </header>

        <section className="mb-8 w-full max-w-sm text-center" aria-labelledby="today-need">
          <p id="today-need" className="font-display text-2xl italic text-ivory">What do you need today?</p>
          <div className="mt-5"><PillarCompass value={pillar} onChange={setPillar} /></div>
        </section>

        <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/80">
          <span aria-hidden="true">{selectedPillar.symbol}</span><span>{selectedPillar.label} · Today’s affirmation</span>
        </div>

        <AffirmationCard entry={entry} isFavorite={isFavorite} canFavorite={Boolean(user) && entry.source === "library"} onToggleFavorite={() => toggle.mutate({ day: entry.day, isFavorite })} />

        <section className="mt-10 w-full max-w-sm rounded-sm border border-gold/15 bg-ivory/[0.03] p-5 text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold/75">Today’s ritual</p>
          <p className="mt-3 font-body-serif text-lg italic text-ivory/85">Arrive · Affirm · Reflect · Act · Carry it with you</p>
          <Link to="/rituals" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-sm border border-gold/45 bg-gold/10 px-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/20">Begin today’s ritual</Link>
        </section>

        <DailyCheckin userId={user?.id} affirmationDay={entry.day} action={entry.action} />

        <section className="mt-12 w-full max-w-sm border-t border-gold/15 pt-7">
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.22em] text-gold/65">Continue your journey</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[{ to: "/journal", label: "Reflect" }, { to: "/aurelia", label: "Talk" }, { to: "/path", label: "Foundations" }].map((item) => (
              <Link key={item.to} to={item.to} className="flex min-h-11 items-center justify-center rounded-sm border border-gold/15 px-2 text-center text-[8px] uppercase tracking-[0.13em] text-ivory/65 transition-colors hover:border-gold/35 hover:text-gold">{item.label}</Link>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

function Welcome() {
  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-8 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.38em] text-gold/85">Aurelia</span>
        <Ornament className="mt-4" />
        <h1 className="animate-silk mt-8 font-display text-4xl italic leading-tight">Rooted in Eternity</h1>
        <p className="mt-7 font-body-serif text-xl italic leading-relaxed text-ivory/85">Return to yourself. Grow with intention. Carry your light into the world.</p>
        <p className="mt-6 text-sm leading-relaxed text-ivory/55">A daily practice for remembering who you are, nurturing who you are becoming, and carrying more light into the world.</p>
        <Link to="/auth" className="mt-10 inline-flex h-12 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20">Begin your journey</Link>
        <Link to="/library" className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-ivory">Explore Aurelia</Link>
      </main>
    </div>
  );
}
