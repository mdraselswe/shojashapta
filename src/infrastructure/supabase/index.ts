import "server-only";

import type { Repositories } from "@/core/ports";

import { createSupabaseClients } from "./client.server";
import { createSupabaseRepositoriesFrom } from "./repositories";

// Supabase adapters (DB_PROVIDER / AUTH_PROVIDER = supabase). Repositories: public reads since
// Phase 1.2, writes with the phases that need them. Auth since Phase 3.1.
export { createSupabaseAuth } from "./auth";

export function createSupabaseRepositories(): Repositories {
  return createSupabaseRepositoriesFrom(createSupabaseClients());
}
