import "server-only";

import type { AuthProvider, Repositories } from "@/core/ports";

import { createSupabaseClients } from "./client.server";
import { createSupabaseRepositoriesFrom } from "./repositories";

// Supabase adapters (DB_PROVIDER / AUTH_PROVIDER = supabase). Repositories: public reads since
// Phase 1.2, writes with the phases that need them. Auth arrives in Phase 3.1.

export function createSupabaseRepositories(): Repositories {
  return createSupabaseRepositoriesFrom(createSupabaseClients());
}

export function createSupabaseAuth(): AuthProvider {
  throw new Error("Supabase auth is implemented in Phase 3.1; use AUTH_PROVIDER=mock until then.");
}
