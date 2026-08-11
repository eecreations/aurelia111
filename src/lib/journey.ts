import { affirmations, getAffirmation, type Affirmation } from "@/data/affirmations";
import type { CustomAffirmation } from "@/lib/custom-affirmations";

export const TOTAL_DAYS = affirmations.length;

function toUtcMidnight(value: string | Date): number {
  const d = typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Day number (1..365) of a personal journey that began on `journeyStart`. */
export function currentJourneyDay(journeyStart: string | null | undefined): number {
  if (!journeyStart) return 1;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsed = Math.floor((today - toUtcMidnight(journeyStart)) / 86_400_000);
  if (elapsed < 0) return 1;
  return (elapsed % TOTAL_DAYS) + 1;
}

/** Total days elapsed since the journey began, without wrapping. */
export function daysJourneyed(journeyStart: string | null | undefined): number {
  if (!journeyStart) return 1;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsed = Math.floor((today - toUtcMidnight(journeyStart)) / 86_400_000);
  return Math.max(1, elapsed + 1);
}

export interface DailyEntry extends Affirmation {
  source: "library" | "custom";
  customId?: string;
}

interface SelectInput {
  day: number;
  focusAreas?: string[] | null | undefined;
  customs?:
    | Pick<CustomAffirmation, "id" | "category" | "affirmation" | "reflection" | "action">[]
    | undefined;
}


/**
 * Picks the affirmation for a given journey day.
 *
 * Chosen focus areas narrow the pool, and the day number indexes into it, so
 * nothing repeats until the whole pool has been seen. Every fifth day belongs
 * to the person's own affirmations when they have written any.
 */
export function selectDailyEntry({ day, focusAreas, customs }: SelectInput): DailyEntry {
  const rotation = customs ?? [];

  if (rotation.length > 0 && day % 5 === 0) {
    const pick = rotation[(Math.floor(day / 5) - 1) % rotation.length]!;
    return {
      day,
      category: (pick.category as Affirmation["category"]) ?? "Positive Energy",
      affirmation: pick.affirmation,
      reflection: pick.reflection || "What does this affirmation ask of me today?",
      action: pick.action || "Say it aloud once, then act on it once.",
      source: "custom",
      customId: pick.id,
    };
  }

  const focus = (focusAreas ?? []).filter(Boolean);
  const pool = focus.length
    ? affirmations.filter((entry) => focus.includes(entry.category))
    : affirmations;

  if (pool.length === 0) return { ...getAffirmation(day), source: "library" };

  const index = (((day - 1) % pool.length) + pool.length) % pool.length;
  return { ...pool[index]!, source: "library" };
}

export { getAffirmation };
