import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transcribeVoiceAffirmation } from "@/lib/transcribe.functions";

export type VoiceAffirmation = {
  id: string;
  title: string;
  storage_path: string;
  duration_seconds: number;
  created_at: string;
  transcript: string | null;
  transcript_status: string;
};

const BUCKET = "voice-affirmations";

export function useVoiceAffirmations(userId: string | undefined) {
  return useQuery({
    queryKey: ["voice-affirmations", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voice_affirmations")
        .select("id, title, storage_path, duration_seconds, created_at, transcript, transcript_status")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const rows = (data ?? []) as VoiceAffirmation[];
      const signed = await Promise.all(
        rows.map(async (row) => {
          const { data: url } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(row.storage_path, 60 * 60);
          return { ...row, url: url?.signedUrl ?? null };
        }),
      );
      return signed;
    },
  });
}

export function useUploadVoiceAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blob,
      title,
      duration,
    }: {
      blob: Blob;
      title: string;
      duration: number;
    }) => {
      if (!userId) throw new Error("Sign in to save your recordings.");
      const ext = blob.type.includes("mp4") ? "m4a" : "webm";
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: blob.type || "audio/webm" });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("voice_affirmations")
        .insert({
          user_id: userId,
          title: title.trim() || "My affirmation",
          storage_path: path,
          duration_seconds: Math.round(duration),
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["voice-affirmations", userId] });
    },
  });
}

export function useDeleteVoiceAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: { id: string; storage_path: string }) => {
      const { error } = await supabase
        .from("voice_affirmations")
        .delete()
        .eq("id", item.id);
      if (error) throw error;
      await supabase.storage.from(BUCKET).remove([item.storage_path]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["voice-affirmations", userId] });
    },
  });
}

export function useTranscribeVoiceAffirmation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => transcribeVoiceAffirmation({ data: { id } }),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["voice-affirmations", userId] });
    },
  });
}
