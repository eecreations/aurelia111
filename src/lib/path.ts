import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PathStep {
  step: number;
  title: string;
  pillar: string;
  guidance: string;
  cta: { label: string; to: string };
}

/** The seven-day Aurelia Path — one pillar introduced per day. */
export const PATH_STEPS: PathStep[] = [
  {
    step: 1,
    title: "Meet your affirmation",
    pillar: "Affirmation",
    guidance:
      "Read today's affirmation slowly, three times. Once with your eyes, once aloud, once with your eyes closed.",
    cta: { label: "Open today", to: "/" },
  },
  {
    step: 2,
    title: "One minute of breath",
    pillar: "Breath",
    guidance:
      "Sixty seconds is enough to change your nervous system. Follow the ring and let your shoulders drop.",
    cta: { label: "Begin the ritual", to: "/rituals" },
  },
  {
    step: 3,
    title: "Take the aligned action",
    pillar: "Aligned Action",
    guidance:
      "Each affirmation carries one small practical action. Belief becomes real the moment you act on it.",
    cta: { label: "See today's action", to: "/" },
  },
  {
    step: 4,
    title: "Name three gratitudes",
    pillar: "Gratitude",
    guidance:
      "Gratitude is not denial. Name three true, specific things — small ones count most.",
    cta: { label: "Add gratitude", to: "/progress" },
  },
  {
    step: 5,
    title: "Notice mood and energy",
    pillar: "Tracking",
    guidance:
      "Rate today honestly. Patterns you can see are patterns you can change.",
    cta: { label: "Check in", to: "/progress" },
  },
  {
    step: 6,
    title: "Write one page",
    pillar: "Journal",
    guidance:
      "Your journal is private. Write the sentence you would not say out loud yet.",
    cta: { label: "Open journal", to: "/journal" },
  },
  {
    step: 7,
    title: "Watch your tree grow",
    pillar: "Tree of Life",
    guidance:
      "Every ritual, action and check-in feeds one tree. Seven days in, it already looks different.",
    cta: { label: "See your tree", to: "/progress" },
  },
];

export function usePathProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["path-progress", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("path_progress")
        .select("step, completed_at")
        .eq("user_id", userId!)
        .order("step", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => row.step as number);
    },
  });
}

export function useCompletePathStep(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (step: number) => {
      if (!userId) throw new Error("Sign in to walk the path.");
      const { error } = await supabase
        .from("path_progress")
        .upsert({ user_id: userId, step }, { onConflict: "user_id,step" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["path-progress", userId] });
    },
  });
}
