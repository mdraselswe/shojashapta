"use client";

import dynamic from "next/dynamic";

// Nothing here is needed for first paint, so its JS loads after hydration.
const Pwa = dynamic(() => import("./pwa").then((mod) => mod.Pwa), { ssr: false });

export function LazyPwa() {
  return <Pwa />;
}
