import "server-only";

import { cookies } from "next/headers";

import { AuthRequiredError, type AuthProvider } from "@/core/ports";

import { demoUser } from "./fixtures";

/** Cookie that marks a mock sign-in (AUTH_PROVIDER=mock: CI, e2e, offline work). */
export const MOCK_SESSION_COOKIE = "ss_mock_session";

/**
 * Pretend Google sign-in for local work and e2e: signed in as the fixture demo user while the
 * mock session cookie is set. Never selected when the app is launched in production (config/env).
 */
export function createMockAuth(): AuthProvider {
  const signedIn = async () => (await cookies()).get(MOCK_SESSION_COOKIE)?.value === demoUser.id;
  return {
    async getSession() {
      return (await signedIn())
        ? { user: { ...demoUser }, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }
        : null;
    },
    async requireUser() {
      if (!(await signedIn())) throw new AuthRequiredError();
      return { ...demoUser };
    },
    async signInWithGoogleUrl(redirectTo) {
      // Skips Google: the callback route sees `mock=1` and signs in the demo user.
      return `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}mock=1`;
    },
    async completeSignIn(code) {
      if (code !== "1") return false;
      (await cookies()).set(MOCK_SESSION_COOKIE, demoUser.id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60,
      });
      return true;
    },
    async signOut() {
      (await cookies()).delete(MOCK_SESSION_COOKIE);
    },
  };
}
