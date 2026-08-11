import { createFileRoute, Link } from "@tanstack/react-router";
import { AffirmationCard } from "@/components/affirmation-card";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { affirmations } from "@/data/affirmations";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useToggleFavorite } from "@/lib/user-data";
import { useState } from "react";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Affirmations — Aurelia" },
      {
        name: "description",
        content: "The affirmations you've kept, synced to your account.",
      },
      { property: "og:title", content: "Saved Affirmations — Aurelia" },
      {
        property: "og:description",
        content: "The affirmations you've kept, synced to your account.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { user, loading } = useAuth();
  const { data: favorites, isLoading } = useFavorites(user?.id);
  const toggle = useToggleFavorite(user?.id);
  const [openDay, setOpenDay] = useState<number | null>(null);

  const entries = affirmations.filter((e) => (favorites ?? []).includes(e.day));
  const selected = openDay ? entries.find((e) => e.day === openDay) : undefined;

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-xl px-8 pb-36 pt-16">
        {selected ? (
          <>
            <button
              type="button"
              onClick={() => setOpenDay(null)}
              className="mb-8 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition-colors hover:text-gold"
            >
              ← Back to saved
            </button>
            <AffirmationCard
              entry={selected}
              isFavorite
              canFavorite
              onToggleFavorite={() =>
                toggle.mutate({ day: selected.day, isFavorite: true })
              }
            />
          </>
        ) : (
          <>
            <header className="text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
                Saved
              </span>
              <Ornament className="mt-3" />
            </header>

            {!loading && !user ? (
              <div className="mt-24 text-center">
                <p className="font-body-serif text-xl italic text-ivory/80">
                  Sign in to keep affirmations across your devices.
                </p>
                <Link
                  to="/auth"
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
                >
                  Sign in
                </Link>
              </div>
            ) : isLoading ? (
              <p className="mt-20 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/40">
                Gathering…
              </p>
            ) : entries.length === 0 ? (
              <p className="mt-24 text-center font-body-serif text-xl italic text-ivory/70">
                Nothing kept yet. Tap the heart on an affirmation that speaks to you.
              </p>
            ) : (
              <ul className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
                {entries.map((entry) => (
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
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
