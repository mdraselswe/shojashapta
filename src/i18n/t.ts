import bn from "./messages/bn.json";
import en from "./messages/en.json";
import { createTranslator, type Messages } from "./translator";

export { createTranslator, type Messages, type MessageKey, type Params } from "./translator";

// Bangla-first translations (AGENTS.md §5). bn.json is the reference; en.json must have the same
// keys (checked by t.test.ts). Keys are type-checked: t("nav.home").

export type Locale = "bn" | "en";

export const messages: Record<Locale, Messages> = { bn, en };

/** A translator for one locale. Missing keys fall back to Bangla, then to the key itself. */
export function createT(locale: Locale) {
  return createTranslator(messages[locale], bn);
}

export type T = ReturnType<typeof createT>;
