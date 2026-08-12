import { useMemo, useState } from "react";
import { currentStreak, type Checkin } from "@/lib/tracking";

function startOfWeekKey() {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  return date.toISOString().slice(0, 10);
}

export function WeeklyReflection({
  checkins,
  gratitudeCount,
  journalCount,
  growthPoints,
  focusAreas,
}: {
  checkins: Checkin[];
  gratitudeCount: number;
  journalCount: number;
  growthPoints: number;
  focusAreas?: string[] | null;
}) {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const summary = useMemo(() => {
    const start = startOfWeekKey();
    const week = checkins.filter((item) => item.entry_date >= start);
    const rituals = Math.round(week.reduce((sum, item) => sum + (item.ritual_seconds ?? 0), 0) / 60);
    const actions = week.filter((item) => item.action_status === "done").length;
    const moods = week.map((item) => item.mood).filter((value): value is number => typeof value === "number");
    const energies = week.map((item) => item.energy).filter((value): value is number => typeof value === "number");
    const average = (values: number[]) => values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null;
    return { days: week.length, rituals, actions, avgMood: average(moods), avgEnergy: average(energies), streak: currentStreak(checkins) };
  }, [checkins]);

  const askAurelia = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/aurelia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "Reflect on my week in 3 short paragraphs: what I practiced, what pattern you notice, and one gentle intention for next week." }], context: { weeklySummary: summary, gratitudeCount, journalCount, growthPoints, focusAreas } }) });
      const data = await response.json() as { reply?: string };
      if (!response.ok || !data.reply) throw new Error("Reflection unavailable");
      setReflection(data.reply);
    } catch {
      setReflection("You showed up in small, measurable ways this week. Let the numbers be evidence, not a score. Notice which practice made you feel most like yourself, and carry only that one forward.");
    } finally { setLoading(false); }
  };

  return (
    <section className="mt-14 rounded-sm border border-gold/20 bg-gradient-to-b from-gold/10 to-transparent p-6">
      <p className="text-[9px] uppercase tracking-[0.22em] text-gold/75">Your week with Aurelia</p>
      <h2 className="mt-2 font-display text-3xl italic">A week, remembered</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[ ["Days practiced", `${summary.days}`], ["Breath", `${summary.rituals}m`], ["Actions", `${summary.actions}`], ["Current streak", `${summary.streak}d`] ].map(([label, value]) => <div key={label} className="rounded-sm border border-gold/15 bg-obsidian/30 p-3 text-center"><p className="font-display text-xl italic text-gold">{value}</p><p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-ivory/50">{label}</p></div>)}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-ivory/65">{summary.avgMood ? `Average mood ${summary.avgMood}/5. ` : ""}{summary.avgEnergy ? `Average energy ${summary.avgEnergy}/5. ` : ""}Your tree holds {growthPoints} growth points.</p>
      {reflection ? <p className="mt-5 whitespace-pre-wrap font-body-serif text-base italic leading-relaxed text-ivory/85">{reflection}</p> : null}
      <button type="button" onClick={() => void askAurelia()} disabled={loading} className="mt-5 rounded-sm border border-gold/40 bg-gold/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold hover:bg-gold/20 disabled:opacity-50">{loading ? "Reflecting…" : reflection ? "Reflect again" : "Ask Aurelia to reflect"}</button>
    </section>
  );
}
