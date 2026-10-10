-- 0040: Feni content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('parshuram', 'পরশুরাম', 'Parshuram')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'feni'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('khondol', 'খোন্দল মিষ্টি', 'Khondol sweet', 'ফেনীর পরশুরামের খোন্দল এলাকার ঐতিহ্যবাহী মিষ্টি, গরম বা ঠান্ডা খাওয়া যায়।', 'খোন্দল মিষ্টি khondol sweet', 'kandal misti kandal sbit', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('khondol', 'khondol misti', 'kandal misti'),
  ('khondol', 'khondoler misti', 'kandaler misti'),
  ('khondol', 'খন্দলের মিষ্টি', 'kandaler misti'),
  ('khondol', 'খোন্দলের মিষ্টি', 'kandaler misti')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('khondoler-patwary-misti-mela-feni', 'খোন্দলের পাটওয়ারী মিষ্টি মেলা', 'Khondoler Patwary Misti Mela', 'shop', 'parshuram', 'খোন্দলের পাটওয়ারী মিষ্টি মেলা khondoler patwary misti mela', 'kandaler patuiari misti mela kandaler patbari misti mela')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'feni'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('khondoler-patwary-misti-mela-feni', 'khondol')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('feni', 'khondol', 'পরশুরামের খোন্দল', 'https://thefinancialexpress.com.bd/views/fenis-khondol-sweet-a-taste-of-tradition-1627031408', 120)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
