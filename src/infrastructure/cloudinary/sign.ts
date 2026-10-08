import "server-only";

import { createHash } from "node:crypto";

/**
 * Cloudinary request signature: SHA-1 of the sorted `key=value` pairs joined with `&`, followed by
 * the API secret. Empty values are not signed; `file`, `api_key` and `signature` never are.
 */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.entries(params)
    .filter(([key, value]) => value !== "" && !["file", "api_key", "signature"].includes(key))
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}
