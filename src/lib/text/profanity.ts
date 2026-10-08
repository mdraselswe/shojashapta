import { normalizeBn } from "./normalize";

// A small, conservative filter for user-written text (comments, notes, suggested edits). It only
// blocks obvious abuse; anything subtler is left to reports and the admin queue (Phase 4.5/7).
// The list is deliberately short and easy to extend: one lowercase word per entry, Bangla or Latin.

const BLOCKED_WORDS = [
  // Bangla
  "খানকি",
  "মাগি",
  "বেশ্যা",
  "হারামজাদা",
  "হারামি",
  "চোদা",
  "চুদ",
  "বাল",
  "শুয়োর",
  "কুত্তার বাচ্চা",
  // Latin
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "cunt",
  "dick",
  "whore",
];

const SPLIT = /[^\p{L}\p{M}\p{N}]+/u;

/** True when the text contains a blocked word as a whole word (so "বালিশ" is fine, "বাল" is not). */
export function containsProfanity(text: string): boolean {
  const normalized = normalizeBn(text).toLowerCase();
  const words = normalized.split(SPLIT).filter(Boolean);
  const joined = ` ${words.join(" ")} `;
  return BLOCKED_WORDS.some((word) => joined.includes(` ${normalizeBn(word).toLowerCase()} `));
}
