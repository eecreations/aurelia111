import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "voice-affirmations";

const EXT_MIME: Record<string, string> = {
  webm: "audio/webm",
  m4a: "audio/mp4",
  mp4: "audio/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
};

export const transcribeVoiceAffirmation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id || typeof input.id !== "string") throw new Error("Missing recording id.");
    return { id: input.id };
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Transcription is not configured.");

    const { supabase } = context;

    const { data: row, error: rowError } = await supabase
      .from("voice_affirmations")
      .select("id, storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (rowError) throw new Error(rowError.message);
    if (!row) throw new Error("Recording not found.");

    const { data: file, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(row.storage_path);
    if (downloadError || !file) throw new Error("Could not read that recording.");

    const ext = (row.storage_path.split(".").pop() ?? "webm").toLowerCase();
    const mime = EXT_MIME[ext] ?? "audio/webm";

    const form = new FormData();
    form.append("model", "openai/gpt-4o-transcribe");
    form.append("file", new File([file], `recording.${ext}`, { type: mime }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      await supabase
        .from("voice_affirmations")
        .update({ transcript_status: "failed" })
        .eq("id", row.id);
      if (response.status === 429) throw new Error("Too many transcriptions right now — try again shortly.");
      if (response.status === 402) throw new Error("AI credits are exhausted — add credits to continue.");
      throw new Error(`Transcription failed [${response.status}]: ${body}`);
    }

    const result = (await response.json()) as { text?: string };
    const transcript = (result.text ?? "").trim();

    const { error: updateError } = await supabase
      .from("voice_affirmations")
      .update({
        transcript,
        transcript_status: transcript ? "done" : "failed",
      })
      .eq("id", row.id);
    if (updateError) throw new Error(updateError.message);

    return { id: row.id, transcript };
  });
