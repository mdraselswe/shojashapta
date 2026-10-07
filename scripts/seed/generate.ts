/** `pnpm db:seed` — rewrites the seed migration from scripts/seed/data.ts. */
import { writeFileSync } from "node:fs";

import { buildSeedSql, SEED_MIGRATION_PATH } from "./build-sql";

writeFileSync(SEED_MIGRATION_PATH, buildSeedSql(), "utf8");
console.log(`Wrote ${SEED_MIGRATION_PATH}`);
