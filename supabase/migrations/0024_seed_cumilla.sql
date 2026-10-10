-- 0024: Cumilla content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('manoharpur', 'মনোহরপুর', 'Manoharpur'),
  ('cumilla-city', 'কুমিল্লা শহর', 'Cumilla city')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'cumilla'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('cumilla-mishti-bhandar-cumilla', 'কুমিল্লা মিষ্টি ভাণ্ডার', 'Cumilla Mishti Bhandar', 'shop', 'cumilla-city', 'কুমিল্লা মিষ্টি ভাণ্ডার cumilla mishti bhandar', 'kumila misti bandar cumila misti bandar'),
  ('bhagwati-peda-bhandar-cumilla', 'ভগবতী পেঁড়া ভাণ্ডার', 'Bhagwati Peda Bhandar', 'shop', 'cumilla-city', 'ভগবতী পেঁড়া ভাণ্ডার bhagwati peda bhandar', 'bagabati pera bandar bagbati peda bandar'),
  ('shital-bhandar-cumilla', 'শীতল ভাণ্ডার', 'Shital Bhandar', 'shop', 'cumilla-city', 'শীতল ভাণ্ডার shital bhandar', 'sital bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'cumilla'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;

update places p
set area_id = a.id
from (values
  ('matri-bhandar-cumilla', 'manoharpur')
) as v(place_slug, area_slug), areas a
where p.slug = v.place_slug and a.district_id = p.district_id and a.slug = v.area_slug
  and p.area_id is null;

insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('cumilla-mishti-bhandar-cumilla', 'rasmalai'),
  ('bhagwati-peda-bhandar-cumilla', 'rasmalai'),
  ('shital-bhandar-cumilla', 'rasmalai')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('cumilla', 'rasmalai', 'https://www.bssnews.net/district/311066')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
