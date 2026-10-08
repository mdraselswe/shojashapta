"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Nothing here is needed for first paint or the first interactions, so neither its code nor its
// work competes with the page: it loads a few seconds after the page has finished loading.
const Pwa = dynamic(() => import("./pwa").then((mod) => mod.Pwa), { ssr: false });

const DELAY_MS = 5000;

export function LazyPwa() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      timer = setTimeout(() => setReady(true), DELAY_MS);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      clearTimeout(timer);
    };
  }, []);

  return ready ? <Pwa /> : null;
}
