-- 0046: Jhalokati content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('kamarpatti', 'কামারপট্টি', 'Kamarpatti'),
  ('sadhanar-mor', 'সাধনার মোড়', 'Sadhanar Mor'),
  ('boro-bazar', 'বড় বাজার', 'Boro Bazar'),
  ('hoglapatti', 'হোগলাপট্টি', 'Hoglapatti'),
  ('sadar-chowmatha', 'সদর চৌমাথা', 'Sadar Chowmatha')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'jhalokati'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('debnath-mistanna-bhandar-jhalokati', 'দেবনাথ মিষ্টান্ন ভান্ডার', 'Debnath Mistanna Bhandar', 'shop', 'kamarpatti', 'দেবনাথ মিষ্টান্ন ভান্ডার debnath mistanna bhandar', 'debnat mistan bandar debnat mistana bandar'),
  ('nagen-ghosh-sweets-jhalokati', 'নগেন ঘোষের মিষ্টির দোকান', 'Nagen Ghosh''s sweet shop', 'shop', 'sadhanar-mor', 'নগেন ঘোষের মিষ্টির দোকান nagen ghosh''s sweet shop', 'nagen gaser mistir dakan nagen gas s sbit sap'),
  ('gopal-ghosh-roshogolla-jhalokati', 'গোপাল ঘোষের রসগোল্লা', 'Gopal Ghosh''s Roshogolla', 'shop', 'boro-bazar', 'গোপাল ঘোষের রসগোল্লা gopal ghosh''s roshogolla', 'gapal gaser rasagala gapal gas s rasagala'),
  ('naren-kuri-roshogolla-jhalokati', 'নরেন কুড়ির রসগোল্লা', 'Naren Kuri''s Roshogolla', 'shop', 'hoglapatti', 'নরেন কুড়ির রসগোল্লা naren kuri''s roshogolla', 'naren kurir rasagala naren kuri s rasagala'),
  ('muslim-mistanna-bhandar-jhalokati', 'মুসলিম মিষ্টান্ন ভান্ডার', 'Muslim Mistanna Bhandar', 'shop', 'sadar-chowmatha', 'মুসলিম মিষ্টান্ন ভান্ডার muslim mistanna bhandar', 'muslim mistan bandar muslim mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'jhalokati'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('debnath-mistanna-bhandar-jhalokati', 'roshogolla'),
  ('debnath-mistanna-bhandar-jhalokati', 'rasmalai'),
  ('nagen-ghosh-sweets-jhalokati', 'roshogolla'),
  ('gopal-ghosh-roshogolla-jhalokati', 'roshogolla'),
  ('naren-kuri-roshogolla-jhalokati', 'roshogolla'),
  ('muslim-mistanna-bhandar-jhalokati', 'roshogolla')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('jhalokati', 'roshogolla', 'ঝালকাঠির রসগোল্লা', 'https://www.prothomalo.com/bangladesh/district/v6bazog45s', 126)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
