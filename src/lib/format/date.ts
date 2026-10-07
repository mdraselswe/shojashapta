import { toBnDigits } from "./number";

// Relative and absolute dates in Bangla. Fixed to Bangladesh time so server and browser agree.

const TIME_ZONE = "Asia/Dhaka";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const UNITS = [
  [YEAR, "বছর"],
  [MONTH, "মাস"],
  [WEEK, "সপ্তাহ"],
  [DAY, "দিন"],
  [HOUR, "ঘণ্টা"],
  [MINUTE, "মিনিট"],
] as const;

/** "এইমাত্র", "৫ মিনিট আগে", "৩ ঘণ্টা আগে", "৫ দিন আগে", "২ সপ্তাহ আগে", "১ বছর আগে". */
export function timeAgo(date: Date | string, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  // Future timestamps (clock skew) read as "just now" rather than a negative age.
  if (seconds < MINUTE) return "এইমাত্র";
  for (const [size, unit] of UNITS) {
    if (seconds >= size) return `${toBnDigits(Math.floor(seconds / size))} ${unit} আগে`;
  }
  return "এইমাত্র";
}

/** Whole days between two moments (e.g. "শেষ নিশ্চিত X দিন আগে"). Never negative. */
export function daysSince(date: Date | string, now: Date = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(date).getTime()) / (DAY * 1000)));
}

const dateFormat = new Intl.DateTimeFormat("bn-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** "৭ অক্টোবর, ২০২৬" in Bangladesh time. */
export function formatDate(date: Date | string): string {
  return dateFormat.format(new Date(date));
}
