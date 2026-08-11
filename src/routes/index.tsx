import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AffirmationCard } from "@/components/affirmation-card";
import { BottomNav } from "@/components/bottom-nav";
import { DailyCheckin } from "@/components/daily-checkin";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { useAuth } from "@/hooks/useAuth";
import { useTodayKey } from "@/hooks/use-today";
import { currentJourneyDay, selectDailyEntry } from "@/lib/journey";
import { useCustomAffirmations } from "@/lib/custom-affirmations";
import { greeting, usePreferences } from "@/lib/preferences";
import { normaliseTimes, useDailyReminder } from "@/lib/reminders";
import { useFavorites, useProfile, useToggleFavorite } from "@/lib/user-data";
import { useVoiceAffirmations } from "@/lib/voice";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia" },
      {
        name: "description",
        content:
          "Your affirmation for today, with a reflection prompt and one small action to carry it forward.",
      },
      { property: "og:title", content: "Aurelia" },
      {
        property: "og:description",
        content:
          "Your affirmation for today, with a reflection prompt and one small action to carry it forward.",
      },
    ],
  }),
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

  // Re-renders on its own at midnight so the affirmation rolls over unattended.
  const today = useTodayKey();
  const day = currentJourneyDay(profile?.journey_start);
  const entry = selectDailyEntry({
    day,
    focusAreas: prefs?.focus_areas,
    customs: (customs ?? []).filter((item) => item.in_rotation),
  });
  const isFavorite = (favorites ?? []).includes(entry.day);

  const alarmTimes = normaliseTimes([
    ...(profile?.reminder_times ?? []),
    profile?.reminder_time ?? null,
  ]);

  useDailyReminder({
    enabled: Boolean(profile?.reminder_enabled),
    times: alarmTimes,
    day,
    voiceUrl: profile?.reminder_voice === false ? null : (recordings?.[0]?.url ?? null),
    repeat: profile?.reminder_repeat ?? 1,
  });


  const needsOnboarding = Boolean(user && profile && profile.onboarding_complete === false);
  useEffect(() => {
    if (needsOnboarding) void navigate({ to: "/onboarding" });
  }, [needsOnboarding, navigate]);


  if (!loading && !user) return <Welcome />;

  return (
    <div className="relative flex min-h-dvh flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="safe-top pad-safe-nav relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-8">
        <header className="animate-silk mb-8 w-full text-center">
          <p className="font-body-serif text-lg italic text-ivory/75">
            {greeting(prefs?.tone ?? "gentle", prefs?.display_name ?? profile?.display_name)}
          </p>
          <Ornament className="mx-auto mt-3" />
        </header>

        <AffirmationCard
          entry={entry}
          isFavorite={isFavorite}
          canFavorite={Boolean(user) && entry.source === "library"}
          onToggleFavorite={() => toggle.mutate({ day: entry.day, isFavorite })}
        />

        <DailyCheckin userId={user?.id} affirmationDay={entry.day} action={entry.action} />

        <nav
          aria-label="Your practice"
          className="mt-14 grid w-full max-w-sm grid-cols-3 gap-3"
        >
          {[
            { to: "/rituals", label: "Breathe" },
            { to: "/voice", label: "My Voice" },
            { to: "/path", label: "The Path" },
            { to: "/library", label: "Library" },
            { to: "/saved", label: "Saved" },
            { to: "/settings", label: "Ritual" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-h-11 items-center justify-center rounded-sm border border-gold/25 px-3 py-3 text-center text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
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
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/80">
          Aurelia
        </span>
        <Ornament className="mt-4" />
        <h1 className="animate-silk mt-10 text-balance font-display text-4xl italic leading-tight">
          “Like rivers flow to the sea, money always flows to me.”
        </h1>
        <p className="mt-8 font-body-serif text-lg italic leading-relaxed text-ivory/80">
          Three hundred and sixty-five affirmations for wealth, energy, change and
          healing — one for every day of your journey.
        </p>
        <Link
          to="/auth"
          className="mt-12 inline-flex h-12 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
        >
          Begin
        </Link>
        <Link
          to="/library"
          className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-ivory"
        >
          Browse all 365
        </Link>
      </main>
    </div>
  );
}
