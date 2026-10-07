import "server-only";

import type { AuthProvider, Repositories } from "@/core/ports";

// Supabase adapters (DB_PROVIDER / AUTH_PROVIDER = supabase). Empty until the Supabase projects exist:
// repositories arrive in Phase 1.2, auth in Phase 3.1. Use the mock provider until then.

function notYet(what: string, phase: string): never {
  throw new Error(
    `Supabase ${what} is implemented in Phase ${phase}; use the mock provider until then.`,
  );
}

export function createSupabaseRepositories(): Repositories {
  return notYet("repositories", "1.2");
}

export function createSupabaseAuth(): AuthProvider {
  return notYet("auth", "3.1");
}
