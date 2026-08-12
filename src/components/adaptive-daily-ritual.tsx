import { Link } from "@tanstack/react-router";
import { buildAdaptiveRitual } from "@/lib/daily-ritual";

export function AdaptiveDailyRitual({
  mood,
  energy,
  affirmation,
  action,
}: {
  mood?: number | null;
  energy?: number | null;
  affirmation: string;
  action: string;
}) {
  const plan = buildAdaptiveRitual({ mood, energy, affirmation, action });

  return (
    <section className="mt-10 w-full max-w-xl rounded-sm border border-gold/20 bg-ivory/5 p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/80">Adaptive ritual</p>
          <h2 className="mt-2 font-display text-2xl italic text-ivory">{plan.title}</h2>
        </div>
        <span className="shrink-0 rounded-full border border-gold/25 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-gold">{plan.durationLabel}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ivory/65">{plan.intro}</p>
      <ol className="mt-6 space-y-3">
        {plan.steps.map((step, index) => (
          <li key={step.label} className="flex gap-4 border-t border-gold/10 pt-3 first:border-0 first:pt-0">
            <span className="font-display text-lg italic text-gold/70">0{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{step.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ivory/75">{step.detail}</p>
              {step.to ? <Link to={step.to} className="mt-2 inline-block text-[9px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold">Open</Link> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
