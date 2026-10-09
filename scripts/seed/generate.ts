/** `pnpm db:seed` — rewrites the seed migrations from scripts/seed/*.ts. */
import { writeFileSync } from "node:fs";

import { buildDhakaSql, DHAKA_SETS, migrationPath } from "./build-dhaka-sql";
import { buildSeedSql, SEED_MIGRATION_PATH } from "./build-sql";

writeFileSync(SEED_MIGRATION_PATH, buildSeedSql(), "utf8");
console.log(`Wrote ${SEED_MIGRATION_PATH}`);
for (const set of DHAKA_SETS) {
  writeFileSync(migrationPath(set), buildDhakaSql(set), "utf8");
  console.log(`Wrote ${migrationPath(set)}`);
}
