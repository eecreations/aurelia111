import { useState } from "react";
import { toast } from "sonner";
import { Ornament } from "@/components/silk";
import type { Affirmation } from "@/data/affirmations";
import { prettyDate, todayKey } from "@/lib/dates";
import { downloadShareCard, saveWallpaper } from "@/lib/share-card";


interface Props {
  entry: Affirmation;
  isFavorite: boolean;
  canFavorite: boolean;
  onToggleFavorite: () => void;
}

export function AffirmationCard({
  entry,
  isFavorite,
  canFavorite,
  onToggleFavorite,
}: Props) {
  const [sharing, setSharing] = useState(false);
  const [wallpapering, setWallpapering] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      await downloadShareCard({
        day: entry.day,
        category: entry.category,
        affirmation: entry.affirmation,
      });
      toast.success("Your affirmation card was saved.");
    } catch {
      toast.error("Could not create the card. Try again.");
    } finally {
      setSharing(false);
    }
  };

  const handleWallpaper = async () => {
    setWallpapering(true);
    try {
      const result = await saveWallpaper({
        day: entry.day,
        category: entry.category,
        affirmation: entry.affirmation,
      });
      if (result === "downloaded") toast.success("Wallpaper saved — set it as your lock screen.");
      if (result === "shared") toast.success("Save it to Photos, then set it as your lock screen.");
    } catch {
      toast.error("Could not create the wallpaper. Try again.");
    } finally {
      setWallpapering(false);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="animate-silk space-y-2 text-center">
        <span className="block min-h-[1em] text-[10px] font-medium uppercase tracking-[0.3em] text-gold/80">
          {today ? prettyDate(today) : ""}
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-gold/60">
          {entry.category}
        </span>
        <Ornament />
      </div>


      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center py-12 text-center">
        <div className="mb-8 h-2 w-2 rotate-45 bg-gold" />
        <h1 className="animate-silk text-balance px-2 font-display text-[2rem] italic leading-[1.18] sm:text-4xl">
          “{entry.affirmation}”
        </h1>
        <div className="mt-8 h-2 w-2 rotate-45 bg-gold" />
      </div>

      <div className="animate-silk w-full max-w-sm space-y-8">
        <div className="space-y-3 border-t border-gold/20 pt-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Reflection
          </h2>
          <p className="font-body-serif text-lg italic leading-relaxed text-ivory/90">
            {entry.reflection}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Daily Action
          </h2>
          <div className="rounded-sm border border-gold/10 bg-ivory/5 p-4 backdrop-blur-sm">
            <p className="text-sm leading-relaxed">{entry.action}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() =>
              canFavorite
                ? onToggleFavorite()
                : toast("Sign in to keep your favorites.")
            }
            className="group flex cursor-pointer items-center gap-2"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                isFavorite
                  ? "border-gold bg-gold/20"
                  : "border-gold/30 group-hover:bg-gold/10"
              }`}
            >
              <span className="text-xs text-gold">{isFavorite ? "❤" : "♡"}</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
              {isFavorite ? "Saved" : "Favorite"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="group flex cursor-pointer items-center gap-2 disabled:opacity-50"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
              {sharing ? "Rendering" : "Share"}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 transition-colors group-hover:bg-gold/10">
              <span className="text-xs text-gold">↗</span>
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleWallpaper}
          disabled={wallpapering}
          className="w-full cursor-pointer rounded-sm border border-gold/30 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          {wallpapering ? "Rendering" : "Set as lock screen"}
        </button>
      </div>
    </div>
  );
}
