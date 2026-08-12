import { STAGES, stageFor } from "@/lib/growth";

const REWARDS = [
  { threshold: 3, name: "First Leaf", detail: "A new leaf appears on your Tree of Life." },
  { threshold: 10, name: "Still Water", detail: "Unlock a gentler evening audio ritual." },
  { threshold: 24, name: "Branch of Courage", detail: "A new gold branch detail appears on your tree." },
  { threshold: 48, name: "Blossom Season", detail: "Golden blossoms begin appearing in your canopy." },
  { threshold: 90, name: "Golden Canopy", detail: "Unlock the full halo and signature Aurelia share frame." },
] as const;

export function TreeUnlocks({ points }: { points: number }) {
  const stage = stageFor(points);
  return (
    <section className="mt-10 space-y-4" aria-label="Tree unlocks">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-gold/70">Milestones</p>
          <h3 className="mt-2 font-display text-2xl italic">What your practice reveals</h3>
        </div>
        <span className="text-[9px] uppercase tracking-[0.18em] text-ivory/45">{stage.name}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {REWARDS.map((reward) => {
          const unlocked = points >= reward.threshold;
          return (
            <div key={reward.name} className={`rounded-sm border p-4 ${unlocked ? "border-gold/35 bg-gold/10" : "border-ivory/10 bg-ivory/[0.03] opacity-55"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{reward.name}</p>
                <span className="text-[9px] uppercase tracking-[0.14em] text-ivory/50">{unlocked ? "Revealed" : `${reward.threshold} pts`}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ivory/65">{reward.detail}</p>
            </div>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-ivory/45">Growth remains intentionally quiet: no coins, leaderboards or pressure. Your tree changes because you showed up.</p>
    </section>
  );
}

export const TREE_REWARD_THRESHOLDS = STAGES.map((stage) => stage.threshold);
