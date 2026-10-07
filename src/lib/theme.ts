import {
  THEME_IDS,
  THEME_STORAGE_KEY,
  themes,
  type ThemeId,
  type ThemePreference,
} from "@/config/themes";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

/** Anything stored that is not a registered theme (old, removed, garbage) means "follow the OS". */
export function toPreference(stored: string | null | undefined): ThemePreference {
  return isThemeId(stored) ? stored : "system";
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ThemeId {
  if (preference !== "system") return preference;
  return systemPrefersDark ? "dark" : "light";
}

export function metaColorFor(theme: ThemeId): string {
  return themes[theme].metaColor;
}

/**
 * Inline script that runs in <head> before first paint so a saved theme never flashes.
 * "system" leaves data-theme unset; the CSS media query then follows the OS.
 */
export function themeInitScript(): string {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(THEME_IDS)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
}
