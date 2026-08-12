import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PathStep {
  step: number;
  title: string;
  pillar: string;
  guidance: string;
  cta: { label: string; to: string };
}

export const PATH_STEPS: PathStep[] = [
  { step: 1, title: "Root", pillar: "Arrive", guidance: "Begin with one minute of breath. Let your body know it is allowed to arrive before your mind has every answer.", cta: { label: "Breathe", to: "/rituals" } },
  { step: 2, title: "Listen", pillar: "Affirm", guidance: "Receive today's affirmation slowly. Read it once, speak it once, then notice which words stay with you.", cta: { label: "Open today", to: "/" } },
  { step: 3, title: "Choose", pillar: "Act", guidance: "Take one small aligned action. Growth becomes trustworthy when it can live in an ordinary day.", cta: { label: "See today's action", to: "/" } },
  { step: 4, title: "Remember", pillar: "Gratitude", guidance: "Name what remains good and true. Gratitude is not denial; it is remembering what difficulty cannot erase.", cta: { label: "Visit your journey", to: "/progress" } },
  { step: 5, title: "Notice", pillar: "Awareness", guidance: "Meet your mood and energy without judgment. What you can notice, you can care for with more intention.", cta: { label: "Check in", to: "/" } },
  { step: 6, title: "Reflect", pillar: "Journal", guidance: "Write one honest paragraph. You do not need to solve yourself; you only need to listen closely enough to hear yourself.", cta: { label: "Open journal", to: "/journal" } },
  { step: 7, title: "Illuminate", pillar: "Tree of Life", guidance: "See what has begun growing. Your Tree is not a score — it is a quiet record of the times you chose to return.", cta: { label: "See your tree", to: "/progress" } },
];

export function usePathProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["path-progress", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("path_progress").select("step, completed_at").eq("user_id", userId!).order("step", { ascending: true });
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
      const { error } = await supabase.from("path_progress").upsert({ user_id: userId, step }, { onConflict: "user_id,step" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["path-progress", userId] });
    },
  });
}
