import { createFileRoute } from "@tanstack/react-router";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { TreeOfLife, TreeProgress } from "@/components/tree-of-life";
import { useAuth } from "@/hooks/useAuth";
import { prettyDate } from "@/lib/dates";
import { useGrowthPoints } from "@/lib/growth";
import { daysJourneyed } from "@/lib/journey";
import {
  ENERGY_LABELS,
  MOOD_LABELS,
  currentStreak,
  longestStreak,
  useAllCheckins,
  useCheckinHistory,
  useGratitudeCount,
} from "@/lib/tracking";
import { useProfile } from "@/lib/user-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress — Aurelia" },
      {
        name: "description",
        content:
          "Streaks, ritual minutes, aligned actions and the Tree of Life that grows with your daily practice.",
      },
      { property: "og:title", content: "Your Progress — Aurelia" },
      {
        property: "og:description",
        content:
          "Streaks, ritual minutes, aligned actions and the Tree of Life that grows with your daily practice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-gold/15 bg-ivory/5 px-4 py-5 text-center">
      <p className="font-display text-2xl italic text-gold">{value}</p>
      <p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-ivory/60">{label}</p>
    </div>
  );
}

function ProgressPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: all, isLoading: loadingAll } = useAllCheckins(user?.id);
  const { data: history } = useCheckinHistory(user?.id, 14);
  const { data: gratitudeCount } = useGratitudeCount(user?.id);
  const { data: growth } = useGrowthPoints(user?.id);

  if (loading) {
    return (
      <PageShell eyebrow="Progress" title="Your unfolding">
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/50">
          Loading
        </p>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell eyebrow="Progress" title="Your unfolding">
        <SignInPrompt message="Sign in to see your streaks and grow your Tree of Life." />
      </PageShell>
    );
  }

  const checkins = all ?? [];
  const ritualMinutes = Math.round(
    checkins.reduce((sum, item) => sum + (item.ritual_seconds ?? 0), 0) / 60,
  );
  const actionsDone = checkins.filter((item) => item.action_status === "done").length;
  const points = growth?.total ?? 0;
  const recent = (history ?? []).slice(-14);

  return (
    <PageShell
      eyebrow="Progress"
      title="Your unfolding"
      intro="Every ritual, action and check-in feeds the tree."
    >
      <section aria-label="Tree of Life" className="animate-silk mt-12">
        <TreeOfLife points={points} className="mx-auto w-full max-w-[260px]" />
        <div className="mt-6">
          <TreeProgress points={points} />
        </div>
      </section>

      <section aria-label="Your numbers" className="mt-14 space-y-4">
        <SectionHeading>Your numbers</SectionHeading>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Current streak" value={`${currentStreak(checkins)}d`} />
          <Stat label="Longest streak" value={`${longestStreak(checkins)}d`} />
          <Stat label="Ritual minutes" value={`${ritualMinutes}`} />
          <Stat label="Actions completed" value={`${actionsDone}`} />
          <Stat label="Gratitudes" value={`${gratitudeCount ?? 0}`} />
          <Stat label="Days journeyed" value={`${daysJourneyed(profile?.journey_start)}`} />
        </div>
      </section>

      <section aria-label="Recent mood and energy" className="mt-14 space-y-4">
        <SectionHeading>Last fourteen days</SectionHeading>
        {loadingAll ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Loading</p>
        ) : recent.length === 0 ? (
          <p className="font-body-serif text-lg italic text-ivory/70">
            No check-ins yet. Mark your mood on Today and this chart begins.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.map((item) => (
              <li
                key={item.entry_date}
                className="flex items-center gap-3 rounded-sm border border-gold/10 bg-ivory/5 px-3 py-2"
              >
                <span className="w-24 shrink-0 text-[10px] uppercase tracking-[0.14em] text-ivory/60">
                  {prettyDate(item.entry_date)}
                </span>
                <span className="flex flex-1 items-center gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className={`h-1.5 flex-1 rounded-full ${
                        (item.mood ?? 0) >= step ? "bg-gold" : "bg-ivory/15"
                      }`}
                    />
                  ))}
                </span>
                <span className="w-28 shrink-0 text-right text-[9px] uppercase tracking-[0.12em] text-gold/80">
                  {item.mood ? MOOD_LABELS[item.mood - 1] : "—"}
                  {item.energy ? ` / ${ENERGY_LABELS[item.energy - 1]}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
