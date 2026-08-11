import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/lib/preferences";

export const Route = createFileRoute("/aurelia")({
  head: () => ({
    meta: [
      { title: "Speak with Aurelia — Guidance in her own voice" },
      {
        name: "description",
        content:
          "Ask Aurelia anything. She answers in a calm, motivational voice and can read her guidance aloud whenever you need it.",
      },
      { property: "og:title", content: "Speak with Aurelia" },
      {
        property: "og:description",
        content:
          "Ask Aurelia anything. She answers in a calm, motivational voice and can read her guidance aloud.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AureliaPage,
});

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const OPENERS = [
  "I'm feeling anxious about money.",
  "Help me start my morning well.",
  "How do I use the Aurelia Path?",
  "Give me an affirmation for courage.",
];

function AureliaPage() {
  const { user } = useAuth();
  const { data: prefs } = usePreferences(user?.id);
  const name = prefs?.display_name?.trim().split(" ")[0];

  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      content: name
        ? `Hello ${name}. I'm here, and there's no rush. What's present for you today?`
        : "Hello. I'm Aurelia. There's no rush here — tell me what's present for you today.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [speakAloud, setSpeakAloud] = useState(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const speak = async (text: string, index: number) => {
    audioRef.current?.pause();
    setSpeakingIndex(index);
    try {
      const response = await fetch("/api/aurelia-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error(await response.text());
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeakingIndex(null);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setSpeakingIndex(null);
      toast.error("Aurelia's voice is unavailable right now.");
    }
  };

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingIndex(null);
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || thinking) return;
    const next: Turn[] = [...turns, { role: "user", content: message }];
    setTurns(next);
    setInput("");
    setThinking(true);
    try {
      const response = await fetch("/api/aurelia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) throw new Error(data.error ?? "Aurelia is quiet.");
      setTurns((current) => {
        const withReply: Turn[] = [...current, { role: "assistant", content: data.reply! }];
        if (speakAloud) void speak(data.reply!, withReply.length - 1);
        return withReply;
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="safe-top pad-safe-nav relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-6">
        <header className="animate-silk pt-4 text-center">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
            Speak with her
          </span>
          <Ornament className="mx-auto mt-3" />
          <h1 className="mt-4 font-display text-3xl italic">Aurelia</h1>
          <button
            type="button"
            onClick={() => {
              if (speakAloud) stopSpeaking();
              setSpeakAloud(!speakAloud);
            }}
            aria-pressed={speakAloud}
            className={`mt-5 inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-[10px] uppercase tracking-[0.2em] transition-colors ${
              speakAloud
                ? "border-gold bg-gold/15 text-gold"
                : "border-gold/30 text-ivory/60 hover:bg-gold/10"
            }`}
          >
            <span className="h-1.5 w-1.5 rotate-45 bg-current" />
            {speakAloud ? "Voice on" : "Voice off"}
          </button>
        </header>

        <div
          ref={scrollRef}
          className="mt-8 flex-1 space-y-5 overflow-y-auto pb-4"
          aria-live="polite"
        >
          {turns.map((turn, index) => (
            <div
              key={index}
              className={turn.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] rounded-sm border px-4 py-3 ${
                  turn.role === "user"
                    ? "border-gold/25 bg-gold/10"
                    : "border-gold/15 bg-ivory/5 backdrop-blur-sm"
                }`}
              >
                <p
                  className={
                    turn.role === "assistant"
                      ? "whitespace-pre-wrap font-body-serif text-[1.05rem] italic leading-relaxed text-ivory/90"
                      : "whitespace-pre-wrap text-sm leading-relaxed text-ivory"
                  }
                >
                  {turn.content}
                </p>
                {turn.role === "assistant" && (
                  <button
                    type="button"
                    onClick={() =>
                      speakingIndex === index ? stopSpeaking() : void speak(turn.content, index)
                    }
                    className="mt-3 cursor-pointer text-[9px] uppercase tracking-[0.2em] text-gold/80 transition-colors hover:text-gold"
                  >
                    {speakingIndex === index ? "Stop" : "Hear her"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <p className="font-body-serif text-sm italic text-ivory/50">Aurelia is listening…</p>
          )}
        </div>

        {turns.length <= 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {OPENERS.map((opener) => (
              <button
                key={opener}
                type="button"
                onClick={() => void send(opener)}
                className="cursor-pointer rounded-full border border-gold/25 px-3 py-2 text-[10px] tracking-[0.06em] text-ivory/70 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                {opener}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="sticky bottom-28 flex items-end gap-2 rounded-sm border border-gold/20 bg-obsidian/80 p-2 backdrop-blur-xl"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Ask Aurelia anything…"
            aria-label="Message Aurelia"
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ivory outline-none placeholder:text-ivory/40"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="min-h-11 cursor-pointer rounded-sm border border-gold/50 bg-gold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
}
