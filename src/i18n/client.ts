"use client";

import bn from "./messages/bn.json";
import { createTranslator } from "./translator";

// Bangla is the only locale in the MVP (AGENTS.md §5); English messages stay out of the client bundle.
const t = createTranslator(bn, bn);

/** Translator for Client Components (same messages as getT; no provider needed in the MVP). */
export function useT() {
  return t;
}
