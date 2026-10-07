"use client";

import { useEffect, useState } from "react";

import { appConfig } from "@/config/app.config";

/**
 * True only once `flag` has stayed true for `delayMs` — show a skeleton only for slow loads,
 * so fast ones don't flicker (docs/05-loading-skeletons.md). Turns off immediately.
 */
export function useDelayedFlag(flag: boolean, delayMs: number = appConfig.ui.skeletonDelayMs) {
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!flag) return;
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => {
      clearTimeout(timer);
      setElapsed(false);
    };
  }, [flag, delayMs]);
  return flag && elapsed;
}
