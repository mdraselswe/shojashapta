"use client";

import { useCallback, useSyncExternalStore } from "react";

import { appConfig } from "@/config/app.config";

/** Whether a CSS media query matches. False during server render (mobile-first markup). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Narrower than Tailwind `md`. Prefer CSS breakpoints; use this only when behavior must differ. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${appConfig.ui.mobileBreakpointPx - 1}px)`);
}
