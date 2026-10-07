"use client";

import { useEffect, useState } from "react";

import { appConfig } from "@/config/app.config";

/** `value`, but only after it stopped changing for `delayMs` (search input → suggestions). */
export function useDebounce<T>(value: T, delayMs: number = appConfig.search.debounceMs): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
