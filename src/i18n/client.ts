"use client";

import { publicEnv } from "@/config/public-env";

import { createT } from "./t";

const t = createT(publicEnv.defaultLocale);

/** Translator for Client Components (same messages as getT; no provider needed in the MVP). */
export function useT() {
  return t;
}
