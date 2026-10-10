-- 0028: Coxs-bazar content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('coxs-bazar-town', 'কক্সবাজার শহর', 'Cox''s Bazar town')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'coxs-bazar'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('loitta-fry', 'লইট্যা ফ্রাই', 'Loitta Fry', 'লইট্যা (বোম্বে ডাক) মাছের ভাজা। কক্সবাজারে ভ্রমণকারীদের পরিচিত পদ।', 'লইট্যা ফ্রাই loitta fry', 'laitia frai laita fri', true),
  ('rupchanda-fry', 'রূপচাঁদা ফ্রাই', 'Rupchanda Fry', 'সামুদ্রিক রূপচাঁদা (পমফ্রেট) মাছের ভাজা বা গ্রিল।', 'রূপচাঁদা ফ্রাই rupchanda fry', 'rupcada frai rupcanda fri', true),
  ('spicy-crab', 'স্পাইসি ক্র্যাব', 'Spicy Crab', 'ঝাল মসলায় রান্না করা কাঁকড়া। কক্সবাজারের সামুদ্রিক খাবারের পরিচিত পদ।', 'স্পাইসি ক্র্যাব spicy crab', 'spaisi kriab spici crab', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('loitta-fry', 'loitta fry', 'laita fri'),
  ('loitta-fry', 'bombay duck fry', 'bambai duk fri'),
  ('loitta-fry', 'bombil fry', 'bambil fri'),
  ('loitta-fry', 'লইট্টা ফ্রাই', 'laita frai'),
  ('loitta-fry', 'লইট্যা মাছ ভাজা', 'laitia mac baja'),
  ('rupchanda-fry', 'rupchanda fry', 'rupcanda fri'),
  ('rupchanda-fry', 'pomfret fry', 'pamfret fri'),
  ('rupchanda-fry', 'rupchada fry', 'rupcada fri'),
  ('rupchanda-fry', 'রূপচান্দা ফ্রাই', 'rupcanda frai'),
  ('spicy-crab', 'spicy crab', 'spici crab'),
  ('spicy-crab', 'crab masala', 'crab masala'),
  ('spicy-crab', 'kakra', 'kakra'),
  ('spicy-crab', 'কাঁকড়া ভুনা', 'kakara buna'),
  ('spicy-crab', 'কাঁকড়ার ঝাল', 'kakarar jal')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('poushi-restaurant-coxs-bazar', 'পৌষী রেস্টুরেন্ট', 'Poushi Restaurant', 'restaurant', 'coxs-bazar-town', 'পৌষী রেস্টুরেন্ট poushi restaurant', 'pausi resturent pausi restaurant'),
  ('jhaubon-coxs-bazar', 'ঝাউবন', 'Jhaubon', 'restaurant', 'coxs-bazar-town', 'ঝাউবন jhaubon', 'jauban'),
  ('salt-bistro-cafe-coxs-bazar', 'সল্ট বিস্ট্রো অ্যান্ড ক্যাফে', 'Salt Bistro and Cafe', 'restaurant', 'coxs-bazar-town', 'সল্ট বিস্ট্রো অ্যান্ড ক্যাফে salt bistro and cafe', 'salt bistra aiand kiafe salt bistra and cafe')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'coxs-bazar'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('poushi-restaurant-coxs-bazar', 'loitta-fry'),
  ('jhaubon-coxs-bazar', 'rupchanda-fry'),
  ('salt-bistro-cafe-coxs-bazar', 'spicy-crab')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('coxs-bazar', 'shutki', 'https://www.thedailystar.net/coxs-bazar-to-do-list-48534')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
