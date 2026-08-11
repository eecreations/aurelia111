import { STAGES, nextStage, progressToNext, stageFor } from "@/lib/growth";

interface Props {
  points: number;
  className?: string;
}

/**
 * The Tree of Life. Each stage of growth reveals another layer of the drawing,
 * so the tree visibly changes as rituals, actions and check-ins accumulate.
 */
export function TreeOfLife({ points, className }: Props) {
  const stage = stageFor(points);
  const shown = (index: number) => stage.index >= index;

  return (
    <svg
      viewBox="0 0 240 260"
      role="img"
      aria-label={`Tree of Life at the ${stage.name} stage, ${points} growth points`}
      className={className}
    >
      <defs>
        <linearGradient id="tol-trunk" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--viridian)" />
          <stop offset="100%" stopColor="var(--viridian-lift)" />
        </linearGradient>
        <radialGradient id="tol-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="150" r="105" fill="url(#tol-glow)" />

      {/* Ground */}
      <path
        d="M40 232 Q120 218 200 232"
        stroke="var(--gold)"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Seed */}
      <ellipse
        cx="120"
        cy="226"
        rx={shown(1) ? 5 : 8}
        ry={shown(1) ? 4 : 6}
        fill="var(--gold)"
        opacity={shown(1) ? 0.5 : 1}
      />

      {/* Sprout */}
      {shown(1) ? (
        <g className="animate-leaf">
          <path
            d="M120 226 C118 208 120 198 120 190"
            stroke="url(#tol-trunk)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M120 200 C108 196 104 188 104 182 C112 184 118 190 120 200 Z" fill="var(--viridian-lift)" />
          <path d="M120 204 C132 200 136 192 136 186 C128 188 122 194 120 204 Z" fill="var(--viridian-lift)" />
        </g>
      ) : null}

      {/* Sapling trunk */}
      {shown(2) ? (
        <path
          className="animate-leaf"
          d="M114 226 C116 196 120 176 120 140 C120 128 122 120 124 112"
          stroke="url(#tol-trunk)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      ) : null}

      {/* Branches */}
      {shown(3) ? (
        <g className="animate-leaf" stroke="url(#tol-trunk)" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M120 168 C102 158 88 146 78 130" />
          <path d="M120 152 C140 144 154 132 162 116" />
          <path d="M122 130 C110 118 104 106 100 92" />
          <path d="M123 122 C136 112 144 100 148 86" />
        </g>
      ) : null}

      {/* Canopy leaves */}
      {shown(3) ? (
        <g className="animate-leaf" fill="var(--viridian-lift)" opacity="0.9">
          {[
            [78, 130],
            [162, 116],
            [100, 92],
            [148, 86],
            [124, 100],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="16" />
          ))}
        </g>
      ) : null}

      {/* Blossoms */}
      {shown(4) ? (
        <g className="animate-leaf" fill="var(--gold)">
          {[
            [84, 122],
            [156, 110],
            [104, 86],
            [144, 80],
            [124, 104],
            [118, 74],
          ].map(([cx, cy]) => (
            <circle key={`b-${cx}-${cy}`} cx={cx} cy={cy} r="3.5" opacity="0.85" />
          ))}
        </g>
      ) : null}

      {/* Golden canopy halo */}
      {shown(5) ? (
        <circle
          className="animate-gold-pulse"
          cx="120"
          cy="104"
          r="72"
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
      ) : null}
    </svg>
  );
}

export function TreeProgress({ points }: { points: number }) {
  const stage = stageFor(points);
  const upcoming = nextStage(points);
  const ratio = progressToNext(points);

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-xl italic text-ivory">{stage.name}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
          {points} pts
        </span>
      </div>
      <p className="mt-2 font-body-serif text-base italic leading-relaxed text-ivory/70">
        {stage.blurb}
      </p>
      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ivory/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        aria-label={`Progress to ${upcoming?.name ?? "full growth"}`}
      >
        <div
          className="h-full bg-gold transition-all duration-700"
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ivory/50">
        {upcoming
          ? `${upcoming.threshold - points} more points until ${upcoming.name}.`
          : "Your tree has reached its fullest stage. Keep tending it."}
      </p>
      <ol className="mt-5 flex flex-wrap gap-2">
        {STAGES.map((item) => (
          <li
            key={item.name}
            className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.16em] ${
              stage.index >= item.index
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-ivory/15 text-ivory/40"
            }`}
          >
            {item.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
