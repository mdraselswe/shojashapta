import { describe } from "vitest";

import { repositoryContract } from "@/core/ports/__tests__/repositories.contract";

import { fixtureIds } from "../mock/fixtures";
import { createSupabaseClients } from "./client.server";
import { createSupabaseRepositoriesFrom } from "./repositories";

// Runs in the CI "database" job against a throwaway local Supabase loaded with the mock fixtures
// (scripts/fixtures-sql.ts). Skipped elsewhere: it needs SUPABASE_TEST_* and never targets DEV/PROD.
const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceKey = process.env.SUPABASE_TEST_SERVICE_KEY;

if (url && anonKey) {
  repositoryContract(
    "supabase",
    () =>
      createSupabaseRepositoriesFrom(
        createSupabaseClients({ url, anonKey, ...(serviceKey ? { serviceKey } : {}) }),
      ),
    // Areas are added as their Supabase writes land (experiences 3.2, saved 3.4).
    { ids: fixtureIds, writes: serviceKey ? ["experiences", "saved", "claims"] : false },
  );
} else {
  describe.skip("supabase repositories (contract) — needs SUPABASE_TEST_URL / SUPABASE_TEST_ANON_KEY", () => {});
}
