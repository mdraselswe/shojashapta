"use client";

import bn from "./messages/bn.json";
import { createTranslator, type Messages } from "./translator";

// Bangla is the only locale in the MVP (AGENTS.md §5); English messages stay out of the client bundle,
// and so do the admin and legal texts (bn.server.json): Client Components other than the admin ones
// never show them. A missing key falls back to the key itself.
const t = createTranslator(bn as unknown as Messages, bn as unknown as Messages);

/** Translator for Client Components (same messages as getT; no provider needed in the MVP). */
export function useT() {
  return t;
}
