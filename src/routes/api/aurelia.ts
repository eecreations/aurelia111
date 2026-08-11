import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are Aurelia — a calm, warm, deeply reassuring guide inside a daily
affirmation app. You speak like a peaceful mentor: unhurried, grounded, motivational without hype.

How you speak:
- Short paragraphs. Plain, beautiful language. No corporate tone, no emoji, no exclamation marks.
- Begin by meeting the person where they are before offering anything.
- Offer one small, doable action or a short affirmation they can repeat.
- Never diagnose or give medical, legal or financial advice. If someone is in crisis or mentions
  self-harm, gently encourage them to reach out to a trusted person or local emergency services.

You can also answer practical questions about Aurelia: a daily affirmation with a reflection and an
aligned action, 60-second breathing rituals, mood and energy check-ins, a Tree of Life that grows
with practice, a private journal, the seven-day Aurelia Path, voice recordings of your own
affirmations, wallpaper and affirmation creation in the Studio, and reminders with multiple alarms
that can be set in Settings.

Keep replies under 160 words unless the person asks for more.`;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

function textFrom(payload: unknown): string {
  const data = payload as {
    output_text?: string | string[];
    output?: { content?: { type?: string; text?: string }[] }[];
  };
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  if (Array.isArray(data.output_text)) return data.output_text.join("").trim();
  const parts: string[] = [];
  for (const item of data.output ?? []) {
    for (const part of item.content ?? []) {
      if (part.type === "output_text" && part.text) parts.push(part.text);
    }
  }
  return parts.join("").trim();
}

export const Route = createFileRoute("/api/aurelia")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI is not configured." }, { status: 500 });

        const body = (await request.json()) as { messages?: Turn[] };
        const messages = (body.messages ?? [])
          .filter((turn) => typeof turn?.content === "string" && turn.content.trim())
          .slice(-16);
        if (messages.length === 0) {
          return Response.json({ error: "Say something first." }, { status: 400 });
        }

        const response = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-5.6-sol",
            instructions: SYSTEM_PROMPT,
            input: messages.map((turn) => ({ role: turn.role, content: turn.content })),
          }),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          console.error(`Aurelia chat failed [${response.status}]: ${detail}`);
          const message =
            response.status === 429
              ? "Aurelia is resting for a moment. Try again shortly."
              : response.status === 402
                ? "The AI credits for this app have run out."
                : "Aurelia could not answer just now.";
          return Response.json({ error: message }, { status: response.status });
        }

        const reply = textFrom(await response.json());
        if (!reply) return Response.json({ error: "Aurelia had no words." }, { status: 502 });
        return Response.json({ reply });
      },
    },
  },
});
