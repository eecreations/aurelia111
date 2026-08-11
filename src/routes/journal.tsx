import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { useAuth } from "@/hooks/useAuth";
import { prettyDate, todayKey } from "@/lib/dates";
import { useLogGrowth } from "@/lib/growth";
import {
  MOOD_TAGS,
  useDeleteJournalEntry,
  useJournalEntries,
  useSaveJournalEntry,
  type JournalEntry,
} from "@/lib/journal";
import { currentJourneyDay } from "@/lib/journey";
import { useProfile } from "@/lib/user-data";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Private Journal — Aurelia" },
      {
        name: "description",
        content:
          "A private journal for the sentence you would not say out loud yet. Only you can read your entries.",
      },
      { property: "og:title", content: "Private Journal — Aurelia" },
      {
        property: "og:description",
        content: "A private journal, visible only to you, alongside today's affirmation.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: entries } = useJournalEntries(user?.id);
  const save = useSaveJournalEntry(user?.id);
  const remove = useDeleteJournalEntry(user?.id);
  const logGrowth = useLogGrowth(user?.id);

  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string | null>(null);

  const day = currentJourneyDay(profile?.journey_start);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setBody("");
    setMood(null);
  };

  const handleSave = () => {
    save.mutate(
      {
        id: editing?.id,
        entry_date: editing?.entry_date ?? todayKey(),
        title,
        body,
        mood_tag: mood,
        affirmation_day: editing?.affirmation_day ?? day,
      },
      {
        onSuccess: (result) => {
          if (result.created) logGrowth.mutate("journal");
          toast.success(result.created ? "Entry saved." : "Entry updated.");
          reset();
        },
        onError: (error) => toast.error((error as Error).message),
      },
    );
  };

  const startEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setTitle(entry.title);
    setBody(entry.body);
    setMood(entry.mood_tag);
  };

  return (
    <PageShell
      eyebrow="Private journal"
      title={editing ? "Edit your entry" : "Write it down"}
      intro="Your entries are private to your account — no one else can read them."
    >
      {!loading && !user ? (
        <SignInPrompt message="Sign in to open your private journal." />
      ) : (
        <div className="mt-12 space-y-12">
          <section className="gilded-panel space-y-5 rounded-sm p-6">
            <div className="space-y-2">
              <label
                htmlFor="journal-title"
                className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold"
              >
                Title
              </label>
              <input
                id="journal-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Optional"
                className="w-full rounded-sm border border-gold/20 bg-obsidian/40 px-4 py-3 font-body-serif text-lg text-ivory placeholder:text-ivory/35 focus-visible:border-gold/60"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="journal-body"
                className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold"
              >
                Entry
              </label>
              <textarea
                id="journal-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={8}
                placeholder="What is true for you today?"
                className="w-full resize-y rounded-sm border border-gold/20 bg-obsidian/40 px-4 py-3 text-sm leading-relaxed text-ivory placeholder:text-ivory/35 focus-visible:border-gold/60"
              />
            </div>

            <fieldset className="space-y-3">
              <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                How it felt
              </legend>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={mood === tag}
                    onClick={() => setMood(mood === tag ? null : tag)}
                    className={`min-h-11 cursor-pointer rounded-full border px-4 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      mood === tag
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-ivory/20 text-ivory/70 hover:bg-ivory/5"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={save.isPending}
                className="inline-flex h-12 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
              >
                {save.isPending ? "Saving" : editing ? "Update entry" : "Save entry"}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-12 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-ivory/20 px-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/75 transition-colors hover:bg-ivory/10"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </section>

          <section className="space-y-5 border-t border-gold/20 pt-8">
            <SectionHeading>Your entries</SectionHeading>
            {(entries ?? []).length === 0 ? (
              <p className="font-body-serif text-lg italic text-ivory/60">
                Nothing here yet. Your first entry can be one sentence.
              </p>
            ) : (
              <ul className="space-y-4">
                {(entries ?? []).map((entry) => (
                  <li key={entry.id} className="rounded-sm border border-ivory/12 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                        {prettyDate(entry.entry_date)}
                      </span>
                      {entry.mood_tag ? (
                        <span className="rounded-full border border-gold/30 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-gold">
                          {entry.mood_tag}
                        </span>
                      ) : null}
                    </div>
                    {entry.title ? (
                      <h3 className="mt-3 font-display text-xl italic">{entry.title}</h3>
                    ) : null}
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ivory/80">
                      {entry.body}
                    </p>
                    <div className="mt-4 flex gap-4">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        className="min-h-11 cursor-pointer text-[10px] uppercase tracking-[0.18em] text-gold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          remove.mutate(entry.id, {
                            onSuccess: () => toast.success("Entry deleted."),
                            onError: (error) => toast.error((error as Error).message),
                          })
                        }
                        className="min-h-11 cursor-pointer text-[10px] uppercase tracking-[0.18em] text-ivory/50 hover:text-ivory"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}
