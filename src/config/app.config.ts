/**
 * Every tunable number in the app lives here (AGENTS.md §2). Document each value.
 * Phase 0.4 fills in the rest of this file.
 */
export const appConfig = {
  launch: {
    /** How long a founding contributor's `/?preview=<secret>` access lasts before they need the link again. */
    previewCookieMaxAgeDays: 30,
  },
} as const;
