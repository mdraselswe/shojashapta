import { clientEnv } from "@/config/env";

import { createT, type Locale } from "./t";

/** Translator for Server Components, route handlers and actions. MVP: one locale per deployment. */
export function getT(locale: Locale = clientEnv.NEXT_PUBLIC_DEFAULT_LOCALE) {
  return createT(locale);
}
