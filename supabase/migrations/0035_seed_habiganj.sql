-- 0035: Habiganj content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('habiganj-town', 'হবিগঞ্জ শহর', 'Habiganj town')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'habiganj'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('adi-gopal-mistanna-bhandar-habiganj', 'আদি গোপাল মিষ্টান্ন ভান্ডার', 'Adi Gopal Mistanna Bhandar', 'shop', 'habiganj-town', 'আদি গোপাল মিষ্টান্ন ভান্ডার adi gopal mistanna bhandar', 'adi gapal mistan bandar adi gapal mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'habiganj'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('adi-gopal-mistanna-bhandar-habiganj', 'roshogolla'),
  ('adi-gopal-mistanna-bhandar-habiganj', 'rasmalai')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
