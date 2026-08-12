import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { TreeOfLife, TreeProgress } from "@/components/tree-of-life";
import { useAuth } from "@/hooks/useAuth";
import { prettyDate } from "@/lib/dates";
import { useGrowthPoints } from "@/lib/growth";
import { daysJourneyed } from "@/lib/journey";
import { AURELIA_PILLARS } from "@/lib/pillars";
import { ENERGY_LABELS, MOOD_LABELS, currentStreak, longestStreak, useAllCheckins, useCheckinHistory, useGratitudeCount } from "@/lib/tracking";
import { useProfile } from "@/lib/user-data";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [
    { title: "Your Journey — Aurelia" },
    { name: "description", content: "See the Tree of Life grow with every day you return to yourself." },
    { property: "og:title", content: "Your Journey — Aurelia" },
    { property: "og:description", content: "Rooted. Eternal. Growth. Light. See what your daily practice is becoming." },
  ]}),
  component: JourneyPage,
});

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-sm border border-gold/15 bg-ivory/5 px-4 py-5 text-center"><p className="font-display text-2xl italic text-gold">{value}</p><p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-ivory/60">{label}</p></div>;
}

function JourneyPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: all, isLoading: loadingAll } = useAllCheckins(user?.id);
  const { data: history } = useCheckinHistory(user?.id, 14);
  const { data: gratitudeCount } = useGratitudeCount(user?.id);
  const { data: growth } = useGrowthPoints(user?.id);

  if (loading) return <PageShell eyebrow="Journey" title="Your unfolding"><p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/50">Loading</p></PageShell>;
  if (!user) return <PageShell eyebrow="Journey" title="Your unfolding"><SignInPrompt message="Sign in to see the Tree of Life grow with your practice." /></PageShell>;

  const checkins = all ?? [];
  const ritualMinutes = Math.round(checkins.reduce((sum, item) => sum + (item.ritual_seconds ?? 0), 0) / 60);
  const actionsDone = checkins.filter((item) => item.action_status === "done").length;
  const points = growth?.total ?? 0;
  const recent = (history ?? []).slice(-14);
  const journeyDays = daysJourneyed(profile?.journey_start);
  const pillarValues = [Math.max(1, checkins.length), Math.max(1, gratitudeCount ?? 0), Math.max(1, actionsDone), Math.max(1, Math.round(ritualMinutes / 2))];
  const pillarMax = Math.max(...pillarValues, 1);

  return <PageShell eyebrow="Journey" title="Your unfolding" intro={`${journeyDays} ${journeyDays === 1 ? "day" : "days"} of returning to yourself. Every practice becomes part of the tree.`}>
    <section aria-label="Your Tree of Life" className="animate-silk mt-10 text-center"><p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold/70">Your Tree</p><TreeOfLife points={points} className="mx-auto mt-5 w-full max-w-[280px]" /><div className="mt-6"><TreeProgress points={points} /></div></section>

    <section aria-label="Four dimensions of your practice" className="mt-12 space-y-5"><SectionHeading>What you are nurturing</SectionHeading><div className="space-y-4 rounded-sm border border-gold/15 bg-ivory/[0.03] p-5">{AURELIA_PILLARS.map((pillar, index) => <div key={pillar.id}><div className="flex items-center justify-between gap-3"><span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold/80">{pillar.symbol} {pillar.label}</span><span className="text-[9px] text-ivory/45">{pillar.promise}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-ivory/10"><div className="h-full rounded-full bg-gold/70" style={{ width: `${Math.max(12, (pillarValues[index]! / pillarMax) * 100)}%` }} /></div></div>)}</div><p className="font-body-serif text-base italic leading-relaxed text-ivory/60">These dimensions use your existing rituals, gratitude and actions. As Aurelia learns your pillars, your Tree will become even more personal.</p></section>

    <section className="mt-12 grid grid-cols-2 gap-3"><Link to="/journal" className="rounded-sm border border-gold/20 bg-gold/5 p-5 text-center transition-colors hover:bg-gold/10"><span className="block text-[9px] uppercase tracking-[0.2em] text-gold">Reflect</span><span className="mt-2 block font-body-serif text-base italic text-ivory/75">Write what is becoming clear.</span></Link><Link to="/aurelia" className="rounded-sm border border-gold/20 bg-gold/5 p-5 text-center transition-colors hover:bg-gold/10"><span className="block text-[9px] uppercase tracking-[0.2em] text-gold">With Aurelia</span><span className="mt-2 block font-body-serif text-base italic text-ivory/75">Talk through what you are carrying.</span></Link></section>

    <section aria-label="Recent mood and energy" className="mt-14 space-y-4"><SectionHeading>Last fourteen days</SectionHeading>{loadingAll ? <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Loading</p> : recent.length === 0 ? <p className="font-body-serif text-lg italic text-ivory/70">No check-ins yet. Meet yourself honestly on Today and your story begins here.</p> : <ul className="space-y-2">{recent.map((item) => <li key={item.entry_date} className="flex items-center gap-3 rounded-sm border border-gold/10 bg-ivory/5 px-3 py-2"><span className="w-24 shrink-0 text-[10px] uppercase tracking-[0.14em] text-ivory/60">{prettyDate(item.entry_date)}</span><span className="flex flex-1 items-center gap-1" aria-hidden="true">{[1,2,3,4,5].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full ${(item.mood ?? 0) >= step ? "bg-gold" : "bg-ivory/15"}`} />)}</span><span className="w-28 shrink-0 text-right text-[9px] uppercase tracking-[0.12em] text-gold/80">{item.mood ? MOOD_LABELS[item.mood - 1] : "—"}{item.energy ? ` / ${ENERGY_LABELS[item.energy - 1]}` : ""}</span></li>)}</ul>}</section>

    <section aria-label="Practice details" className="mt-14 space-y-4"><SectionHeading>The practice beneath the tree</SectionHeading><div className="grid grid-cols-2 gap-3"><Stat label="Days returning" value={`${journeyDays}`} /><Stat label="Current rhythm" value={`${currentStreak(checkins)}d`} /><Stat label="Longest rhythm" value={`${longestStreak(checkins)}d`} /><Stat label="Ritual minutes" value={`${ritualMinutes}`} /><Stat label="Actions lived" value={`${actionsDone}`} /><Stat label="Gratitudes" value={`${gratitudeCount ?? 0}`} /></div></section>
  </PageShell>;
}
