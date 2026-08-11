import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/page-shell";
import { useLogGrowth } from "@/lib/growth";
import {
  ENERGY_LABELS,
  MOOD_LABELS,
  useGratitude,
  useSaveCheckin,
  useSaveGratitude,
  useTodayCheckin,
  type ActionStatus,
} from "@/lib/tracking";

interface Props {
  userId: string | undefined;
  affirmationDay: number;
  action: string;
}

const ACTION_OPTIONS: { value: ActionStatus; label: string }[] = [
  { value: "done", label: "Done" },
  { value: "carried", label: "Carry over" },
  { value: "skipped", label: "Skip" },
];

function Scale({
  legend,
  labels,
  value,
  onChange,
}: {
  legend: string;
  labels: readonly string[];
  value: number | null;
  onChange: (next: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[10px] uppercase tracking-[0.18em] text-ivory/60">
        {legend}
      </legend>
      <div className="mt-3 flex gap-2">
        {labels.map((label, index) => {
          const score = index + 1;
          const active = value === score;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange(score)}
              aria-pressed={active}
              className={`flex min-h-11 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border px-1 py-2 transition-colors ${
                active
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/20 text-ivory/70 hover:bg-gold/5"
              }`}
            >
              <span className="text-xs font-semibold">{score}</span>
              <span className="text-[8px] uppercase tracking-[0.12em]">{label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function DailyCheckin({ userId, affirmationDay, action }: Props) {
  const { data: checkin } = useTodayCheckin(userId);
  const { data: gratitude } = useGratitude(userId);
  const save = useSaveCheckin(userId);
  const saveGratitude = useSaveGratitude(userId);
  const logGrowth = useLogGrowth(userId);

  const [entries, setEntries] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    if (!gratitude) return;
    setEntries([0, 1, 2].map((index) => gratitude[index]?.content ?? ""));
  }, [gratitude]);

  const status = (checkin?.action_status ?? "pending") as ActionStatus;

  const setMood = (mood: number) => {
    const first = checkin?.mood == null;
    save.mutate(
      { mood, affirmation_day: affirmationDay },
      {
        onSuccess: () => {
          if (first) logGrowth.mutate("checkin");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const setEnergy = (energy: number) => {
    save.mutate(
      { energy, affirmation_day: affirmationDay },
      { onError: (error) => toast.error(error.message) },
    );
  };

  const setStatus = (next: ActionStatus) => {
    save.mutate(
      { action_status: next, affirmation_day: affirmationDay },
      {
        onSuccess: () => {
          if (next === "done" && status !== "done") {
            logGrowth.mutate("action");
            toast.success("Aligned action complete.");
          }
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const commitGratitude = () => {
    const had = (gratitude ?? []).length;
    saveGratitude.mutate(entries, {
      onSuccess: (count) => {
        if (count > 0 && had === 0) logGrowth.mutate("gratitude");
        toast.success(count > 0 ? "Gratitude saved." : "Gratitude cleared.");
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section
      aria-label="Today's check-in"
      className="mt-14 w-full max-w-sm space-y-8 border-t border-gold/20 pt-8"
    >
      <div className="space-y-4">
        <SectionHeading>Aligned action</SectionHeading>
        <div className="rounded-sm border border-gold/10 bg-ivory/5 p-4">
          <p className="text-sm leading-relaxed">{action}</p>
        </div>
        <div className="flex gap-2">
          {ACTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={status === option.value}
              className={`min-h-11 flex-1 cursor-pointer rounded-sm border px-2 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                status === option.value
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/25 text-ivory/70 hover:bg-gold/5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <SectionHeading>How are you today?</SectionHeading>
        <Scale
          legend="Mood"
          labels={MOOD_LABELS}
          value={checkin?.mood ?? null}
          onChange={setMood}
        />
        <Scale
          legend="Energy"
          labels={ENERGY_LABELS}
          value={checkin?.energy ?? null}
          onChange={setEnergy}
        />
        <p aria-live="polite" className="text-[10px] uppercase tracking-[0.16em] text-gold/80">
          {checkin?.mood
            ? `Mood ${MOOD_LABELS[checkin.mood - 1]}${
                checkin.energy ? ` • Energy ${ENERGY_LABELS[checkin.energy - 1]}` : ""
              }`
            : "Not checked in yet"}
        </p>
      </div>

      <div className="space-y-4">
        <SectionHeading>Three gratitudes</SectionHeading>
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <label key={index} className="block">
              <span className="sr-only">Gratitude {index + 1}</span>
              <input
                value={entry}
                onChange={(event) =>
                  setEntries((current) =>
                    current.map((item, i) => (i === index ? event.target.value : item)),
                  )
                }
                placeholder={`Grateful for…`}
                className="h-11 w-full rounded-sm border border-gold/20 bg-ivory/5 px-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={commitGratitude}
          disabled={saveGratitude.isPending}
          className="min-h-11 w-full cursor-pointer rounded-sm border border-gold/30 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          {saveGratitude.isPending ? "Saving" : "Save gratitude"}
        </button>
      </div>
    </section>
  );
}
