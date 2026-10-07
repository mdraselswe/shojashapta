import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { serverEnv } from "@/config/env";

import type { Database } from "./database.types";

export type Db = SupabaseClient<Database>;

type Credentials = { url: string; anonKey: string; serviceKey?: string };

function credentialsFromEnv(): Credentials {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase is selected but NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are not set");
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ...(env.SUPABASE_SERVICE_ROLE_KEY ? { serviceKey: env.SUPABASE_SERVICE_ROLE_KEY } : {}),
  };
}

const noSession = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/**
 * Clients for server code. `public` uses the anon key, so RLS applies exactly as for a visitor
 * (cacheable public reads). `service` bypasses RLS for server-only work (aggregates, rate limits);
 * user-scoped writes arrive with auth in Phase 3.1.
 */
export function createSupabaseClients(credentials: Credentials = credentialsFromEnv()) {
  return {
    public: createClient<Database>(credentials.url, credentials.anonKey, noSession),
    service: credentials.serviceKey
      ? createClient<Database>(credentials.url, credentials.serviceKey, noSession)
      : null,
  };
}

export type SupabaseClients = ReturnType<typeof createSupabaseClients>;
