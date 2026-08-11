import { useCallback, useEffect, useRef, useState } from "react";

const PHASES = [
  { name: "Breathe in", seconds: 4 },
  { name: "Hold", seconds: 2 },
  { name: "Breathe out", seconds: 6 },
] as const;

const CYCLE = PHASES.reduce((sum, phase) => sum + phase.seconds, 0); // 12s
const TOTAL = 60;

interface Props {
  onComplete: (seconds: number) => void;
}

/** A sixty-second guided breath: four in, two held, six out — five times. */
export function BreathRitual({ onComplete }: Props) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    if (!running) return;
    const started = Date.now() - elapsed * 1000;
    const id = window.setInterval(() => {
      setElapsed(Math.min(TOTAL, (Date.now() - started) / 1000));
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (elapsed < TOTAL || completed.current) return;
    completed.current = true;
    setRunning(false);
    onComplete(TOTAL);
  }, [elapsed, onComplete]);

  const reset = useCallback(() => {
    completed.current = false;
    setElapsed(0);
    setRunning(true);
  }, []);

  const withinCycle = elapsed % CYCLE;
  let phaseIndex = 0;
  let phaseStart = 0;
  for (const [index, phase] of PHASES.entries()) {
    if (withinCycle < phaseStart + phase.seconds) {
      phaseIndex = index;
      break;
    }
    phaseStart += phase.seconds;
    phaseIndex = index;
  }
  const phase = PHASES[phaseIndex]!;
  const phaseProgress = Math.min(1, (withinCycle - phaseStart) / phase.seconds);

  const scale =
    phase.name === "Breathe in"
      ? 0.65 + phaseProgress * 0.35
      : phase.name === "Hold"
        ? 1
        : 1 - phaseProgress * 0.35;

  const cyclesDone = Math.floor(elapsed / CYCLE);
  const finished = elapsed >= TOTAL;
  const remaining = Math.ceil(TOTAL - elapsed);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute h-52 w-52 rounded-full border border-gold/25"
        />
        <span
          aria-hidden="true"
          className="absolute h-52 w-52 rounded-full bg-viridian/40 transition-transform duration-200 ease-linear"
          style={{ transform: `scale(${running ? scale : 0.72})` }}
        />
        <span
          aria-hidden="true"
          className="absolute h-52 w-52 rounded-full border border-gold/50 transition-transform duration-200 ease-linear"
          style={{ transform: `scale(${running ? scale : 0.72})` }}
        />
        <div className="relative text-center" aria-live="polite">
          <p className="font-display text-2xl italic text-ivory">
            {finished ? "Complete" : running ? phase.name : "Ready"}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-gold">
            {finished
              ? "Well breathed"
              : running
                ? `${remaining}s left`
                : "Sixty seconds"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={`h-1.5 w-1.5 rotate-45 ${
              cyclesDone > index || finished ? "bg-gold" : "border border-ivory/40"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {!running && !finished ? (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="inline-flex h-12 min-w-11 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
          >
            {elapsed > 0 ? "Resume" : "Begin"}
          </button>
        ) : null}

        {running ? (
          <button
            type="button"
            onClick={() => setRunning(false)}
            className="inline-flex h-12 min-w-11 items-center justify-center rounded-sm border border-gold/30 px-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/10"
          >
            Pause
          </button>
        ) : null}

        {elapsed > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 min-w-11 items-center justify-center rounded-sm border border-ivory/20 px-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory/70 transition-colors hover:bg-ivory/10"
          >
            Start again
          </button>
        ) : null}
      </div>
    </div>
  );
}
