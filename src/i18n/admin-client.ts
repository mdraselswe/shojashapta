"use client";

import bn from "./messages/bn.json";
import bnServer from "./messages/bn.server.json";
import { createTranslator, type Messages } from "./translator";

// For the admin Client Components only: the admin texts are not part of the public bundle.
const all = { ...bn, ...bnServer } as Messages;
const t = createTranslator(all, all);

export function useAdminT() {
  return t;
}
