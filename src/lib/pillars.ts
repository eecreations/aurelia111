import type { Affirmation, Category } from "@/data/affirmations";

export type AureliaPillar = "rooted" | "eternal" | "growth" | "light";

export interface PillarDefinition {
  id: AureliaPillar;
  label: string;
  promise: string;
  description: string;
  legacyCategory: Category;
  symbol: string;
}

export const AURELIA_PILLARS: readonly PillarDefinition[] = [
  {
    id: "rooted",
    label: "Rooted",
    promise: "Come back to yourself.",
    description: "Grounding, calm, safety, presence, self-worth and belonging.",
    legacyCategory: "Inner Healing",
    symbol: "◉",
  },
  {
    id: "eternal",
    label: "Eternal",
    promise: "Remember what remains.",
    description: "Meaning, wisdom, gratitude, identity, love and connection.",
    legacyCategory: "Wealth Creation",
    symbol: "◇",
  },
  {
    id: "growth",
    label: "Growth",
    promise: "Become what is beginning within you.",
    description: "Resilience, confidence, healing, goals, change and possibility.",
    legacyCategory: "Positive Change",
    symbol: "♢",
  },
  {
    id: "light",
    label: "Light",
    promise: "Carry hope forward.",
    description: "Hope, courage, kindness, service, connection and giving.",
    legacyCategory: "Positive Energy",
    symbol: "✦",
  },
] as const;

export const PILLAR_IDS = AURELIA_PILLARS.map((pillar) => pillar.id);

export function getPillar(id: AureliaPillar): PillarDefinition {
  return AURELIA_PILLARS.find((pillar) => pillar.id === id) ?? AURELIA_PILLARS[0]!;
}

export function pillarForCategory(category: Category): AureliaPillar {
  if (category === "Inner Healing") return "rooted";
  if (category === "Positive Change") return "growth";
  if (category === "Wealth Creation") return "growth";
  return "light";
}

export function pillarForAffirmation(
  entry: Pick<Affirmation, "category" | "affirmation" | "reflection">,
): AureliaPillar {
  const text = `${entry.affirmation} ${entry.reflection}`.toLowerCase();

  if (/gratitude|wisdom|meaning|remember|love|purpose|belong|connection|enough/.test(text)) {
    return "eternal";
  }
  if (/hope|kind|bright|light|energy|peace|give|generous|serve|joy/.test(text)) {
    return "light";
  }
  if (/safe|ground|rest|release|heal|body|breathe|calm|need|soften|within/.test(text)) {
    return "rooted";
  }

  return pillarForCategory(entry.category);
}

export function categoryForPillar(pillar: AureliaPillar): Category {
  return getPillar(pillar).legacyCategory;
}
