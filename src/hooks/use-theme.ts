"use client";

import { useCallback, useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY, type ThemeId, type ThemePreference } from "@/config/themes";
import { isThemeId, metaColorFor, resolveTheme, toPreference } from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const CHANGE_EVENT = "ss-theme-change";

function readPreference(): ThemePreference {
  try {
    return toPreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

/** Points every theme-color meta tag (light and dark media variants) at the chosen theme. */
function syncMetaThemeColor(preference: ThemePreference) {
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    const media = meta.getAttribute("media") ?? "";
    const theme: ThemeId =
      preference === "system" ? (media.includes("dark") ? "dark" : "light") : preference;
    meta.setAttribute("content", metaColorFor(theme));
  }
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (isThemeId(preference)) root.setAttribute("data-theme", preference);
  else root.removeAttribute("data-theme");
  syncMetaThemeColor(preference);
}

/** Current theme preference, the theme actually shown, and a setter (docs/06-design-system.md §2b). */
export function useTheme() {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);
  const prefersDark = useSyncExternalStore(subscribe, systemPrefersDark, () => false);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the theme still applies for this page view.
    }
    const apply = () => applyPreference(next);
    // 200ms cross-fade where the View Transitions API exists; instant otherwise.
    if (typeof document.startViewTransition === "function") document.startViewTransition(apply);
    else apply();
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { preference, resolved: resolveTheme(preference, prefersDark), setPreference };
}
