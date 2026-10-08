import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { Database } from "./database.types";

/**
 * Keeps the Supabase session alive: validating the user in the proxy refreshes an expiring token
 * and writes the new cookies to the response (Server Components cannot). Skipped for visitors
 * without Supabase cookies, so anonymous traffic pays nothing.
 */
export async function refreshSupabaseSession(
  request: NextRequest,
  response: NextResponse,
  credentials: { url: string; anonKey: string },
): Promise<void> {
  if (!request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-"))) return;
  const supabase = createServerClient<Database>(credentials.url, credentials.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getUser();
}
