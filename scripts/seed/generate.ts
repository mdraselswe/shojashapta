/** `pnpm db:seed` — rewrites the seed migrations from scripts/seed/*.ts. */
import { writeFileSync } from "node:fs";

import { buildDhakaSql, DHAKA_MIGRATION_PATH } from "./build-dhaka-sql";
import { buildSeedSql, SEED_MIGRATION_PATH } from "./build-sql";

writeFileSync(SEED_MIGRATION_PATH, buildSeedSql(), "utf8");
console.log(`Wrote ${SEED_MIGRATION_PATH}`);
writeFileSync(DHAKA_MIGRATION_PATH, buildDhakaSql(), "utf8");
console.log(`Wrote ${DHAKA_MIGRATION_PATH}`);
