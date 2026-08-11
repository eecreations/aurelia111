import { useEffect, useRef, useState } from "react";

function formatTime(total: number) {
  if (!Number.isFinite(total) || total < 0) total = 0;
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = {
  src: string;
  /** Known duration in seconds, used until metadata loads. */
  fallbackDuration?: number;
  label?: string;
};

export function AudioPlayer({ src, fallbackDuration = 0, label }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [scrubbing, setScrubbing] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(fallbackDuration);
  }, [src, fallbackDuration]);

  const total = duration > 0 ? duration : fallbackDuration;
  const remaining = Math.max(total - current, 0);
  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  return (
    <div className="flex items-center gap-4 rounded-sm border border-gold/15 bg-obsidian/40 px-4 py-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value) && value > 0) setDuration(value);
        }}
        onTimeUpdate={(event) => {
          if (!scrubbing) setCurrent(event.currentTarget.currentTime);
        }}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        className="hidden"
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause${label ? ` ${label}` : ""}` : `Play${label ? ` ${label}` : ""}`}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/50 bg-gold/10 transition-colors hover:bg-gold/20"
      >
        {playing ? (
          <span className="flex gap-[3px]">
            <span className="block h-4 w-[3px] bg-gold" />
            <span className="block h-4 w-[3px] bg-gold" />
          </span>
        ) : (
          <span className="ml-[2px] block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-gold" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="relative flex h-4 items-center">
          <div className="absolute inset-x-0 h-[2px] rounded-full bg-ivory/15" />
          <div
            className="absolute h-[2px] rounded-full bg-gold"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={total || 1}
            step={0.01}
            value={current}
            aria-label={`Scrub${label ? ` ${label}` : " recording"}`}
            onPointerDown={() => setScrubbing(true)}
            onPointerUp={() => setScrubbing(false)}
            onChange={(event) => {
              const next = Number(event.target.value);
              setCurrent(next);
              if (audioRef.current) audioRef.current.currentTime = next;
            }}
            className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold"
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.18em] text-ivory/50">
          <span>{formatTime(current)}</span>
          <span>-{formatTime(remaining)}</span>
        </div>
      </div>
    </div>
  );
}
