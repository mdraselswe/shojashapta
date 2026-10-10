-- 0041: Madaripur content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('old-court', 'পুরোনো আদালত এলাকা', 'Old Court area')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'madaripur'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('khirpuri', 'ক্ষীরপুরি', 'Khirpuri', 'ক্ষীর ভরা পুরির মতো মিষ্টি। মাদারীপুরের পরিচিত মিষ্টি।', 'ক্ষীরপুরি khirpuri', 'ksirpuri kirpuri', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('khirpuri', 'kheerpuri', 'kirpuri'),
  ('khirpuri', 'khirpuri', 'kirpuri'),
  ('khirpuri', 'khir puri', 'kir puri'),
  ('khirpuri', 'ক্ষীরপুরী', 'ksirpuri')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('jibon-misthanna-bhandar-madaripur', 'জীবন মিষ্টান্ন ভাণ্ডার', 'Jibon Misthanna Bhandar', 'shop', 'old-court', 'জীবন মিষ্টান্ন ভাণ্ডার jibon misthanna bhandar', 'jiban mistan bandar jiban mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'madaripur'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('jibon-misthanna-bhandar-madaripur', 'khirpuri'),
  ('jibon-misthanna-bhandar-madaripur', 'roshogolla'),
  ('jibon-misthanna-bhandar-madaripur', 'rasmalai')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('madaripur', 'khirpuri', 'মাদারীপুরের ক্ষীরপুরি', 'https://bangla.thedailystar.net/life-living/food-recipe/news-668541', 121)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
