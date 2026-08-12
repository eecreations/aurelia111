import { useRef, useState } from "react";
import { toast } from "sonner";

const SESSIONS = [
  { id: "morning", title: "Morning Aurelia", length: "2 min", description: "Begin with steadiness before the world gets loud.", script: "Good morning. Before the day asks anything of you, arrive here. Let your shoulders lower. Inhale slowly. Exhale longer. You do not need to earn your right to begin gently. Say quietly: I meet this day from my center. I choose one thing that matters, and I let enough be enough. Take one more breath. When you are ready, begin." },
  { id: "meeting", title: "Before the Meeting", length: "60 sec", description: "A compact confidence reset before you walk in.", script: "Feel both feet on the ground. Breathe in for four, and out for six. You do not need to perform certainty. You only need to be present. Say: My voice belongs in the room. I can listen clearly, speak simply, and let my preparation support me. One more breath. Go in as yourself." },
  { id: "reset", title: "After a Hard Day", length: "2 min", description: "Separate what happened from who you are.", script: "The day was difficult. That does not make you difficult. Let the jaw soften. Let the breath move all the way out. You can keep the lesson without carrying the whole weight. Say: I release what is finished. I keep what helps me grow. Tonight, nothing else is required of me but being here." },
  { id: "sleep", title: "Sleep Reflection", length: "3 min", description: "A low-stimulation closing ritual for bedtime.", script: "The day can end now. Notice one thing you completed, one thing you learned, and one thing you can release. No fixing. No planning. Breathe in softly and let the exhale lengthen. Say: I have done enough for today. Rest is part of the work of becoming. Let tomorrow remain tomorrow." },
  { id: "abundance", title: "Abundance Ritual", length: "2 min", description: "Ground ambition in sufficiency instead of urgency.", script: "Take a slow breath and notice what is already supporting you. Abundance begins with the ability to see. Say: I am available for opportunities that fit me. I can create value without abandoning peace. I can receive without gripping. Choose one practical action that opens a door, then let the rest unfold in its own time." },
  { id: "calm", title: "Sixty-Second Calm", length: "1 min", description: "A fast nervous-system reset for the middle of the day.", script: "Pause. Unclench your hands. Inhale for four. Hold for two. Exhale for six. Again. Nothing needs your panic to be solved. Say: I can move slowly enough to choose well. Take one final long exhale, and return to the next small thing." },
] as const;

export function GuidedAudioCollection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async (session: (typeof SESSIONS)[number]) => {
    if (playing === session.id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    audioRef.current?.pause();
    setLoading(session.id);
    try {
      const response = await fetch("/api/aurelia-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: session.script }) });
      if (!response.ok) throw new Error("Audio unavailable");
      const url = URL.createObjectURL(await response.blob());
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setPlaying(null); URL.revokeObjectURL(url); };
      await audio.play();
      setPlaying(session.id);
    } catch {
      toast.error("That audio ritual is unavailable right now.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-gold/70">Aurelia audio</p>
        <h2 className="mt-2 font-display text-2xl italic">Guided moments</h2>
        <p className="mt-2 text-sm leading-relaxed text-ivory/60">Short spoken rituals for the moments when reading feels like one thing too many.</p>
      </div>
      <div className="grid gap-3">
        {SESSIONS.map((session) => (
          <button key={session.id} type="button" onClick={() => void play(session)} className="flex w-full cursor-pointer items-center gap-4 rounded-sm border border-gold/15 bg-ivory/5 p-4 text-left transition-colors hover:border-gold/35 hover:bg-gold/10">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">{loading === session.id ? "…" : playing === session.id ? "Ⅱ" : "▶"}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3"><span className="font-body-serif text-base italic text-ivory">{session.title}</span><span className="text-[9px] uppercase tracking-[0.15em] text-gold/70">{session.length}</span></span>
              <span className="mt-1 block text-xs leading-relaxed text-ivory/55">{session.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
