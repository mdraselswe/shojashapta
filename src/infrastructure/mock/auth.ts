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
      // The /auth/callback route (Phase 3.1) sets the mock cookie and redirects back.
      return `/auth/callback?mock=1&next=${encodeURIComponent(redirectTo)}`;
    },
    async signOut() {
      (await cookies()).delete(MOCK_SESSION_COOKIE);
    },
  };
}
