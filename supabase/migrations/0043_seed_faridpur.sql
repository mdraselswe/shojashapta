-- 0043: Faridpur content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('boalmari', 'বোয়ালমারী', 'Boalmari')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'faridpur'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('para-shondesh', 'প্যারা সন্দেশ', 'Para Shondesh', 'ছানা ও চিনির তৈরি গোল সন্দেশ। ফরিদপুরের বোয়ালমারীর পরিচিত মিষ্টি।', 'প্যারা সন্দেশ para shondesh', 'piara sandes para sandes', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('para-shondesh', 'para sandesh', 'para sandes'),
  ('para-shondesh', 'pera sandesh', 'pera sandes'),
  ('para-shondesh', 'প্যারা সন্দেশ', 'piara sandes'),
  ('para-shondesh', 'প্যাড়া সন্দেশ', 'piara sandes')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('surjomukhi-boalmari', 'সূর্যমুখী', 'Surjomukhi', 'shop', 'boalmari', 'সূর্যমুখী surjomukhi', 'suriamuki surjamuki')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'faridpur'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('surjomukhi-boalmari', 'para-shondesh')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
