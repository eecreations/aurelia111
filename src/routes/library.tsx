import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AffirmationCard } from "@/components/affirmation-card";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { CATEGORIES, affirmations, type Category } from "@/data/affirmations";
import { useAuth } from "@/hooks/useAuth";
import { AURELIA_PILLARS, pillarForAffirmation, type AureliaPillar } from "@/lib/pillars";
import { useFavorites, useToggleFavorite } from "@/lib/user-data";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [
    { title: "Library — Aurelia" },
    { name: "description", content: "Explore 365 affirmations through Rooted, Eternal, Growth and Light." },
    { property: "og:title", content: "Library — Aurelia" },
    { property: "og:description", content: "Find the words you need for this moment." },
  ]}),
  component: LibraryPage,
});

type View = "all" | "saved" | AureliaPillar;

function LibraryPage() {
  const { user } = useAuth();
  const { data: favorites } = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const [view, setView] = useState<View>("all");
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [openDay, setOpenDay] = useState<number | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return affirmations.filter((entry) => {
      if (view === "saved" && !(favorites ?? []).includes(entry.day)) return false;
      if (view !== "all" && view !== "saved" && pillarForAffirmation(entry) !== view) return false;
      if (category && entry.category !== category) return false;
      if (!needle) return true;
      return entry.affirmation.toLowerCase().includes(needle) || entry.reflection.toLowerCase().includes(needle) || String(entry.day) === needle;
    });
  }, [category, favorites, query, view]);

  const selected = openDay ? affirmations.find((entry) => entry.day === openDay) : undefined;
  if (selected) {
    const isFavorite = (favorites ?? []).includes(selected.day);
    const pillar = AURELIA_PILLARS.find((item) => item.id === pillarForAffirmation(selected))!;
    return (
      <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
        <SilkBackdrop />
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-8 pb-36 pt-16">
          <button type="button" onClick={() => setOpenDay(null)} className="mb-6 self-start text-[10px] uppercase tracking-[0.2em] text-gold/70 transition-colors hover:text-gold">← Back to library</button>
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/75">{pillar.symbol} {pillar.label} · {pillar.promise}</p>
          <AffirmationCard entry={selected} isFavorite={isFavorite} canFavorite={Boolean(user)} onToggleFavorite={() => toggle.mutate({ day: selected.day, isFavorite })} />
        </main>
        <BottomNav />
      </div>
    );
  }

  const views: { value: View; label: string; symbol?: string }[] = [
    { value: "all", label: "For You" },
    ...AURELIA_PILLARS.map((pillar) => ({ value: pillar.id, label: pillar.label, symbol: pillar.symbol })),
    { value: "saved", label: "Saved" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-xl px-6 pb-36 pt-16 sm:px-8">
        <header className="text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">Aurelia Library</span>
          <Ornament className="mt-3" />
          <h1 className="mt-6 font-display text-3xl italic">Find what you need</h1>
          <p className="mt-3 font-body-serif text-lg italic text-ivory/65">365 moments of grounding, meaning, growth and hope.</p>
        </header>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {views.map((item) => <FilterChip key={item.value} label={`${item.symbol ? `${item.symbol} ` : ""}${item.label}`} active={view === item.value} onClick={() => setView(item.value)} />)}
        </div>

        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search words, reflections or a day" className="mt-8 w-full rounded-sm border border-gold/20 bg-ivory/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:outline-none" />

        <details className="mt-4 rounded-sm border border-gold/10 bg-ivory/[0.02] p-3">
          <summary className="cursor-pointer text-[9px] uppercase tracking-[0.18em] text-ivory/55">More topics</summary>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip label="All topics" active={category === null} onClick={() => setCategory(null)} />
            {CATEGORIES.map((item) => <FilterChip key={item} label={item} active={category === item} onClick={() => setCategory(item)} />)}
          </div>
        </details>

        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/40">{results.length} entries</p>
        <ul className="mt-4 divide-y divide-gold/10 border-y border-gold/10">
          {results.map((entry) => {
            const pillar = AURELIA_PILLARS.find((item) => item.id === pillarForAffirmation(entry))!;
            return (
              <li key={entry.day}>
                <button type="button" onClick={() => setOpenDay(entry.day)} className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-ivory/5">
                  <span className="mt-1 w-10 shrink-0 font-body-serif text-lg italic text-gold/70">{entry.day}</span>
                  <span className="min-w-0"><span className="block text-[9px] uppercase tracking-[0.2em] text-gold/55">{pillar.symbol} {pillar.label}</span><span className="mt-1 block font-body-serif text-lg italic leading-snug text-ivory/90">{entry.affirmation}</span></span>
                  {(favorites ?? []).includes(entry.day) ? <span className="ml-auto mt-1 text-xs text-gold">❤</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`min-h-10 rounded-sm border px-3 py-2 text-[8px] uppercase tracking-[0.14em] transition-colors ${active ? "border-gold/60 bg-gold/15 text-gold" : "border-gold/15 text-ivory/55 hover:border-gold/40 hover:text-ivory"}`}>{label}</button>;
}
