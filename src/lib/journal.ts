import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { todayKey } from "@/lib/dates";

export interface JournalEntry {
  id: string;
  entry_date: string;
  title: string;
  body: string;
  mood_tag: string | null;
  affirmation_day: number | null;
  created_at: string;
}

export const MOOD_TAGS = [
  "Grateful",
  "Hopeful",
  "Tender",
  "Restless",
  "Focused",
  "Tired",
] as const;

const SELECT = "id, entry_date, title, body, mood_tag, affirmation_day, created_at";

export function useJournalEntries(userId: string | undefined) {
  return useQuery({
    queryKey: ["journal", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select(SELECT)
        .eq("user_id", userId!)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JournalEntry[];
    },
  });
}

export interface JournalDraft {
  id?: string | undefined;
  entry_date?: string | undefined;

  title: string;
  body: string;
  mood_tag: string | null;
  affirmation_day: number | null;
}

export function useSaveJournalEntry(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: JournalDraft) => {
      if (!userId) throw new Error("Sign in to write in your journal.");
      if (!draft.body.trim() && !draft.title.trim()) {
        throw new Error("Write something first.");
      }

      const payload = {
        user_id: userId,
        entry_date: draft.entry_date ?? todayKey(),
        title: draft.title.trim(),
        body: draft.body.trim(),
        mood_tag: draft.mood_tag,
        affirmation_day: draft.affirmation_day,
      };

      if (draft.id) {
        const { error } = await supabase
          .from("journal_entries")
          .update(payload)
          .eq("id", draft.id);
        if (error) throw error;
        return { id: draft.id, created: false };
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      return { id: data.id as string, created: true };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["journal", userId] });
    },
  });
}

export function useDeleteJournalEntry(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["journal", userId] });
    },
  });
}
