import { useEffect, useState } from "react";
import { todayKey } from "@/lib/dates";

/**
 * The current local calendar day, re-rendering by itself when midnight passes
 * (or when the tab comes back to the foreground on a new day), so a session
 * left open overnight rolls onto tomorrow's affirmation on its own.
 */
export function useTodayKey(): string {
  const [key, setKey] = useState(() => todayKey());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 2, 0);
      timer = setTimeout(() => {
        setKey(todayKey());
        scheduleMidnight();
      }, next.getTime() - now.getTime());
    };
    scheduleMidnight();

    const sync = () => setKey(todayKey());
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return key;
}
