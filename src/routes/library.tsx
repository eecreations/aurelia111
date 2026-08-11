import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AffirmationCard } from "@/components/affirmation-card";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { CATEGORIES, affirmations, type Category } from "@/data/affirmations";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useToggleFavorite } from "@/lib/user-data";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The 365 Library — Aurelia" },
      {
        name: "description",
        content:
          "Browse all 365 affirmations by category: wealth creation, positive energy, positive change and inner healing.",
      },
      { property: "og:title", content: "The 365 Library — Aurelia" },
      {
        property: "og:description",
        content:
          "Browse all 365 affirmations by category: wealth creation, positive energy, positive change and inner healing.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user } = useAuth();
  const { data: favorites } = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [openDay, setOpenDay] = useState<number | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return affirmations.filter((entry) => {
      if (category && entry.category !== category) return false;
      if (!needle) return true;
      return (
        entry.affirmation.toLowerCase().includes(needle) ||
        entry.reflection.toLowerCase().includes(needle) ||
        String(entry.day) === needle
      );
    });
  }, [category, query]);

  const selected = openDay ? affirmations.find((e) => e.day === openDay) : undefined;

  if (selected) {
    const isFavorite = (favorites ?? []).includes(selected.day);
    return (
      <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
        <SilkBackdrop />
        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col items-center px-8 pb-36 pt-16">
          <button
            type="button"
            onClick={() => setOpenDay(null)}
            className="mb-8 self-start text-[10px] uppercase tracking-[0.2em] text-gold/70 transition-colors hover:text-gold"
          >
            ← Back to library
          </button>
          <AffirmationCard
            entry={selected}
            isFavorite={isFavorite}
            canFavorite={Boolean(user)}
            onToggleFavorite={() =>
              toggle.mutate({ day: selected.day, isFavorite })
            }
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-xl px-8 pb-36 pt-16">
        <header className="text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
            The 365 Library
          </span>
          <Ornament className="mt-3" />
        </header>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search affirmations or a day number"
          className="mt-10 w-full rounded-sm border border-gold/20 bg-ivory/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:outline-none"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={category === null}
            onClick={() => setCategory(null)}
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ivory/40">
          {results.length} entries
        </p>

        <ul className="mt-4 divide-y divide-gold/10 border-y border-gold/10">
          {results.map((entry) => (
            <li key={entry.day}>
              <button
                type="button"
                onClick={() => setOpenDay(entry.day)}
                className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-ivory/5"
              >
                <span className="mt-1 w-10 shrink-0 font-body-serif text-lg italic text-gold/70">
                  {entry.day}
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-gold/50">
                    {entry.category}
                  </span>
                  <span className="mt-1 block font-body-serif text-lg italic leading-snug text-ivory/90">
                    {entry.affirmation}
                  </span>
                </span>
                {(favorites ?? []).includes(entry.day) && (
                  <span className="ml-auto mt-1 text-xs text-gold">❤</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border px-3 py-2 text-[9px] uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-gold/60 bg-gold/15 text-gold"
          : "border-gold/15 text-ivory/55 hover:border-gold/40 hover:text-ivory"
      }`}
    >
      {label}
    </button>
  );
}
