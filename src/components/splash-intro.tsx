import { useEffect, useRef, useState } from "react";
import splashVideo from "@/assets/aurelia-intro.mp4.asset.json";
import splashPoster from "@/assets/aurelia-intro-poster.jpg.asset.json";

/** Longest we ever hold the intro, in case the video stalls. */
const MAX_MS = 9000;
const FADE_MS = 900;

export function SplashIntro() {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [reduced, setReduced] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isReduced = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    const skipTimer = window.setTimeout(() => setShowSkip(true), 900);
    const failsafe = window.setTimeout(() => setLeaving(true), isReduced ? 900 : MAX_MS);
    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(failsafe);
    };
  }, [mounted]);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(t);
  }, [leaving]);

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  if (!mounted || gone) return null;

  return (
    <div
      onClick={() => setLeaving(true)}
      className={`fixed inset-0 z-[100] overflow-hidden bg-obsidian transition-opacity ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden="true"
    >
      {/* Ambient fill so the portrait frame never letterboxes on desktop. */}
      <img
        src={splashPoster.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
      />
      <div className="absolute inset-0 bg-obsidian/40" />

      <div className="relative flex h-full w-full items-center justify-center">
        {reduced ? (
          <img
            src={splashPoster.url}
            alt=""
            className="h-full w-full object-cover sm:h-full sm:w-auto sm:object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={splashVideo.url}
            poster={splashPoster.url}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onEnded={() => setLeaving(true)}
            onError={() => setLeaving(true)}
            className="h-full w-full object-cover sm:h-full sm:w-auto sm:max-w-none sm:object-contain"
          />
        )}
      </div>

      {/* Soft vignette to marry the video into the app's palette. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,18,16,0.85)_100%)]" />

      {showSkip && !leaving && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLeaving(true);
          }}
          className="safe-bottom absolute bottom-8 right-6 rounded-sm border border-gold/40 bg-obsidian/50 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:bg-gold/15"
        >
          Skip
        </button>
      )}
    </div>
  );
}
