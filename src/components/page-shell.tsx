import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { Ornament, SilkBackdrop } from "@/components/silk";

interface Props {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  width?: "narrow" | "wide";
}

export function PageShell({ eyebrow, title, intro, children, width = "narrow" }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main
        className={`safe-top pad-safe-nav relative z-10 mx-auto w-full px-6 ${
          width === "wide" ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <header className="animate-silk pt-8 text-center">
          <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
            {eyebrow}
          </span>
          <Ornament className="mx-auto mt-4" />
          <h1 className="mt-6 font-display text-3xl italic leading-tight">{title}</h1>
          {intro ? (
            <p className="mx-auto mt-4 max-w-md font-body-serif text-lg italic leading-relaxed text-ivory/75">
              {intro}
            </p>
          ) : null}
        </header>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

export function SignInPrompt({ message }: { message: string }) {
  return (
    <div className="mt-16 text-center">
      <p className="font-body-serif text-lg italic text-ivory/80">{message}</p>
      <Link
        to="/auth"
        className="mt-8 inline-flex h-12 min-w-11 items-center justify-center rounded-sm border border-gold/50 bg-gold/10 px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20"
      >
        Sign in
      </Link>
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
      {children}
    </h2>
  );
}
