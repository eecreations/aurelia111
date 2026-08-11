import { useEffect, useRef, useState } from "react";

const PLAYLIST_ID = "6PIONZeKgpYNLMcd6YOI2d";
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const STORAGE_KEY = "aurelia:music-open";
const SEEN_KEY = "aurelia:music-seen";

/**
 * Floating Spotify dock.
 *
 * Browsers block audio until the visitor interacts with the page, so the dock
 * leads with an explicit "Tap to start music" prompt, then reports what the
 * player is doing — loading, playing, hidden, or blocked/failed to load.
 */
export function MusicDock() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [seen, setSeen] = useState(true);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSeen(localStorage.getItem(SEEN_KEY) === "1");
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setOpen(true);
      setStarted(true);
    }
  }, []);

  // If the embed never loads (blocked iframe, offline, tracking protection),
  // stop pretending it's coming and offer a way out.
  useEffect(() => {
    if (!started || loaded) return;
    stallTimer.current = setTimeout(() => setStalled(true), 6000);
    return () => {
      if (stallTimer.current) clearTimeout(stallTimer.current);
    };
  }, [started, loaded]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    localStorage.setItem(SEEN_KEY, "1");
    setSeen(true);
    if (next) {
      setStarted(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const status = !started
    ? "Browsers won't play sound until you tap — one tap starts your playlist."
    : stalled
      ? "The player couldn't load here."
      : !loaded
        ? "Loading your playlist…"
        : open
          ? "Playing. If it's silent, press play in the player above. Sign in to Spotify for full tracks — otherwise you'll hear 30-second previews."
          : "Music keeps playing while the player is hidden.";

  const label = !started ? "Tap to start music" : open ? "Hide player" : "Show player";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-40 px-6">
      <div className="pointer-events-auto mx-auto w-full max-w-md">
        {started ? (
          <div
            className={`overflow-hidden rounded-sm border border-gold/20 bg-obsidian/85 backdrop-blur-xl transition-all duration-500 ${
              open ? "mb-3 h-[152px] opacity-100" : "h-0 border-transparent opacity-0"
            }`}
            aria-hidden={!open}
          >
            <iframe
              title="Aurelia playlist"
              src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0&autoplay=1`}
              width="100%"
              height="152"
              frameBorder="0"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        ) : null}

        {open || !seen ? (
          <p
            role="status"
            className="mb-2 rounded-sm border border-gold/15 bg-obsidian/80 px-4 py-2 text-[11px] leading-relaxed text-ivory/70 backdrop-blur-xl"
          >
            {status}
            {stalled ? (
              <>
                {" "}
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold underline underline-offset-2"
                >
                  Open in Spotify
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className={`ml-auto flex h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur-xl transition-colors ${
            started
              ? "border-gold/30 bg-obsidian/85 hover:bg-gold/10"
              : "border-gold/60 bg-gold/15 hover:bg-gold/25"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rotate-45 bg-gold ${
              open && loaded && !stalled ? "animate-pulse" : started ? "opacity-50" : ""
            }`}
          />
          {label}
        </button>
      </div>
    </div>
  );
}
