-- 0045: Brahmanbaria content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('mahadev-patti', 'মহাদেব পট্টি', 'Mahadev Patti'),
  ('aruail-bazar', 'অরুয়াইল বাজার', 'Aruail Bazar')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'brahmanbaria'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('chhanamukhi', 'ছানামুখী', 'Chhanamukhi', 'ছানা ও চিনির তৈরি ব্রাহ্মণবাড়িয়ার ঐতিহ্যবাহী মিষ্টি।', 'ছানামুখী chhanamukhi', 'canamuki', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('chhanamukhi', 'chanamukhi', 'canamuki'),
  ('chhanamukhi', 'chanamukhi misti', 'canamuki misti'),
  ('chhanamukhi', 'ছানামুখি', 'canamuki')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('mahadev-mistanna-bhandar-brahmanbaria', 'মহাদেব মিষ্টান্ন ভাণ্ডার', 'Mahadev Mistanna Bhandar', 'shop', 'mahadev-patti', 'মহাদেব মিষ্টান্ন ভাণ্ডার mahadev mistanna bhandar', 'mahadeb mistan bandar mahadeb mistana bandar'),
  ('chunilals-roshogolla-sarail', 'চুনিলালের রসগোল্লা', 'Chunilal''s Roshogolla', 'shop', 'aruail-bazar', 'চুনিলালের রসগোল্লা chunilal''s roshogolla', 'cunilaler rasagala cunilal s rasagala')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'brahmanbaria'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('mahadev-mistanna-bhandar-brahmanbaria', 'chhanamukhi'),
  ('chunilals-roshogolla-sarail', 'roshogolla')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('brahmanbaria', 'chhanamukhi', 'ব্রাহ্মণবাড়িয়ার ছানামুখী', 'https://bangla.thedailystar.net/life-living/food-recipe/news-673826', 125)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
