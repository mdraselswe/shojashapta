-- 0051: Rangamati content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('rangamati-town', 'রাঙামাটি শহর', 'Rangamati town')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'rangamati'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('bash-korol', 'বাঁশ কোড়ল', 'Bamboo shoot (bash korol)', 'কচি বাঁশের কোড়ল, ভাজি বা মাংসের সঙ্গে রান্না করা পাহাড়ি পদ।', 'বাঁশ কোড়ল bamboo shoot (bash korol)', 'bas karal bambu sut bas karal', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('bash-korol', 'bamboo shoot', 'bambu sut'),
  ('bash-korol', 'bash korol', 'bas karal'),
  ('bash-korol', 'bash koral', 'bas karal'),
  ('bash-korol', 'বাঁশকোঁড়ল', 'basakaral'),
  ('bash-korol', 'বাঁশ কোরল', 'bas karal')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('sunzuk-hotel-restaurant-rangamati', 'সুনজুক হোটেল অ্যান্ড রেস্টুরেন্ট', 'Sunzuk Hotel and Restaurant', 'restaurant', 'rangamati-town', 'সুনজুক হোটেল অ্যান্ড রেস্টুরেন্ট sunzuk hotel and restaurant', 'sunjuk hatel aiand resturent sunjuk hatel and restaurant')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'rangamati'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('sunzuk-hotel-restaurant-rangamati', 'bash-korol')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
