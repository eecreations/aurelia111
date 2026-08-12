import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BreathRitual } from "@/components/breath-ritual";
import { GuidedAudioCollection } from "@/components/guided-audio-collection";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { useAuth } from "@/hooks/useAuth";
import { useLogGrowth } from "@/lib/growth";
import { currentJourneyDay, selectDailyEntry } from "@/lib/journey";
import { useCustomAffirmations } from "@/lib/custom-affirmations";
import { usePreferences } from "@/lib/preferences";
import { useProfile } from "@/lib/user-data";
import { useSaveCheckin, useTodayCheckin } from "@/lib/tracking";

export const Route = createFileRoute("/rituals")({
  head: () => ({
    meta: [
      { title: "Sixty-Second Breathing Ritual — Aurelia" },
      {
        name: "description",
        content:
          "A one-minute guided breath — four in, two held, six out — to settle your body before you speak today's affirmation.",
      },
      { property: "og:title", content: "Sixty-Second Breathing Ritual — Aurelia" },
      {
        property: "og:description",
        content:
          "A one-minute guided breath to settle your body before you speak today's affirmation.",
      },
    ],
  }),
  component: RitualsPage,
});

function RitualsPage() {
  const { user, loading } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: prefs } = usePreferences(user?.id);
  const { data: customs } = useCustomAffirmations(user?.id);
  const { data: checkin } = useTodayCheckin(user?.id);
  const saveCheckin = useSaveCheckin(user?.id);
  const logGrowth = useLogGrowth(user?.id);
  const [done, setDone] = useState(false);

  const day = currentJourneyDay(profile?.journey_start);
  const entry = selectDailyEntry({
    day,
    focusAreas: prefs?.focus_areas,
    customs: (customs ?? []).filter((item) => item.in_rotation),
  });

  const handleComplete = useCallback(
    (seconds: number) => {
      setDone(true);
      if (!user) {
        toast.success("Beautifully done. Sign in to keep a record of your rituals.");
        return;
      }
      saveCheckin.mutate(
        { addRitualSeconds: seconds, affirmation_day: day },
        {
          onSuccess: () => {
            logGrowth.mutate("ritual");
            toast.success("Ritual complete — your tree grew.");
          },
          onError: (error) => toast.error((error as Error).message),
        },
      );
    },
    [user, saveCheckin, logGrowth, day],
  );

  return (
    <PageShell
      eyebrow="Breathing ritual"
      title="Sixty seconds of breath"
      intro="Four counts in, two held, six out. Five rounds is one minute — enough to change how the rest of the day lands."
    >
      {!loading && !user ? (
        <>
          <div className="mt-12">
            <BreathRitual onComplete={handleComplete} />
          </div>
          <SignInPrompt message="Sign in to record your rituals and grow your Tree of Life." />
        </>
      ) : (
        <div className="mt-12 space-y-12">
          <BreathRitual onComplete={handleComplete} />

          <section className="gilded-panel space-y-3 rounded-sm p-6">
            <SectionHeading>Carry this with you</SectionHeading>
            <p className="font-body-serif text-lg italic leading-relaxed text-ivory/90">
              “{entry.affirmation}”
            </p>
            <p className="text-sm leading-relaxed text-ivory/70">{entry.action}</p>
          </section>

          <section className="border-t border-gold/20 pt-8">
            <GuidedAudioCollection />
          </section>

          <section className="space-y-3 border-t border-gold/20 pt-8">
            <SectionHeading>Today</SectionHeading>
            <p className="text-sm leading-relaxed text-ivory/70">
              {checkin?.ritual_seconds
                ? `${Math.round(checkin.ritual_seconds / 60)} minute${
                    checkin.ritual_seconds >= 120 ? "s" : ""
                  } of breath recorded today.`
                : done
                  ? "Recorded."
                  : "No breath recorded yet today."}
            </p>
          </section>
        </div>
      )}
    </PageShell>
  );
}
