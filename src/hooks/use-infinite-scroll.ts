"use client";

import { useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Stop observing (no more pages, or a page is loading). */
  disabled?: boolean;
  /** Start loading before the sentinel is visible. */
  rootMargin?: string;
};

/** Calls `onEnd` when the sentinel element scrolls into view (load the next page). */
export function useInfiniteScroll(
  sentinel: RefObject<Element | null>,
  onEnd: () => void,
  { disabled = false, rootMargin = "400px 0px" }: Options = {},
) {
  // Keep the latest callback without re-creating the observer on every render.
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    const element = sentinel.current;
    if (disabled || !element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onEndRef.current();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [sentinel, disabled, rootMargin]);
}
