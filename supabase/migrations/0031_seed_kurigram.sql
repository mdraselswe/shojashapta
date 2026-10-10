-- 0031: Kurigram content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('kalibari', 'কালীবাড়ি', 'Kalibari')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'kurigram'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('rasmanjuri', 'রসমঞ্জুরি', 'Rasmanjuri', 'ছানার মিষ্টি, রসে ডোবানো। উত্তরাঞ্চলে গাইবান্ধা ও কুড়িগ্রামে পরিচিত।', 'রসমঞ্জুরি rasmanjuri', 'rasamanjuri rasmanjuri', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('rasmanjuri', 'rasmanjari', 'rasmanjari'),
  ('rasmanjuri', 'rasmonjuri', 'rasmanjuri'),
  ('rasmanjuri', 'rosmanjuri', 'rasmanjuri'),
  ('rasmanjuri', 'রসমঞ্জরী', 'rasamanjari')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('jhantu-mishtanno-bhandar-kurigram', 'ঝন্টু মিষ্টান্ন ভান্ডার', 'Jhantu Mishtanno Bhandar', 'shop', 'kalibari', 'ঝন্টু মিষ্টান্ন ভান্ডার jhantu mishtanno bhandar', 'jantu mistan bandar jantu mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'kurigram'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('jhantu-mishtanno-bhandar-kurigram', 'chomchom'),
  ('jhantu-mishtanno-bhandar-kurigram', 'rasmanjuri'),
  ('jhantu-mishtanno-bhandar-kurigram', 'shondesh')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
