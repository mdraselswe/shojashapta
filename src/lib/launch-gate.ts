/**
 * Pre-launch gate (docs/11-delivery-workflow.md §4): until NEXT_PUBLIC_LAUNCHED=true every page shows
 * "শিগগিরই আসছে", except for founding contributors who opened `/?preview=<secret>` once.
 * Pure logic so it can be unit-tested; `src/proxy.ts` applies the decision.
 */

export const PREVIEW_PARAM = "preview";
export const PREVIEW_COOKIE = "ss_preview";

export type LaunchGateInput = {
  launched: boolean;
  /** PREVIEW_ACCESS_SECRET; when empty nobody can bypass the gate. */
  secret: string | undefined;
  /** Value of the `?preview=` query parameter, if any. */
  previewParam: string | null;
  /** Value of the preview cookie, if any. */
  cookie: string | undefined;
};

export type LaunchGateDecision =
  | { kind: "open" }
  /** Correct secret in the URL: store `token` in the cookie and redirect to the URL without it. */
  | { kind: "grant"; token: string }
  | { kind: "gate" };

/** The cookie stores a hash of the secret, never the secret itself. */
export async function previewToken(secret: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function decideLaunchGate(input: LaunchGateInput): Promise<LaunchGateDecision> {
  if (input.launched) return { kind: "open" };
  if (!input.secret) return { kind: "gate" };

  const expected = await previewToken(input.secret);
  // Compare hashes rather than raw strings so the check doesn't leak the secret's prefix via timing.
  if (input.previewParam !== null && (await previewToken(input.previewParam)) === expected) {
    return { kind: "grant", token: expected };
  }
  if (input.cookie === expected) return { kind: "open" };
  return { kind: "gate" };
}
