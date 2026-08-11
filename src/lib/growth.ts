import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GrowthKind = "ritual" | "action" | "checkin" | "journal" | "gratitude";

export interface Stage {
  index: number;
  name: string;
  threshold: number;
  blurb: string;
}

/** Tree of Life stages, unlocked by cumulative growth points. */
export const STAGES: Stage[] = [
  { index: 0, name: "Seed", threshold: 0, blurb: "Planted. Everything begins here." },
  { index: 1, name: "Sprout", threshold: 3, blurb: "First green — your practice has taken." },
  { index: 2, name: "Sapling", threshold: 10, blurb: "Standing on its own now." },
  { index: 3, name: "Branching", threshold: 24, blurb: "Reaching outward in every direction." },
  { index: 4, name: "Blossoming", threshold: 48, blurb: "Beauty arrives after consistency." },
  { index: 5, name: "Golden Canopy", threshold: 90, blurb: "A tree that shelters others." },
];

export const GROWTH_POINTS: Record<GrowthKind, number> = {
  ritual: 2,
  action: 2,
  checkin: 1,
  journal: 1,
  gratitude: 1,
};

export function stageFor(points: number): Stage {
  let current = STAGES[0]!;
  for (const stage of STAGES) if (points >= stage.threshold) current = stage;
  return current;
}

export function nextStage(points: number): Stage | null {
  return STAGES.find((stage) => stage.threshold > points) ?? null;
}

export function progressToNext(points: number): number {
  const current = stageFor(points);
  const next = nextStage(points);
  if (!next) return 1;
  const span = next.threshold - current.threshold;
  return Math.min(1, Math.max(0, (points - current.threshold) / span));
}

export function useGrowthPoints(userId: string | undefined) {
  return useQuery({
    queryKey: ["growth", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("growth_events")
        .select("kind, points")
        .eq("user_id", userId!);
      if (error) throw error;
      const rows = data ?? [];
      const total = rows.reduce((sum, row) => sum + (row.points ?? 0), 0);
      const byKind = rows.reduce<Record<string, number>>((acc, row) => {
        acc[row.kind] = (acc[row.kind] ?? 0) + 1;
        return acc;
      }, {});
      return { total, byKind, events: rows.length };
    },
  });
}

export function useLogGrowth(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kind: GrowthKind) => {
      if (!userId) throw new Error("Sign in to grow your tree.");
      const { error } = await supabase
        .from("growth_events")
        .insert({ user_id: userId, kind, points: GROWTH_POINTS[kind] });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["growth", userId] });
    },
  });
}
