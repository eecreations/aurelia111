export type RitualMoment = "morning" | "day" | "evening";

export interface AdaptiveRitualPlan {
  moment: RitualMoment;
  title: string;
  durationLabel: string;
  intro: string;
  steps: { label: string; detail: string; to?: string }[];
}

function currentMoment(date = new Date()): RitualMoment {
  const hour = date.getHours();
  if (hour < 11) return "morning";
  if (hour >= 18) return "evening";
  return "day";
}

export function buildAdaptiveRitual({
  mood,
  energy,
  affirmation,
  action,
  date = new Date(),
}: {
  mood?: number | null | undefined;
  energy?: number | null | undefined;
  affirmation: string;
  action: string;
  date?: Date | undefined;
}): AdaptiveRitualPlan {
  const moment = currentMoment(date);
  const lowEnergy = typeof energy === "number" && energy <= 2;
  const tenderMood = typeof mood === "number" && mood <= 2;
  const activated = typeof energy === "number" && energy >= 4;

  if (moment === "evening") {
    return {
      moment,
      title: "Close the day gently",
      durationLabel: lowEnergy ? "about 2 min" : "about 4 min",
      intro: tenderMood
        ? "Nothing needs to be solved tonight. This ritual is only here to help the day loosen its grip."
        : "Let the day become complete before you carry tomorrow into bed.",
      steps: [
        { label: "Arrive", detail: lowEnergy ? "Take one slow breath with your shoulders soft." : "Take three slow breaths and notice what is still moving inside you.", to: "/rituals" },
        { label: "Remember", detail: `Repeat: “${affirmation}”` },
        { label: "Reflect", detail: "Name one moment you handled with more grace than you noticed at the time.", to: "/journal" },
        { label: "Release", detail: "Choose one thing that can wait until tomorrow." },
      ],
    };
  }

  if (lowEnergy || tenderMood) {
    return {
      moment,
      title: "A softer ritual for today",
      durationLabel: "about 90 sec",
      intro: "Your practice can meet you at the energy you actually have. Small still counts.",
      steps: [
        { label: "Arrive", detail: "Take one long exhale before you do anything else.", to: "/rituals" },
        { label: "Affirm", detail: `Say once, slowly: “${affirmation}”` },
        { label: "Choose", detail: `Make the action smaller if needed: ${action}` },
      ],
    };
  }

  return {
    moment,
    title: activated ? "Use the energy you have" : "Your ritual for right now",
    durationLabel: activated ? "about 5 min" : "about 3 min",
    intro: activated
      ? "You have some momentum today. Give it a direction before the day chooses one for you."
      : "A little intention now can change the texture of the next few hours.",
    steps: [
      { label: "Arrive", detail: "Complete one minute of guided breathing.", to: "/rituals" },
      { label: "Affirm", detail: `Repeat: “${affirmation}”` },
      { label: "Act", detail: action },
      { label: "Check in", detail: "Return later and mark how your energy shifted." },
    ],
  };
}
