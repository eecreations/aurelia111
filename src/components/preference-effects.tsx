import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/lib/preferences";

/**
 * Mirrors the signed-in person's accessibility choices onto the <html> element,
 * where the design tokens in styles.css pick them up.
 */
export function PreferenceEffects() {
  const { user } = useAuth();
  const { data: prefs } = usePreferences(user?.id);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-text-size", prefs?.text_size ?? "default");
    root.setAttribute("data-contrast", prefs?.high_contrast ? "high" : "normal");
    root.setAttribute("data-motion", prefs?.reduced_motion ? "reduced" : "full");

  }, [prefs?.text_size, prefs?.high_contrast, prefs?.reduced_motion]);

  return null;
}
