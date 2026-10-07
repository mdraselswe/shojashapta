/**
 * Theme registry — the only list of themes the app knows (docs/06-design-system.md §2b).
 * Adding a theme: create src/styles/themes/<id>.css, import it in globals.css, add it here,
 * then run `pnpm test:themes` and check /dev/themes.
 */

export type ThemeScheme = "light" | "dark";

export type ThemeDef = {
  /** Bangla name shown in the theme switcher. */
  label: string;
  /** Which `color-scheme` the theme uses (scrollbars, form controls). */
  scheme: ThemeScheme;
  /** Browser UI color (`<meta name="theme-color">`); matches the theme's --background. */
  metaColor: string;
};

export const themes = {
  light: { label: "হালকা", scheme: "light", metaColor: "#F6F6F8" },
  dark: { label: "গাঢ়", scheme: "dark", metaColor: "#0F0F14" },
} as const satisfies Record<string, ThemeDef>;

export type ThemeId = keyof typeof themes;
export type ThemePreference = "system" | ThemeId;

export const THEME_IDS = Object.keys(themes) as ThemeId[];
/** What the theme switcher shows, in order. */
export const THEME_PREFERENCES: readonly ThemePreference[] = ["system", ...THEME_IDS];
/** Label for following the OS setting. */
export const SYSTEM_THEME_LABEL = "সিস্টেম";
export const THEME_STORAGE_KEY = "ss-theme";
