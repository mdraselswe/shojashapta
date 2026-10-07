"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const CHANGE_EVENT = "ss-local-storage";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage blocked (private mode)
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * JSON value persisted in localStorage (recent searches), shared by every component using the
 * same key and across tabs. Returns `initial` on the server and when the stored value is unreadable.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
    // `initial` is a fallback only; changing it must not re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      const current = (() => {
        const stored = read(key);
        if (stored === null) return initial;
        try {
          return JSON.parse(stored) as T;
        } catch {
          return initial;
        }
      })();
      const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage blocked or full: keep working without persistence.
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [key, initial],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [key]);

  return [value, setValue, remove] as const;
}
