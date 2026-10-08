/**
 * Prints the mock fixtures (src/infrastructure/mock/fixtures.ts) as SQL inserts, so a real database
 * holds exactly the data the repository contract expects. Used only by CI against a throwaway local
 * Supabase: `pnpm tsx scripts/fixtures-sql.ts | psql "$DB_URL"`. Never run it against DEV or PROD.
 */
import * as fixtures from "../src/infrastructure/mock/fixtures";
import { buildSearchFields } from "../src/lib/text/normalize";

type Value = string | number | boolean | null | Date | Record<string, unknown>;

function sql(value: Value): string {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return `'${value.toISOString()}'`;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `'${text.replace(/'/g, "''")}'`;
}

function insert(table: string, rows: Record<string, Value>[]): string {
  if (rows.length === 0) return "";
  const columns = Object.keys(rows[0] ?? {});
  const values = rows.map(
    (row) => `(${columns.map((column) => sql(row[column] ?? null)).join(", ")})`,
  );
  return `insert into ${table} (${columns.join(", ")}) values\n  ${values.join(",\n  ")};\n`;
}

const statements = [
  "begin;",
  insert(
    "districts",
    fixtures.districts.map((d) => {
      const search = buildSearchFields(d.nameBn, d.nameEn, d.slug);
      return {
        id: d.id,
        slug: d.slug,
        name_bn: d.nameBn,
        name_en: d.nameEn,
        division_bn: d.divisionBn,
        division_en: d.divisionEn,
        place_count: d.placeCount,
        search_text: search.searchText,
        search_key: search.searchKey,
      };
    }),
  ),
  insert(
    "areas",
    fixtures.places
      .filter((p) => p.area)
      .map((p) => ({
        id: p.area?.id ?? null,
        district_id: p.district.id,
        slug: p.area?.slug ?? null,
        name_bn: p.area?.nameBn ?? null,
      })),
  ),
  insert("auth.users", [
    { id: fixtures.demoUser.id, email: "demo@fixtures.invalid" },
    { id: fixtures.fixtureIds.users.contract, email: "contract@fixtures.invalid" },
  ]),
  // Migration 0009 creates a profile for every new auth user; the fixture sets its own fields.
  `delete from profiles where id in (${sql(fixtures.demoUser.id)}, ${sql(fixtures.fixtureIds.users.contract)});
`,
  insert("profiles", [
    {
      id: fixtures.demoUser.id,
      display_name: fixtures.demoUser.displayName,
      role: fixtures.demoUser.role,
      home_district_id: fixtures.demoUser.homeDistrictId,
    },
    {
      id: fixtures.fixtureIds.users.contract,
      display_name: "কন্ট্রাক্ট টেস্ট",
      role: "user",
      home_district_id: null,
    },
  ]),
  insert(
    "foods",
    fixtures.foods.map((f) => {
      const search = buildSearchFields(f.nameBn, f.nameEn, f.slug);
      const dishes = fixtures.dishes.filter((d) => d.foodId === f.id);
      return {
        id: f.id,
        slug: f.slug,
        name_bn: f.nameBn,
        name_en: f.nameEn,
        about_bn: f.aboutBn,
        status: f.status,
        experience_count: dishes.reduce((sum, d) => sum + d.experienceCount, 0),
        loved_count: dishes.reduce((sum, d) => sum + d.lovedCount, 0),
        search_text: search.searchText,
        search_key: search.searchKey,
      };
    }),
  ),
  insert(
    "regional_fame",
    fixtures.regionalFame.map((f, index) => ({
      district_id: f.districtId,
      area_id: f.areaId,
      food_id: f.foodId,
      note_bn: f.noteBn,
      source_url: f.sourceUrl,
      sort_order: index,
    })),
  ),
  insert(
    "places",
    fixtures.places.map((p) => {
      const search = buildSearchFields(p.nameBn, p.nameEn);
      return {
        id: p.id,
        slug: p.slug,
        name_bn: p.nameBn,
        name_en: p.nameEn,
        type: p.type,
        district_id: p.district.id,
        area_id: p.area?.id ?? null,
        address: p.address,
        opening_hours: p.openingHours,
        price_min: p.price.min,
        price_max: p.price.max,
        status: p.status,
        search_text: search.searchText,
        search_key: search.searchKey,
      };
    }),
  ),
  insert(
    "dishes",
    fixtures.dishes.map((d) => ({
      id: d.id,
      place_id: d.placeId,
      food_id: d.foodId,
      display_name: d.displayName,
      price_min: d.price.min,
      price_max: d.price.max,
      loved_count: d.lovedCount,
      okay_count: d.okayCount,
      disliked_count: d.dislikedCount,
      wilson_score: d.wilsonScore,
      last_experience_at: d.lastExperienceAt,
      status: d.status,
    })),
  ),
  insert(
    "experiences",
    fixtures.experiences.map((e) => ({
      id: e.id,
      user_id: e.user.id,
      dish_id: e.dishId,
      reaction: e.reaction,
      comment: e.comment,
      price_paid: e.pricePaid,
      visited_on: e.visitedOn,
      status: e.status,
      created_at: e.createdAt,
    })),
  ),
  insert(
    "claims",
    fixtures.claims.map((c) => ({
      id: c.id,
      entity: c.entity,
      entity_id: c.entityId,
      type: c.type,
      value: c.value,
      status: c.status,
      correct_count: c.counts.correct,
      partial_count: c.counts.partial,
      wrong_count: c.counts.wrong,
      last_confirmed_at: c.lastConfirmedAt,
      expires_at: c.expiresAt,
    })),
  ),
  // Keep serial sequences ahead of the explicit ids above.
  "select setval(pg_get_serial_sequence('areas', 'id'), (select coalesce(max(id), 1) from areas));",
  "commit;",
];

process.stdout.write(statements.filter(Boolean).join("\n"));
