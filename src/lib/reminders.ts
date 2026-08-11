import { useEffect } from "react";
import { getAffirmation } from "@/data/affirmations";

const LAST_SHOWN_PREFIX = "aurelia:last-reminder:";

export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported" as const;
  return Notification.requestPermission();
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/** Milliseconds until the next occurrence of "HH:MM" in local time. */
function msUntil(time: string) {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h ?? 8, m ?? 0, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

function isPastToday(time: string) {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const at = new Date();
  at.setHours(h ?? 8, m ?? 0, 0, 0);
  return now.getTime() >= at.getTime();
}

export function playVoiceAffirmation(url: string) {
  try {
    const audio = new Audio(url);
    void audio.play().catch(() => undefined);
  } catch {
    /* autoplay blocked */
  }
}

/** Normalises stored alarm times: "HH:MM", unique, sorted. */
export function normaliseTimes(times: (string | null | undefined)[]): string[] {
  const cleaned = times
    .filter((value): value is string => Boolean(value))
    .map((value) => value.slice(0, 5))
    .filter((value) => /^\d{2}:\d{2}$/.test(value));
  return Array.from(new Set(cleaned)).sort();
}

export interface ReminderOptions {
  day: number;
  voiceUrl?: string | null | undefined;
  /** How many times each alarm repeats. */
  repeat?: number | undefined;
  /** Minutes between repeats. */
  spacingMinutes?: number | undefined;
}


export function showReminder(day: number, voiceUrl?: string | null, label?: string) {
  if (voiceUrl) playVoiceAffirmation(voiceUrl);
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  const entry = getAffirmation(day);
  new Notification(label ?? "Your affirmation for today", {
    body: voiceUrl ? "Playing your own affirmation." : `“${entry.affirmation}”`,
    icon: "/favicon.ico",
    tag: `aurelia-${label ?? "daily"}`,
  });
}

/** Fires one alarm, repeating it the requested number of times. */
function fireAlarm(time: string, options: ReminderOptions) {
  const repeat = Math.max(1, Math.min(options.repeat ?? 1, 10));
  const spacing = Math.max(1, options.spacingMinutes ?? 5) * 60_000;
  const timers: ReturnType<typeof setTimeout>[] = [];

  for (let i = 0; i < repeat; i += 1) {
    const run = () =>
      showReminder(
        options.day,
        options.voiceUrl,
        repeat > 1 ? `Aurelia · ${time} (${i + 1}/${repeat})` : `Aurelia · ${time}`,
      );
    if (i === 0) run();
    else timers.push(setTimeout(run, i * spacing));
  }
  localStorage.setItem(LAST_SHOWN_PREFIX + time, todayKey());
  return timers;
}

/**
 * Schedules every alarm the person has set while the app is open. Browsers only
 * let a web app raise its own notifications from a live tab, so each alarm also
 * catches up once if its time already passed today.
 */
export function useDailyReminder(options: {
  enabled: boolean;
  times: string[];
  day: number;
  voiceUrl?: string | null | undefined;
  repeat?: number | undefined;
  spacingMinutes?: number | undefined;
}) {

  const { enabled, day, voiceUrl, repeat, spacingMinutes } = options;
  const times = normaliseTimes(options.times);
  const signature = times.join(",");

  useEffect(() => {
    if (!enabled || times.length === 0) return;
    if (!notificationsSupported() || Notification.permission !== "granted") return;

    const config: ReminderOptions = { day, voiceUrl, repeat, spacingMinutes };
    let timers: ReturnType<typeof setTimeout>[] = [];

    times.forEach((time) => {
      if (isPastToday(time) && localStorage.getItem(LAST_SHOWN_PREFIX + time) !== todayKey()) {
        timers = timers.concat(fireAlarm(time, config));
      }
      const schedule = () => {
        const timer = setTimeout(() => {
          timers = timers.concat(fireAlarm(time, config));
          schedule();
        }, msUntil(time));
        timers.push(timer);
      };
      schedule();
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, signature, day, voiceUrl, repeat, spacingMinutes]);
}
