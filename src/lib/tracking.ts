import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, todayKey } from "@/lib/dates";

export type ActionStatus = "pending" | "done" | "skipped" | "carried";

export interface Checkin {
  id: string;
  entry_date: string;
  mood: number | null;
  energy: number | null;
  action_status: string;
  ritual_seconds: number;
  affirmation_day: number | null;
}

export const MOOD_LABELS = ["Heavy", "Low", "Steady", "Bright", "Radiant"] as const;
export const ENERGY_LABELS = ["Depleted", "Tired", "Even", "Charged", "Alight"] as const;

const SELECT = "id, entry_date, mood, energy, action_status, ritual_seconds, affirmation_day";

export function useTodayCheckin(userId: string | undefined) {
  const date = todayKey();
  return useQuery({
    queryKey: ["checkin", userId, date],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select(SELECT)
        .eq("user_id", userId!)
        .eq("entry_date", date)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Checkin | null;
    },
  });
}

export function useCheckinHistory(userId: string | undefined, days = 30) {
  const since = addDays(todayKey(), -(days - 1));
  return useQuery({
    queryKey: ["checkin-history", userId, days],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select(SELECT)
        .eq("user_id", userId!)
        .gte("entry_date", since)
        .order("entry_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Checkin[];
    },
  });
}

export function useAllCheckins(userId: string | undefined) {
  return useQuery({
    queryKey: ["checkin-all", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_checkins")
        .select(SELECT)
        .eq("user_id", userId!)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Checkin[];
    },
  });
}

export function useSaveCheckin(userId: string | undefined) {
  const queryClient = useQueryClient();
  const date = todayKey();

  return useMutation({
    mutationFn: async (
      input: Partial<Pick<Checkin, "mood" | "energy" | "action_status" | "affirmation_day">> & {
        addRitualSeconds?: number;
      },
    ) => {
      if (!userId) throw new Error("Sign in to track your day.");
      const { addRitualSeconds, ...rest } = input;

      const { data: existing, error: readError } = await supabase
        .from("daily_checkins")
        .select("id, ritual_seconds")
        .eq("user_id", userId)
        .eq("entry_date", date)
        .maybeSingle();
      if (readError) throw readError;

      const ritual_seconds = (existing?.ritual_seconds ?? 0) + (addRitualSeconds ?? 0);

      const { error } = await supabase.from("daily_checkins").upsert(
        { user_id: userId, entry_date: date, ...rest, ritual_seconds },
        { onConflict: "user_id,entry_date" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checkin", userId, date] });
      void queryClient.invalidateQueries({ queryKey: ["checkin-history", userId] });
      void queryClient.invalidateQueries({ queryKey: ["checkin-all", userId] });
    },
  });
}

export interface Gratitude {
  id: string;
  entry_date: string;
  position: number;
  content: string;
}

export function useGratitude(userId: string | undefined, date = todayKey()) {
  return useQuery({
    queryKey: ["gratitude", userId, date],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gratitude_entries")
        .select("id, entry_date, position, content")
        .eq("user_id", userId!)
        .eq("entry_date", date)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Gratitude[];
    },
  });
}

export function useSaveGratitude(userId: string | undefined) {
  const queryClient = useQueryClient();
  const date = todayKey();

  return useMutation({
    mutationFn: async (entries: string[]) => {
      if (!userId) throw new Error("Sign in to save your gratitude.");
      const rows = entries
        .map((content, index) => ({
          user_id: userId,
          entry_date: date,
          position: index + 1,
          content: content.trim(),
        }))
        .filter((row) => row.content.length > 0);

      const { error: clearError } = await supabase
        .from("gratitude_entries")
        .delete()
        .eq("user_id", userId)
        .eq("entry_date", date);
      if (clearError) throw clearError;

      if (rows.length === 0) return 0;

      const { error } = await supabase.from("gratitude_entries").insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["gratitude", userId, date] });
    },
  });
}

export function useGratitudeCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["gratitude-count", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("gratitude_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId!);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

/** Longest run of consecutive days ending today (or yesterday). */
export function currentStreak(checkins: Checkin[]): number {
  const dates = new Set(checkins.map((c) => c.entry_date));
  const today = todayKey();
  let cursor = dates.has(today) ? today : addDays(today, -1);
  if (!dates.has(cursor)) return 0;
  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(checkins: Checkin[]): number {
  const dates = [...new Set(checkins.map((c) => c.entry_date))].sort();
  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of dates) {
    run = previous && addDays(previous, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }
  return best;
}
