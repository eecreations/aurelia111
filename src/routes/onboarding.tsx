import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionHeading, SignInPrompt } from "@/components/page-shell";
import { useAuth } from "@/hooks/useAuth";
import {
  FOCUS_OPTIONS,
  TONE_OPTIONS,
  useCompleteOnboarding,
  useSavePreferences,
  type Tone,
} from "@/lib/preferences";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Begin Your Ritual — Aurelia" },
      {
        name: "description",
        content:
          "Tell Aurelia your name, your focus areas and the tone you want, and your daily affirmations adapt to you.",
      },
      { property: "og:title", content: "Begin Your Ritual — Aurelia" },
      {
        property: "og:description",
        content:
          "Tell Aurelia your name, your focus areas and the tone you want, and your daily affirmations adapt to you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const savePreferences = useSavePreferences(user?.id);
  const complete = useCompleteOnboarding(user?.id);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [tone, setTone] = useState<Tone>("gentle");

  const finish = () => {
    savePreferences.mutate(
      { display_name: name.trim() || null, focus_areas: focus, tone },
      {
        onSuccess: () => {
          complete.mutate(undefined, {
            onSuccess: () => {
              toast.success("Your ritual is ready.");
              void navigate({ to: "/" });
            },
            onError: (error) => toast.error(error.message),
          });
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  if (loading) {
    return (
      <PageShell eyebrow="Welcome" title="Begin your ritual">
        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/50">
          Loading
        </p>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell eyebrow="Welcome" title="Begin your ritual">
        <SignInPrompt message="Sign in to set up your personal ritual." />
      </PageShell>
    );
  }

  const steps = [
    {
      heading: "What shall Aurelia call you?",
      body: (
        <label className="block">
          <span className="sr-only">Your name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="h-12 w-full rounded-sm border border-gold/20 bg-ivory/5 px-4 text-center font-body-serif text-lg italic text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
          />
        </label>
      ),
    },
    {
      heading: "What are you calling in?",
      body: (
        <div className="flex flex-wrap justify-center gap-2">
          {FOCUS_OPTIONS.map((option) => {
            const active = focus.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setFocus((current) =>
                    active ? current.filter((item) => item !== option) : [...current, option],
                  )
                }
                className={`min-h-11 cursor-pointer rounded-sm border px-4 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/25 text-ivory/70 hover:bg-gold/5"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      heading: "How should Aurelia speak to you?",
      body: (
        <div className="space-y-3">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={tone === option.value}
              onClick={() => setTone(option.value)}
              className={`w-full cursor-pointer rounded-sm border px-4 py-4 text-left transition-colors ${
                tone === option.value
                  ? "border-gold bg-gold/10"
                  : "border-gold/20 hover:bg-gold/5"
              }`}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                {option.label}
              </span>
              <span className="mt-1 block text-sm text-ivory/70">{option.blurb}</span>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step]!;
  const last = step === steps.length - 1;
  const busy = savePreferences.isPending || complete.isPending;

  return (
    <PageShell eyebrow={`Step ${step + 1} of ${steps.length}`} title="Begin your ritual">
      <div className="mt-10">
        <div
          className="h-px w-full bg-ivory/15"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-label="Onboarding progress"
        >
          <div
            className="h-px bg-gold transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <section className="animate-silk mt-12 space-y-6">
        <SectionHeading>{current.heading}</SectionHeading>
        {current.body}
      </section>

      <div className="mt-12 flex gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value - 1)}
            className="min-h-12 flex-1 cursor-pointer rounded-sm border border-gold/25 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:bg-gold/5"
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => (last ? finish() : setStep((value) => value + 1))}
          className="min-h-12 flex-1 cursor-pointer rounded-sm border border-gold/50 bg-gold/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
        >
          {last ? (busy ? "Saving" : "Enter Aurelia") : "Continue"}
        </button>
      </div>
    </PageShell>
  );
}
