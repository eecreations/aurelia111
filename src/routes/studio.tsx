import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { affirmations, type Category } from "@/data/affirmations";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateCustomAffirmation,
  useCustomAffirmations,
  useDeleteCustomAffirmation,
  useUpdateCustomAffirmation,
} from "@/lib/custom-affirmations";
import { currentJourneyDay } from "@/lib/journey";
import { FOCUS_OPTIONS } from "@/lib/preferences";
import { downloadShareCard, saveWallpaper } from "@/lib/share-card";
import { useProfile } from "@/lib/user-data";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Creator Studio — Aurelia" },
      {
        name: "description",
        content:
          "Write your own affirmations and turn any affirmation into a lock screen wallpaper.",
      },
      { property: "og:title", content: "Creator Studio — Aurelia" },
      {
        property: "og:description",
        content:
          "Write your own affirmations and turn any affirmation into a lock screen wallpaper.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

type Mode = "write" | "wallpaper";

function StudioPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: customs, isLoading: loadingCustoms } = useCustomAffirmations(user?.id);
  const create = useCreateCustomAffirmation(user?.id);
  const update = useUpdateCustomAffirmation(user?.id);
  const remove = useDeleteCustomAffirmation(user?.id);

  const [mode, setMode] = useState<Mode>("write");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("Positive Energy");
  const [reflection, setReflection] = useState("");
  const [action, setAction] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [rendering, setRendering] = useState<null | "card" | "wallpaper">(null);

  const day = currentJourneyDay(profile?.journey_start);
  const libraryToday = affirmations[(day - 1) % affirmations.length]!;

  const options = [
    { key: `library-${libraryToday.day}`, label: `Today — Day ${libraryToday.day}`, text: libraryToday.affirmation, category: libraryToday.category, day: libraryToday.day as number | undefined },
    ...(customs ?? []).map((item) => ({
      key: `custom-${item.id}`,
      label: `Yours — ${item.affirmation.slice(0, 28)}…`,
      text: item.affirmation,
      category: item.category,
      day: undefined as number | undefined,
    })),
  ];
  const chosen = options.find((option) => option.key === selected) ?? options[0]!;

  const submit = () => {
    create.mutate(
      { affirmation: text, category, reflection, action },
      {
        onSuccess: () => {
          setText("");
          setReflection("");
          setAction("");
          toast.success("Saved to your library.");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const render = async (kind: "card" | "wallpaper") => {
    setRendering(kind);
    try {
      const input = {
        category: chosen.category,
        affirmation: chosen.text,
        slug: "yours",
        ...(chosen.day ? { day: chosen.day } : { label: "Aurelia • Yours" }),

      };
      if (kind === "card") {
        await downloadShareCard(input);
        toast.success("Card saved.");
      } else {
        const result = await saveWallpaper(input);
        toast.success(
          result === "shared"
            ? "Save it to Photos, then set it as your lock screen."
            : "Wallpaper saved — set it as your lock screen.",
        );
      }
    } catch {
      toast.error("Could not render that image. Try again.");
    } finally {
      setRendering(null);
    }
  };

  if (loading) {
    return (
      <PageShell eyebrow="Studio" title="Create">
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/50">
          Loading
        </p>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell eyebrow="Studio" title="Create">
        <SignInPrompt message="Sign in to write your own affirmations and save wallpapers." />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Studio"
      title="Create"
      intro="Write what you need to hear, then wear it on your lock screen."
    >
      <div className="mt-10 flex gap-2" role="tablist" aria-label="Studio mode">
        {(
          [
            { value: "write", label: "Affirmation" },
            { value: "wallpaper", label: "Wallpaper" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={mode === tab.value}
            onClick={() => setMode(tab.value)}
            className={`min-h-11 flex-1 cursor-pointer rounded-sm border text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              mode === tab.value
                ? "border-gold bg-gold/15 text-gold"
                : "border-gold/25 text-ivory/70 hover:bg-gold/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "write" ? (
        <div className="mt-10 space-y-8">
          <div className="space-y-4">
            <SectionHeading>Your affirmation</SectionHeading>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              placeholder="I move with quiet certainty…"
              className="w-full rounded-sm border border-gold/20 bg-ivory/5 p-3 font-body-serif text-lg italic text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={category === option}
                  className={`min-h-11 cursor-pointer rounded-sm border px-3 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    category === option
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-gold/25 text-ivory/70 hover:bg-gold/5"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-ivory/60">
                Reflection prompt (optional)
              </span>
              <input
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-gold/20 bg-ivory/5 px-3 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-ivory/60">
                Aligned action (optional)
              </span>
              <input
                value={action}
                onChange={(event) => setAction(event.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-gold/20 bg-ivory/5 px-3 text-sm text-ivory focus:border-gold focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={submit}
              disabled={create.isPending || !text.trim()}
              className="min-h-12 w-full cursor-pointer rounded-sm border border-gold/50 bg-gold/10 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
            >
              {create.isPending ? "Saving" : "Save to my library"}
            </button>
          </div>

          <div className="space-y-4">
            <SectionHeading>Your library</SectionHeading>
            {loadingCustoms ? (
              <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Loading</p>
            ) : (customs ?? []).length === 0 ? (
              <p className="font-body-serif text-lg italic text-ivory/70">
                Nothing here yet — your first affirmation appears above.
              </p>
            ) : (
              <ul className="space-y-3">
                {(customs ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-sm border border-gold/10 bg-ivory/5 p-4"
                  >
                    <p className="font-body-serif text-lg italic leading-relaxed">
                      “{item.affirmation}”
                    </p>
                    <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-gold/80">
                      {item.category}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          update.mutate({ id: item.id, in_rotation: !item.in_rotation })
                        }
                        className="min-h-11 flex-1 cursor-pointer rounded-sm border border-gold/25 text-[10px] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
                      >
                        {item.in_rotation ? "In rotation" : "Add to rotation"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove.mutate(item.id)}
                        aria-label="Delete affirmation"
                        className="min-h-11 cursor-pointer rounded-sm border border-gold/25 px-4 text-[10px] uppercase tracking-[0.14em] text-ivory/70 transition-colors hover:bg-gold/10"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="space-y-4">
            <SectionHeading>Choose an affirmation</SectionHeading>
            <select
              value={chosen.key}
              onChange={(event) => setSelected(event.target.value)}
              aria-label="Affirmation to render"
              className="h-11 w-full rounded-sm border border-gold/20 bg-obsidian px-3 text-sm text-ivory focus:border-gold focus:outline-none"
            >
              {options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="mx-auto flex w-full max-w-[240px] flex-col items-center justify-center rounded-lg border border-gold/25 bg-viridian/60 p-6 text-center"
            style={{ aspectRatio: "9 / 19.5" }}
          >
            <span className="h-2 w-2 rotate-45 bg-gold" />
            <p className="mt-6 text-balance font-display text-lg italic leading-snug">
              “{chosen.text}”
            </p>
            <span className="mt-6 h-2 w-2 rotate-45 bg-gold" />
            <p className="mt-6 text-[8px] uppercase tracking-[0.22em] text-gold/80">
              {chosen.category}
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void render("wallpaper")}
              disabled={rendering !== null}
              className="min-h-12 w-full cursor-pointer rounded-sm border border-gold/50 bg-gold/10 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
            >
              {rendering === "wallpaper" ? "Rendering" : "Save lock screen"}
            </button>
            <button
              type="button"
              onClick={() => void render("card")}
              disabled={rendering !== null}
              className="min-h-12 w-full cursor-pointer rounded-sm border border-gold/30 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
            >
              {rendering === "card" ? "Rendering" : "Save share card"}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
