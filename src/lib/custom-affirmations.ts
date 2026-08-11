import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/data/affirmations";

export interface CustomAffirmation {
  id: string;
  category: string;
  affirmation: string;
  reflection: string;
  action: string;
  in_rotation: boolean;
  created_at: string;
}

const SELECT = "id, category, affirmation, reflection, action, in_rotation, created_at";

export function useCustomAffirmations(userId: string | undefined) {
  return useQuery({
    queryKey: ["custom-affirmations", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_affirmations")
        .select(SELECT)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CustomAffirmation[];
    },
  });
}

export function useCreateCustomAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      affirmation: string;
      category: Category;
      reflection: string;
      action: string;
    }) => {
      if (!userId) throw new Error("Sign in to save your own affirmations.");
      if (!input.affirmation.trim()) throw new Error("Write your affirmation first.");
      const { error } = await supabase.from("custom_affirmations").insert({
        user_id: userId,
        affirmation: input.affirmation.trim(),
        category: input.category,
        reflection: input.reflection.trim(),
        action: input.action.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["custom-affirmations", userId] });
    },
  });
}

export function useUpdateCustomAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; in_rotation: boolean }) => {
      const { error } = await supabase
        .from("custom_affirmations")
        .update({ in_rotation: input.in_rotation })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["custom-affirmations", userId] });
    },
  });
}

export function useDeleteCustomAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("custom_affirmations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["custom-affirmations", userId] });
    },
  });
}
