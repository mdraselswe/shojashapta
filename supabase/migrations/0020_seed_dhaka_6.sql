-- 0020: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('satrowza', 'সাতরওজা', 'Satrowza'),
  ('jigatola', 'জিগাতলা', 'Jigatola'),
  ('wari', 'ওয়ারী', 'Wari'),
  ('banasree', 'বনশ্রী', 'Banasree')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('morog-polao', 'মোরগ পোলাও', 'Morog Polao', 'সুগন্ধি চালে দেশি মুরগি দিয়ে রান্না করা হালকা মসলার পোলাও। পুরান ঢাকার পরিচিত খাবার।', 'মোরগ পোলাও morog polao', 'marag pala', true),
  ('nihari', 'নিহারি', 'Nihari', 'গরু বা খাসির শ্যাঙ্কের ধীরে রান্না করা ঘন ঝোল। সাধারণত সকালে রুটি বা নানের সঙ্গে খাওয়া হয়।', 'নিহারি nihari', 'nihari', true),
  ('shawarma', 'শর্মা', 'Shawarma', 'মাংসের সরু টুকরো রুটিতে মুড়িয়ে স্যালাড ও সসের সঙ্গে খাওয়ার রোল। ঢাকায় জনপ্রিয় রাস্তার খাবার।', 'শর্মা shawarma', 'sarma sabarma', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('morog-polao', 'morog pulao', 'marag pula'),
  ('morog-polao', 'murgh polao', 'murg pala'),
  ('morog-polao', 'murgi polao', 'murgi pala'),
  ('morog-polao', 'chicken polao', 'ciken pala'),
  ('morog-polao', 'মোরগ পুলাও', 'marag pula'),
  ('morog-polao', 'শাহী মোরগ পোলাও', 'sahi marag pala'),
  ('nihari', 'nehari', 'nehari'),
  ('nihari', 'nihari', 'nihari'),
  ('nihari', 'নেহারি', 'nehari'),
  ('nihari', 'গরুর নিহারি', 'garur nihari'),
  ('shawarma', 'shwarma', 'sbarma'),
  ('shawarma', 'sharma', 'sarma'),
  ('shawarma', 'shorma', 'sarma'),
  ('shawarma', 'শোয়ারমা', 'saiarma'),
  ('shawarma', 'শাওয়ার্মা', 'saiarma')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('kolkata-kachchi-dhaka', 'কলকাতা কাচ্চি', 'Kolkata Kachchi', 'restaurant', 'satrowza', 'কলকাতা কাচ্চি kolkata kachchi', 'kalakata kaci kalkata kaci'),
  ('grand-nawab-dhaka', 'গ্র্যান্ড নবাব', 'Grand Nawab', 'restaurant', 'puran-dhaka', 'গ্র্যান্ড নবাব grand nawab', 'griand nabab grand nabab'),
  ('kachchi-bhai-dhaka', 'কাচ্চি ভাই', 'Kachchi Bhai', 'restaurant', 'bashundhara', 'কাচ্চি ভাই kachchi bhai', 'kaci bai'),
  ('bashmoti-kachchi-dhaka', 'বাসমতি কাচ্চি', 'Bashmoti Kachchi', 'restaurant', 'jigatola', 'বাসমতি কাচ্চি bashmoti kachchi', 'basamati kaci basmati kaci'),
  ('maa-shahi-halim-dhaka', 'মা শাহী হালিম', 'Maa Shahi Halim (Siddiqui Bhai)', 'restaurant', 'lalbagh', 'মা শাহী হালিম maa shahi halim (siddiqui bhai)', 'ma sahi halim ma sahi halim sidikui bai'),
  ('nihariwala-dhaka', 'নিহারিওয়ালা', 'Nihariwala', 'restaurant', 'banani', 'নিহারিওয়ালা nihariwala', 'nihariaiala niharibala'),
  ('mia-bhai-restaurant-dhaka', 'মিয়া ভাই রেস্টুরেন্ট', 'Mia Bhai Restaurant', 'restaurant', 'banasree', 'মিয়া ভাই রেস্টুরেন্ট mia bhai restaurant', 'mia bai resturent mia bai restaurant'),
  ('peshwarain-dhaka', 'পেশোয়ারাইন', 'Peshwarain', 'restaurant', 'wari', 'পেশোয়ারাইন peshwarain', 'pesaiarain pesbarain'),
  ('grand-chandu-shahi-nihari-dhaka', 'গ্র্যান্ড চান্দু শাহী নিহারি', 'Grand Chandu Shahi Nihari', 'restaurant', 'mirpur', 'গ্র্যান্ড চান্দু শাহী নিহারি grand chandu shahi nihari', 'griand candu sahi nihari grand candu sahi nihari'),
  ('lahori-nihari-dhaka', 'লাহোরি নিহারি ঢাকা', 'Lahori Nihari Dhaka', 'restaurant', 'dhanmondi', 'লাহোরি নিহারি ঢাকা lahori nihari dhaka', 'lahari nihari daka'),
  ('shawarma-house-dhaka', 'শর্মা হাউজ', 'Shawarma House', 'restaurant', 'dhanmondi', 'শর্মা হাউজ shawarma house', 'sarma hauj sabarma hause'),
  ('arabian-fast-food-dhaka', 'আরাবিয়ান ফাস্ট ফুড', 'Arabian Fast Food', 'restaurant', 'dhanmondi', 'আরাবিয়ান ফাস্ট ফুড arabian fast food', 'arabian fast fud'),
  ('pannu-tea-store-dhaka', 'পান্নুর চা', 'Pannu''s Tea', 'street_food', 'nazira-bazar', 'পান্নুর চা pannu''s tea', 'panur ca panu s tea'),
  ('cha-chai-gulshan-dhaka', 'চা চাই', 'Cha Chai', 'restaurant', 'gulshan', 'চা চাই cha chai', 'ca cai')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;

update places p
set area_id = a.id
from (values
  ('sultans-dine-dhaka', 'dhanmondi')
) as v(place_slug, area_slug), areas a
where p.slug = v.place_slug and a.district_id = p.district_id and a.slug = v.area_slug
  and p.area_id is null;

insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('kolkata-kachchi-dhaka', 'kacchi'),
  ('grand-nawab-dhaka', 'kacchi'),
  ('grand-nawab-dhaka', 'tehari'),
  ('kachchi-bhai-dhaka', 'kacchi'),
  ('bashmoti-kachchi-dhaka', 'kacchi'),
  ('maa-shahi-halim-dhaka', 'nihari'),
  ('maa-shahi-halim-dhaka', 'haleem'),
  ('nihariwala-dhaka', 'nihari'),
  ('mia-bhai-restaurant-dhaka', 'nihari'),
  ('peshwarain-dhaka', 'nihari'),
  ('grand-chandu-shahi-nihari-dhaka', 'nihari'),
  ('lahori-nihari-dhaka', 'nihari'),
  ('shawarma-house-dhaka', 'shawarma'),
  ('arabian-fast-food-dhaka', 'shawarma'),
  ('pannu-tea-store-dhaka', 'cha'),
  ('cha-chai-gulshan-dhaka', 'cha'),
  ('junu-polao-ghor-dhaka', 'morog-polao'),
  ('star-hotel-dhaka', 'cha')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('dhaka', 'morog-polao', 'পুরান ঢাকার মোরগ পোলাও', 'https://www.tbsnews.net/feature/food/jhunu-polao-ghor-serving-aromatic-morog-polao-51-years-229126', 40),
  ('dhaka', 'nihari', 'লালবাগের নিহারি', 'https://www.thedailystar.net/my-dhaka/news/why-old-dhakas-siddiqui-bhai-nihari-must-try-3972511', 41),
  ('dhaka', 'cha', 'নাজিরা বাজারের চা', 'https://www.thedailystar.net/life-living/food-recipes/news/the-best-tea-spots-you-can-find-3161996', 42)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
