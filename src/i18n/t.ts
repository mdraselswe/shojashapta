import bnClient from "./messages/bn.json";
import bnServer from "./messages/bn.server.json";
import enClient from "./messages/en.json";
import enServer from "./messages/en.server.json";
import { createTranslator, type Messages } from "./translator";

export { createTranslator, type Messages, type MessageKey, type Params } from "./translator";

// Bangla-first translations (AGENTS.md §5). bn.json is the reference; en.json must have the same
// keys (checked by t.test.ts). Keys are type-checked: t("nav.home").

export type Locale = "bn" | "en";

// admin and legal texts live in *.server.json: pages render them on the server, so they never
// reach a visitor's browser (src/i18n/client.ts imports only bn.json).
const bn: Messages = { ...bnClient, ...bnServer };
const en: Messages = { ...enClient, ...enServer };

export const messages: Record<Locale, Messages> = { bn, en };

/** A translator for one locale. Missing keys fall back to Bangla, then to the key itself. */
export function createT(locale: Locale) {
  return createTranslator(messages[locale], bn);
}

export type T = ReturnType<typeof createT>;
