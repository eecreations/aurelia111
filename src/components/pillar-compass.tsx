import { AURELIA_PILLARS, type AureliaPillar } from "@/lib/pillars";

interface Props {
  value: AureliaPillar;
  onChange: (value: AureliaPillar) => void;
  compact?: boolean;
}

export function PillarCompass({ value, onChange, compact = false }: Props) {
  return (
    <div className="w-full" aria-label="Aurelia compass">
      <div className="grid grid-cols-4 gap-2">
        {AURELIA_PILLARS.map((pillar) => {
          const active = value === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              aria-pressed={active}
              aria-label={`${pillar.label}: ${pillar.promise}`}
              onClick={() => onChange(pillar.id)}
              className={`group flex min-h-16 flex-col items-center justify-center rounded-sm border px-1.5 py-3 text-center transition-all ${
                active
                  ? "border-gold/70 bg-gold/10 text-gold shadow-[0_0_30px_rgba(212,175,55,0.08)]"
                  : "border-gold/15 bg-ivory/[0.025] text-ivory/55 hover:border-gold/35 hover:text-ivory"
              }`}
            >
              <span
                className={`font-display text-lg leading-none ${active ? "text-gold" : "text-gold/55"}`}
                aria-hidden="true"
              >
                {pillar.symbol}
              </span>
              <span className="mt-2 text-[8px] font-semibold uppercase tracking-[0.15em]">
                {pillar.label}
              </span>
            </button>
          );
        })}
      </div>
      {!compact ? (
        <p className="mt-4 text-center font-body-serif text-base italic leading-relaxed text-ivory/65">
          {AURELIA_PILLARS.find((pillar) => pillar.id === value)?.promise}
        </p>
      ) : null}
    </div>
  );
}
