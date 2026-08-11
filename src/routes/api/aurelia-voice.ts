import { createFileRoute } from "@tanstack/react-router";

/** Aurelia's spoken voice: unhurried, warm, quietly motivating. */
const VOICE_INSTRUCTIONS =
  "Speak as a serene, compassionate guide. Slow, soft and unhurried, with warm breathiness and " +
  "gentle downward inflections. Motivating but never forceful — as if speaking to someone resting " +
  "with their eyes closed. Leave small pauses at punctuation.";

export const Route = createFileRoute("/api/aurelia-voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Voice is not configured.", { status: 500 });

        const body = (await request.json()) as { text?: string };
        const text = (body.text ?? "").trim().slice(0, 3500);
        if (!text) return new Response("Nothing to speak.", { status: 400 });

        const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text,
            voice: "shimmer",
            instructions: VOICE_INSTRUCTIONS,
            speed: 0.92,
            response_format: "mp3",
            stream_format: "audio",
          }),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          console.error(`Aurelia voice failed [${response.status}]: ${detail}`);
          return new Response("Aurelia could not speak just now.", { status: response.status });
        }

        return new Response(response.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
