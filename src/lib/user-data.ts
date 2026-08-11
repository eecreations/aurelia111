import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, display_name, journey_start, reminder_enabled, reminder_time, reminder_times, reminder_voice, reminder_repeat, onboarding_complete",
        )
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export interface ReminderInput {
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_times?: string[];
  reminder_voice?: boolean;
  reminder_repeat?: number;
}

export function useUpdateReminder(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReminderInput) => {
      if (!userId) throw new Error("Sign in to set a reminder.");
      const { error } = await supabase
        .from("profiles")
        .update(input)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}



export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("day")
        .order("day", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => row.day);
    },
  });
}

export function useToggleFavorite(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ day, isFavorite }: { day: number; isFavorite: boolean }) => {
      if (!userId) throw new Error("Sign in to save affirmations.");
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("day", day);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: userId, day });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
}
