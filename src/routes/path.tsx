import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell, SignInPrompt } from "@/components/page-shell";
import { useAuth } from "@/hooks/useAuth";
import { PATH_STEPS, useCompletePathStep, usePathProgress } from "@/lib/path";

export const Route = createFileRoute("/path")({
  head: () => ({
    meta: [
      { title: "The Seven-Day Aurelia Path — Aurelia" },
      {
        name: "description",
        content:
          "Seven days, seven pillars: affirmation, breath, aligned action, gratitude, tracking, journal and the Tree of Life.",
      },
      { property: "og:title", content: "The Seven-Day Aurelia Path — Aurelia" },
      {
        property: "og:description",
        content:
          "Seven days, seven pillars — a guided introduction to the whole practice.",
      },
    ],
  }),
  component: PathPage,
});

function PathPage() {
  const { user, loading } = useAuth();
  const { data: completed } = usePathProgress(user?.id);
  const complete = useCompletePathStep(user?.id);
  const done = new Set(completed ?? []);
  const nextStep = PATH_STEPS.find((step) => !done.has(step.step));

  return (
    <PageShell
      eyebrow="The Aurelia Path"
      title="Seven days, seven pillars"
      intro="One practice a day for a week. By the seventh you will have used every part of Aurelia once."
    >
      {!loading && !user ? (
        <SignInPrompt message="Sign in to walk the path and keep your place." />
      ) : (
        <>
          <p className="mt-10 text-center text-[10px] uppercase tracking-[0.2em] text-gold">
            {done.size} of {PATH_STEPS.length} complete
          </p>

          <ol className="mt-8 space-y-4">
            {PATH_STEPS.map((step) => {
              const isDone = done.has(step.step);
              const isNext = nextStep?.step === step.step;
              return (
                <li
                  key={step.step}
                  className={`rounded-sm border p-5 transition-colors ${
                    isDone
                      ? "border-gold/45 bg-gold/5"
                      : isNext
                        ? "border-gold/30 bg-ivory/5"
                        : "border-ivory/12"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      Day {step.step} · {step.pillar}
                    </span>
                    {isDone ? (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
                        Done
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-display text-xl italic">{step.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                    {step.guidance}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      to={step.cta.to}
                      className="inline-flex h-11 min-w-11 items-center justify-center rounded-sm border border-gold/40 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
                    >
                      {step.cta.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        complete.mutate(step.step, {
                          onSuccess: () => toast.success(`Day ${step.step} marked complete.`),
                          onError: (error) => toast.error((error as Error).message),
                        })
                      }
                      disabled={isDone}
                      className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border border-ivory/20 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/75 transition-colors hover:bg-ivory/10 disabled:cursor-default disabled:opacity-40"
                    >
                      {isDone ? "Complete" : "Mark complete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </PageShell>
  );
}
