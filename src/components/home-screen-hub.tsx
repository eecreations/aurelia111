import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }>; }

export function HomeScreenHub() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
    const handler = (event: Event) => { event.preventDefault(); setInstallEvent(event as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <section className="mt-10 w-full max-w-xl rounded-sm border border-gold/15 bg-ivory/[0.04] p-5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[0.2em] text-gold/70">Beyond the app</p><h2 className="mt-2 font-display text-xl italic">Keep Aurelia close</h2></div><span className="h-2 w-2 rotate-45 bg-gold/70" /></div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/settings" className="rounded-sm border border-gold/20 p-3 text-xs leading-relaxed text-ivory/70 hover:bg-gold/10"><span className="block text-[9px] uppercase tracking-[0.16em] text-gold">Lock screen</span><span className="mt-1 block">Wallpaper + daily reminders</span></Link>
        <Link to="/studio" className="rounded-sm border border-gold/20 p-3 text-xs leading-relaxed text-ivory/70 hover:bg-gold/10"><span className="block text-[9px] uppercase tracking-[0.16em] text-gold">Share</span><span className="mt-1 block">Story, square and wallpaper cards</span></Link>
      </div>
      {installEvent ? <button type="button" onClick={async () => { await installEvent.prompt(); await installEvent.userChoice; setInstallEvent(null); }} className="mt-3 w-full rounded-sm border border-gold/30 py-3 text-[9px] uppercase tracking-[0.18em] text-gold">Add Aurelia to Home Screen</button> : null}
      {permission === "default" ? <button type="button" onClick={async () => setPermission(await Notification.requestPermission())} className="mt-3 w-full rounded-sm border border-gold/20 py-3 text-[9px] uppercase tracking-[0.18em] text-gold/80">Allow gentle reminders</button> : null}
    </section>
  );
}
