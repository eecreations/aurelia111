import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/data/affirmations";

export type Tone = "gentle" | "bold" | "devotional";
export type TextSize = "default" | "large" | "x-large";

export interface Preferences {
  user_id: string;
  display_name: string | null;
  focus_areas: string[];
  tone: string;
  text_size: string;
  reduced_motion: boolean;
  high_contrast: boolean;
  haptics_enabled: boolean;
}

export const FOCUS_OPTIONS: Category[] = [
  "Wealth Creation",
  "Positive Energy",
  "Positive Change",
  "Inner Healing",
];

export const TONE_OPTIONS: { value: Tone; label: string; blurb: string }[] = [
  { value: "gentle", label: "Gentle", blurb: "Soft, steady encouragement" },
  { value: "bold", label: "Bold", blurb: "Direct, decisive language" },
  { value: "devotional", label: "Devotional", blurb: "Reverent and poetic" },
];

const SELECT =
  "user_id, display_name, focus_areas, tone, text_size, reduced_motion, high_contrast, haptics_enabled";

export function usePreferences(userId: string | undefined) {
  return useQuery({
    queryKey: ["preferences", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select(SELECT)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Preferences | null;
    },
  });
}

export function useSavePreferences(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Partial<Omit<Preferences, "user_id">>) => {
      if (!userId) throw new Error("Sign in to save your preferences.");
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ user_id: userId, ...input }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["preferences", userId] });
    },
  });
}

export function useCompleteOnboarding(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Sign in first.");
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

export function greeting(tone: string, name: string | null | undefined): string {
  const who = name?.trim().split(" ")[0];
  if (tone === "bold") return who ? `Let's go, ${who}.` : "Let's go.";
  if (tone === "devotional") return who ? `Peace be with you, ${who}.` : "Peace be with you.";
  return who ? `Good to see you, ${who}.` : "Good to see you.";
}
