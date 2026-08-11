import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { useAuth } from "@/hooks/useAuth";
import { currentJourneyDay, getAffirmation } from "@/lib/journey";
import {
  normaliseTimes,

  notificationPermission,
  requestNotificationPermission,
  showReminder,
} from "@/lib/reminders";
import { saveWallpaper } from "@/lib/share-card";
import { useProfile, useUpdateReminder } from "@/lib/user-data";
import { APP_VERSION_LABEL } from "@/lib/app-version";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Daily Reminder & Wallpaper — Aurelia" },
      {
        name: "description",
        content:
          "Choose the time you'd like your daily affirmation, and save today's card as your phone lock screen.",
      },
      { property: "og:title", content: "Daily Reminder & Wallpaper — Aurelia" },
      {
        property: "og:description",
        content:
          "Choose the time you'd like your daily affirmation, and save today's card as your phone lock screen.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const update = useUpdateReminder(user?.id);

  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [enabled, setEnabled] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const [useVoice, setUseVoice] = useState(true);
  const [permission, setPermission] = useState<string>("default");
  const [saving, setSaving] = useState(false);

  useEffect(() => setPermission(notificationPermission()), []);
  useEffect(() => {
    if (!profile) return;
    const stored = normaliseTimes([
      ...(profile.reminder_times ?? []),
      profile.reminder_time ?? null,
    ]);
    setTimes(stored.length ? stored : ["08:00"]);
    setEnabled(Boolean(profile.reminder_enabled));
    setRepeat(profile.reminder_repeat ?? 1);
    setUseVoice(profile.reminder_voice !== false);
  }, [profile]);

  const day = currentJourneyDay(profile?.journey_start);
  const entry = getAffirmation(day);

  const persist = async (next: {
    enabled?: boolean;
    times?: string[];
    repeat?: number;
    useVoice?: boolean;
    quiet?: boolean;
  }) => {
    const nextEnabled = next.enabled ?? enabled;
    const nextTimes = normaliseTimes(next.times ?? times);
    const nextRepeat = next.repeat ?? repeat;
    const nextVoice = next.useVoice ?? useVoice;

    if (nextEnabled && permission !== "granted") {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result !== "granted") {
        toast.error(
          result === "unsupported"
            ? "This browser can't show notifications."
            : "Notifications are blocked. Allow them in your browser settings.",
        );
        return;
      }
    }

    setEnabled(nextEnabled);
    setTimes(nextTimes.length ? nextTimes : ["08:00"]);
    setRepeat(nextRepeat);
    setUseVoice(nextVoice);

    update.mutate(
      {
        reminder_enabled: nextEnabled,
        reminder_time: nextTimes[0] ?? "08:00",
        reminder_times: nextTimes,
        reminder_repeat: nextRepeat,
        reminder_voice: nextVoice,
      },
      {
        onSuccess: () => {
          if (next.quiet) return;
          toast.success(
            nextEnabled
              ? `${nextTimes.length} ${nextTimes.length === 1 ? "alarm" : "alarms"} set.`
              : "Reminders turned off.",
          );
        },
        onError: (error) => toast.error((error as Error).message),
      },
    );
  };


  const handleWallpaper = async () => {
    setSaving(true);
    try {
      const result = await saveWallpaper({
        day: entry.day,
        category: entry.category,
        affirmation: entry.affirmation,
      });
      if (result === "downloaded") toast.success("Wallpaper saved to your downloads.");
      if (result === "shared") toast.success("Save it to Photos, then set it as your lock screen.");
    } catch {
      toast.error("Could not create the wallpaper. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto w-full max-w-xl px-8 pb-36 pt-16">
        <div className="animate-silk text-center">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
            Your ritual
          </span>
          <Ornament className="mt-4" />
          <h1 className="mt-6 font-display text-3xl italic">Reminder & lock screen</h1>
        </div>

        {!loading && !user ? (
          <div className="mt-16 text-center">
            <p className="font-body-serif text-lg italic text-ivory/80">
              Sign in to set your daily reminder.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="mt-14 space-y-12">
            <section className="space-y-5 border-t border-gold/20 pt-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                Daily reminder
              </h2>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm leading-relaxed text-ivory/80">
                  Gentle nudges through the day, each with today's affirmation.
                </p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label="Enable daily reminders"
                  onClick={() => void persist({ enabled: !enabled })}
                  className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors ${
                    enabled ? "border-gold bg-gold/30" : "border-gold/30 bg-ivory/5"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-gold transition-all ${
                      enabled ? "left-6" : "left-0.5 opacity-50"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-gold">
                  Your alarms
                </span>
                {times.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-sm border border-gold/10 bg-ivory/5 p-4 backdrop-blur-sm"
                  >
                    <input
                      type="time"
                      value={value}
                      aria-label={`Alarm ${index + 1}`}
                      onChange={(event) => {
                        const next = [...times];
                        next[index] = event.target.value;
                        setTimes(next);
                      }}
                      onBlur={() => void persist({ times, quiet: true })}
                      className="bg-transparent font-body-serif text-lg text-ivory outline-none [color-scheme:dark]"
                    />
                    <button
                      type="button"
                      aria-label={`Remove alarm ${index + 1}`}
                      disabled={times.length === 1}
                      onClick={() =>
                        void persist({ times: times.filter((_, i) => i !== index) })
                      }
                      className="cursor-pointer rounded-sm border border-gold/25 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-30"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    if (times.length >= 8) {
                      toast("Eight alarms is plenty for one day.");
                      return;
                    }
                    setTimes([...times, "20:00"]);
                  }}
                  className="w-full cursor-pointer rounded-sm border border-dashed border-gold/30 py-3 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
                >
                  Add another alarm
                </button>
              </div>

              <div className="space-y-3">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-gold">
                  Repeat each alarm
                </span>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      aria-pressed={repeat === count}
                      onClick={() => void persist({ repeat: count })}
                      className={`min-h-10 cursor-pointer rounded-sm border px-4 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                        repeat === count
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-gold/25 text-ivory/70 hover:bg-gold/10"
                      }`}
                    >
                      {count === 1 ? "Once" : `${count}×`}
                    </button>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-ivory/50">
                  Repeats arrive five minutes apart, so an affirmation can land more than once.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-sm border border-gold/10 bg-ivory/5 p-4 backdrop-blur-sm">
                <div>
                  <p className="text-sm text-ivory/90">Play my own recording</p>
                  <p className="mt-1 text-xs text-ivory/50">
                    Your latest voice affirmation plays with each reminder.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={useVoice}
                  aria-label="Play my voice recording with reminders"
                  onClick={() => void persist({ useVoice: !useVoice })}
                  className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors ${
                    useVoice ? "border-gold bg-gold/30" : "border-gold/30 bg-ivory/5"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-gold transition-all ${
                      useVoice ? "left-6" : "left-0.5 opacity-50"
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (permission !== "granted") {
                      toast("Turn reminders on first to allow notifications.");
                      return;
                    }
                    showReminder(day);
                  }}
                  className="cursor-pointer rounded-sm border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
                >
                  Send a test
                </button>
                <Link
                  to="/voice"
                  className="rounded-sm border border-gold/30 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
                >
                  Record my voice
                </Link>
              </div>

              <p className="text-xs leading-relaxed text-ivory/50">
                Reminders arrive while Aurelia is open in your browser, and catch up the
                next time you open it that day. For a reliable buzz on your phone, add
                Aurelia to your home screen and keep notifications allowed.
              </p>

            </section>

            <section className="space-y-5 border-t border-gold/20 pt-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                Lock screen wallpaper
              </h2>
              <p className="text-sm leading-relaxed text-ivory/80">
                Today's affirmation, rendered on emerald silk at phone size with the text
                below the clock.
              </p>
              <button
                type="button"
                onClick={handleWallpaper}
                disabled={saving}
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-8 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
              >
                {saving ? "Rendering" : "Save today's wallpaper"}
              </button>
              <ol className="space-y-2 text-xs leading-relaxed text-ivory/50">
                <li>1. Save the image to your photos.</li>
                <li>
                  2. iPhone: Photos → share → Use as Wallpaper → Set Lock Screen. Android:
                  long-press the home screen → Wallpapers → pick the image → Lock screen.
                </li>
                <li>
                  3. On iPhone you can automate the daily swap: Shortcuts → Automation →
                  Time of Day → Set Wallpaper.
                </li>
              </ol>
            </section>

            <AccessibilityPanel userId={user?.id} />

            <section className="space-y-5 border-t border-gold/20 pt-8">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                Elsewhere in Aurelia
              </h2>
              <nav aria-label="More of Aurelia" className="grid grid-cols-3 gap-3">
                {[
                  { to: "/onboarding", label: "Personalise" },
                  { to: "/voice", label: "My Voice" },
                  { to: "/studio", label: "Studio" },
                  { to: "/library", label: "Library" },
                  { to: "/saved", label: "Saved" },
                  { to: "/path", label: "The Path" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex min-h-11 items-center justify-center rounded-sm border border-gold/25 px-3 py-3 text-center text-[10px] uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </section>

            <p className="border-t border-gold/20 pt-6 text-center text-[10px] uppercase tracking-[0.18em] text-ivory/40">
              Aurelia &middot; {APP_VERSION_LABEL}
            </p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
