import { toast } from "sonner";
import {
  usePreferences,
  useSavePreferences,
  type TextSize,
} from "@/lib/preferences";

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
  { value: "x-large", label: "Largest" },
];

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-ivory">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-ivory/50">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors ${
          checked ? "border-gold bg-gold/30" : "border-gold/30 bg-ivory/5"
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-gold transition-all ${
            checked ? "left-6" : "left-0.5 opacity-50"
          }`}
        />
      </button>
    </div>
  );
}

export function AccessibilityPanel({ userId }: { userId: string | undefined }) {
  const { data: prefs } = usePreferences(userId);
  const save = useSavePreferences(userId);

  const commit = (input: Parameters<typeof save.mutate>[0]) =>
    save.mutate(input, { onError: (error) => toast.error(error.message) });

  return (
    <section className="space-y-6 border-t border-gold/20 pt-8">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
        Accessibility
      </h2>

      <fieldset>
        <legend className="text-[10px] uppercase tracking-[0.16em] text-ivory/60">
          Text size
        </legend>
        <div className="mt-3 flex gap-2">
          {TEXT_SIZES.map((option) => {
            const active = (prefs?.text_size ?? "default") === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => commit({ text_size: option.value })}
                className={`min-h-11 flex-1 cursor-pointer rounded-sm border text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/25 text-ivory/70 hover:bg-gold/5"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Toggle
        label="Reduced motion"
        hint="Calms the silk animations and the breathing orb."
        checked={Boolean(prefs?.reduced_motion)}
        onChange={(reduced_motion) => commit({ reduced_motion })}
      />
      <Toggle
        label="High contrast"
        hint="Brightens text and borders against the obsidian."
        checked={Boolean(prefs?.high_contrast)}
        onChange={(high_contrast) => commit({ high_contrast })}
      />
      <Toggle
        label="Haptics"
        hint="Gentle vibration through the breathing ritual."
        checked={prefs?.haptics_enabled ?? true}
        onChange={(haptics_enabled) => commit({ haptics_enabled })}
      />
    </section>
  );
}
