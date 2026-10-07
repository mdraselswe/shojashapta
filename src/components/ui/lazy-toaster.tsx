"use client";

import dynamic from "next/dynamic";

// Toasts only appear after a user action, so the toaster's JS loads after hydration instead of
// blocking first render on every page.
const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

export function LazyToaster() {
  return <Toaster />;
}
