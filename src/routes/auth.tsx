import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Ornament, SilkBackdrop } from "@/components/silk";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Begin Your Journey — Aurelia" },
      {
        name: "description",
        content:
          "Create your Aurelia account to sync your 365-day affirmation journey and favorites.",
      },
      { property: "og:title", content: "Begin Your Journey — Aurelia" },
      {
        property: "og:description",
        content:
          "Create your Aurelia account to sync your 365-day affirmation journey and favorites.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in didn't complete.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-obsidian text-ivory">
      <SilkBackdrop />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-8 py-16">
        <header className="text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold/80">
            Aurelia
          </span>
          <Ornament className="mt-4" />
          <h1 className="animate-silk mt-8 font-display text-3xl italic leading-tight">
            {sent
              ? "Check your inbox"
              : mode === "signup"
                ? "Begin your journey"
                : "Welcome back"}
          </h1>
        </header>

        {sent ? (
          <p className="mt-8 text-center font-body-serif text-lg italic leading-relaxed text-ivory/80">
            We sent a confirmation link to {email}. Open it to start day one.
          </p>
        ) : (
          <>
            <form onSubmit={submit} className="mt-10 space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-sm border border-gold/20 bg-ivory/5 px-4 py-3 text-sm placeholder:text-ivory/35 focus:border-gold/50 focus:outline-none"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-sm border border-gold/20 bg-ivory/5 px-4 py-3 text-sm placeholder:text-ivory/35 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="h-12 w-full rounded-sm border border-gold/50 bg-gold/15 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-50"
              >
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gold/15" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-ivory/40">
                or
              </span>
              <div className="h-px flex-1 bg-gold/15" />
            </div>

            <button
              type="button"
              onClick={google}
              disabled={busy}
              className="h-12 w-full rounded-sm border border-gold/20 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-ivory/5 disabled:opacity-50"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-ivory"
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
