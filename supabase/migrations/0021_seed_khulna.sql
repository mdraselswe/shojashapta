-- 0021: Khulna content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('khulna-city', 'খুলনা শহর', 'Khulna city'),
  ('new-market', 'নিউ মার্কেট', 'New Market'),
  ('rupsha-ghat', 'রূপসা ঘাট', 'Rupsha Ghat')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'khulna'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('roshogolla', 'রসগোল্লা', 'Roshogolla', 'ছানার গোল মিষ্টি, চিনির রসে ডোবানো।', 'রসগোল্লা roshogolla', 'rasagala', true),
  ('shondesh', 'সন্দেশ', 'Shondesh', 'ছানা ও চিনি দিয়ে তৈরি নরম মিষ্টি।', 'সন্দেশ shondesh', 'sandes', true),
  ('singara', 'সিঙ্গারা', 'Singara', 'আলু বা মাংসের পুর দেওয়া তেলে ভাজা ত্রিকোণ নাশতা।', 'সিঙ্গারা singara', 'singara', true),
  ('ghugni', 'ঘুগনি', 'Ghugni', 'সেদ্ধ মটর বা ছোলার মসলাদার ঝোল নাশতা।', 'ঘুগনি ghugni', 'gugni', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('roshogolla', 'rasgulla', 'rasgula'),
  ('roshogolla', 'rosogolla', 'rasagala'),
  ('roshogolla', 'rossogolla', 'rasagala'),
  ('roshogolla', 'রসগোলা', 'rasagala'),
  ('shondesh', 'sandesh', 'sandes'),
  ('shondesh', 'sondesh', 'sandes'),
  ('shondesh', 'সন্দেশ', 'sandes'),
  ('singara', 'shingara', 'singara'),
  ('singara', 'samosa', 'samasa'),
  ('singara', 'shingra', 'singra'),
  ('singara', 'সমুচা', 'samuca'),
  ('ghugni', 'ghugni', 'gugni'),
  ('ghugni', 'ghuguni', 'guguni'),
  ('ghugni', 'ঘুগনী', 'gugni')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('abbas-hotel-khulna', 'আব্বাস হোটেল', 'Abbas Hotel', 'restaurant', 'khulna-city', 'আব্বাস হোটেল abbas hotel', 'abas hatel'),
  ('gesco-kabab-khulna', 'গেসকো কাবাব', 'Gesco Kabab', 'restaurant', 'khulna-city', 'গেসকো কাবাব gesco kabab', 'geska kabab gesca kabab'),
  ('indramohan-sweets-khulna', 'ইন্দ্রমোহন সুইটস', 'Indramohan Sweets', 'shop', 'khulna-city', 'ইন্দ্রমোহন সুইটস indramohan sweets', 'indramahan suitas indramahan sbits'),
  ('new-howrah-bakery-khulna', 'নিউ হাওড়া বেকারি', 'New Howrah Bakery', 'bakery', 'new-market', 'নিউ হাওড়া বেকারি new howrah bakery', 'niu hara bekari neb habrah bakeri'),
  ('rupsha-ghat-khulna', 'রূপসা ঘাটের নাশতা', 'Rupsha Ghat snacks', 'street_food', 'rupsha-ghat', 'রূপসা ঘাটের নাশতা rupsha ghat snacks', 'rupsa gater nasta rupsa gat snaks')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'khulna'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('abbas-hotel-khulna', 'chui-jhal'),
  ('gesco-kabab-khulna', 'kabab'),
  ('gesco-kabab-khulna', 'chaap'),
  ('indramohan-sweets-khulna', 'roshogolla'),
  ('indramohan-sweets-khulna', 'shondesh'),
  ('new-howrah-bakery-khulna', 'singara'),
  ('new-howrah-bakery-khulna', 'faluda'),
  ('rupsha-ghat-khulna', 'ghugni')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('khulna', 'chui-jhal', 'https://www.tbsnews.net/features/food/ode-khulna-love-food-1107281')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
