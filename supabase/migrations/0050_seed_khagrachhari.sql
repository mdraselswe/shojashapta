-- 0050: Khagrachhari content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('panakhaiyapara', 'পানখাইয়াপাড়া', 'Panakhaiyapara'),
  ('mahajanpara', 'মহাজনপাড়া', 'Mahajanpara')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'khagrachhari'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('pahari-khabar', 'পাহাড়ি খাবার', 'Pahari food', 'পাহাড়ি মুরগি, বাঁশকোঁড়ল, শুঁটকি ভর্তা, পাচনসহ পার্বত্য অঞ্চলের রান্না।', 'পাহাড়ি খাবার pahari food', 'pahari kabar pahari fud', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('pahari-khabar', 'pahari food', 'pahari fud'),
  ('pahari-khabar', 'hill food', 'hil fud'),
  ('pahari-khabar', 'pahari khabar', 'pahari kabar'),
  ('pahari-khabar', 'পাহাড়ি রান্না', 'pahari rana')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('system-restaurant-khagrachhari', 'সিস্টেম রেস্তোরাঁ', 'System Restaurant', 'restaurant', 'panakhaiyapara', 'সিস্টেম রেস্তোরাঁ system restaurant', 'sistem restara sistem restaurant'),
  ('bamboo-shoot-khagrachhari', 'ব্যাম্বু শুট', 'Bamboo Shoot', 'restaurant', 'mahajanpara', 'ব্যাম্বু শুট bamboo shoot', 'biambu sut bambu sut'),
  ('heritage-dine-khagrachhari', 'হেরিটেজ ডাইন', 'Heritage Dine', 'restaurant', 'panakhaiyapara', 'হেরিটেজ ডাইন heritage dine', 'heritej dain heritage dine'),
  ('kalyani-restaurant-khagrachhari', 'কল্যাণী রেস্তোরাঁ', 'Kalyani Restaurant', 'restaurant', 'mahajanpara', 'কল্যাণী রেস্তোরাঁ kalyani restaurant', 'kaliani restara kaliani restaurant')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'khagrachhari'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('system-restaurant-khagrachhari', 'pahari-khabar'),
  ('bamboo-shoot-khagrachhari', 'pahari-khabar'),
  ('heritage-dine-khagrachhari', 'pahari-khabar'),
  ('kalyani-restaurant-khagrachhari', 'pahari-khabar')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
