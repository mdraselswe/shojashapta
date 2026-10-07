import { buildSearchFields, toSearchKey } from "../../src/lib/text/normalize";
import { DISTRICTS, DIVISIONS, FAME, FOODS, PLACES } from "./data";

// Turns scripts/seed/data.ts into the seed migration. The same normalization the app uses writes
// search_text / search_key, so stored keys match query keys (docs/04-database.md §6).
// Idempotent: every insert is `on conflict do nothing`.

const q = (value: string) => `'${value.replace(/'/g, "''")}'`;
const nullable = (value: string | undefined) => (value ? q(value) : "null");
const rows = (lines: string[]) => lines.map((line) => `  ${line}`).join(",\n");

export const SEED_MIGRATION_PATH = "supabase/migrations/0007_seed_curated_data.sql";

export function buildSeedSql(): string {
  const districtRows = DISTRICTS.map((district, index) => {
    const division = DIVISIONS[district.division];
    const search = buildSearchFields(district.nameBn, district.nameEn, ...(district.aliases ?? []));
    return `(${index + 1}, ${q(district.slug)}, ${q(district.nameBn)}, ${q(district.nameEn)}, ${q(division.bn)}, ${q(division.en)}, ${q(search.searchText)}, ${q(search.searchKey)})`;
  });

  const districtAliasRows = DISTRICTS.flatMap((district) =>
    (district.aliases ?? []).map(
      (alias) => `(${q(district.slug)}, ${q(alias)}, ${q(toSearchKey(alias))})`,
    ),
  );

  const foodRows = FOODS.map((food) => {
    // Aliases live in their own rows (search_all matches them separately); the main fields hold
    // only the names, which keeps trigram similarity high for short queries.
    const search = buildSearchFields(food.nameBn, food.nameEn);
    return `(${q(food.slug)}, ${q(food.nameBn)}, ${q(food.nameEn)}, ${q(food.aboutBn)}, ${q(search.searchText)}, ${q(search.searchKey)})`;
  });

  const foodAliasRows = FOODS.flatMap((food) =>
    food.aliases.map((alias) => `(${q(food.slug)}, ${q(alias)}, ${q(toSearchKey(alias))})`),
  );

  const fameRows = FAME.map(
    (fame, index) => `(${q(fame.district)}, ${q(fame.food)}, ${nullable(fame.noteBn)}, ${index})`,
  );

  const placeRows = PLACES.map((place) => {
    const search = buildSearchFields(place.nameBn, place.nameEn);
    return `(${q(place.slug)}, ${q(place.nameBn)}, ${q(place.nameEn)}, ${q(place.type)}, ${q(place.district)}, ${q(search.searchText)}, ${q(search.searchKey)})`;
  });

  const dishRows = PLACES.flatMap((place) =>
    place.famousFor.map((food) => `(${q(place.slug)}, ${q(food)})`),
  );

  return `-- 0007: curated launch content (generated — do not edit by hand).
-- Source: scripts/seed/data.ts · regenerate: pnpm db:seed · checked by scripts/seed/seed.test.ts
--
-- Everything except districts is flagged is_seed. Remove it later with:  select purge_seed_data();
-- (0006). No ratings, reviews, prices, hours, addresses or claims are invented here; real people
-- add those. After this migration is applied, changes to the content go into a NEW migration.

insert into districts (id, slug, name_bn, name_en, division_bn, division_en, search_text, search_key) values
${rows(districtRows)}
on conflict (id) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'district', d.id::text, v.alias, v.search_key
from (values
${rows(districtAliasRows)}
) as v(district_slug, alias, search_key)
join districts d on d.slug = v.district_slug
on conflict do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
${rows(foodRows.map((row) => row.replace(/\)$/, ", true)")))}
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
${rows(foodAliasRows)}
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into regional_fame (district_id, food_id, note_bn, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.sort_order, true
from (values
${rows(fameRows)}
) as v(district_slug, food_slug, note_bn, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;

insert into places (slug, name_bn, name_en, type, district_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, v.search_text, v.search_key, true
from (values
${rows(placeRows)}
) as v(slug, name_bn, name_en, type, district_slug, search_text, search_key)
join districts d on d.slug = v.district_slug
on conflict (slug) do nothing;

insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
${rows(dishRows)}
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
`;
}
