-- 0014: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('farmgate', 'ফার্মগেট', 'Farmgate'),
  ('banani', 'বনানী', 'Banani'),
  ('shahbagh', 'শাহবাগ', 'Shahbagh'),
  ('iskaton', 'ইস্কাটন', 'Iskaton'),
  ('bashundhara', 'বসুন্ধরা', 'Bashundhara'),
  ('hazaribagh', 'হাজারীবাগ', 'Hazaribagh')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('chitoi-pitha', 'চিতই পিঠা', 'Chitoi Pitha', 'চালের গুঁড়োর ছোট পিঠা। শীতে নানা রকম ভর্তার সঙ্গে খাওয়া হয়।', 'চিতই পিঠা chitoi pitha', 'citai pita', true),
  ('fish-bbq', 'ফিশ বারবিকিউ', 'Fish BBQ', 'মসলা মাখিয়ে আগুনে সেঁকা মাছ।', 'ফিশ বারবিকিউ fish bbq', 'fis barbikiu fis bk', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('chitoi-pitha', 'chitoi', 'citai'),
  ('chitoi-pitha', 'chita pitha', 'cita pita'),
  ('chitoi-pitha', 'chhita pitha', 'cita pita'),
  ('chitoi-pitha', 'চিতই', 'citai'),
  ('fish-bbq', 'fish barbecue', 'fis barbecue'),
  ('fish-bbq', 'fish bbq', 'fis bk'),
  ('fish-bbq', 'মাছ বারবিকিউ', 'mac barbikiu')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('farmgate-chitoi-pitha-dhaka', 'ফার্মগেটের ফুটপাতের চিতই পিঠা', 'Farmgate pavement chitoi pitha', 'street_food', 'farmgate', 'ফার্মগেটের ফুটপাতের চিতই পিঠা farmgate pavement chitoi pitha', 'farmageter futpater citai pita farmgate pabement citai pita'),
  ('bukhara-banani-dhaka', 'বুখারা', 'Bukhara', 'restaurant', 'banani', 'বুখারা bukhara', 'bukara'),
  ('lucknow-banani-dhaka', 'লখনউ', 'Lucknow', 'restaurant', 'banani', 'লখনউ lucknow', 'lakanau luknab'),
  ('madhur-canteen-dhaka', 'মধুর ক্যান্টিন', 'Madhur Canteen', 'restaurant', 'shahbagh', 'মধুর ক্যান্টিন madhur canteen', 'madur kiantin madur cantin'),
  ('iskaton-garden-road-kabab-van-dhaka', 'ইস্কাটন গার্ডেন রোডের কাবাব ভ্যান', 'Iskaton Garden Road kabab vans', 'street_food', 'iskaton', 'ইস্কাটন গার্ডেন রোডের কাবাব ভ্যান iskaton garden road kabab vans', 'iskatan garden rader kabab bian iskatan garden rad kabab bans'),
  ('metro-kitchens-dhaka', 'মেট্রো কিচেনস', 'Metro Kitchens', 'other', 'bashundhara', 'মেট্রো কিচেনস metro kitchens', 'metra kicenas metra kitcens'),
  ('tehari-ghar-dhanmondi-dhaka', 'তেহারি ঘর', 'Tehari Ghar', 'restaurant', 'dhanmondi', 'তেহারি ঘর tehari ghar', 'tehari gar'),
  ('moti-biryani-house-dhaka', 'মতি বিরিয়ানি হাউস', 'Moti Biryani House', 'restaurant', 'nazira-bazar', 'মতি বিরিয়ানি হাউস moti biryani house', 'mati biriani haus mati biriani hause'),
  ('shad-tehari-ghar-dhaka', 'শাদ তেহারি ঘর', 'Shad Tehari Ghar', 'restaurant', 'lalmatia', 'শাদ তেহারি ঘর shad tehari ghar', 'sad tehari gar'),
  ('maruf-biryani-house-dhaka', 'মারুফ বিরিয়ানি হাউস', 'Maruf Biryani House', 'restaurant', 'hazaribagh', 'মারুফ বিরিয়ানি হাউস maruf biryani house', 'maruf biriani haus maruf biriani hause')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('farmgate-chitoi-pitha-dhaka', 'chitoi-pitha'),
  ('farmgate-chitoi-pitha-dhaka', 'bhorta'),
  ('bukhara-banani-dhaka', 'kabab'),
  ('lucknow-banani-dhaka', 'kabab'),
  ('madhur-canteen-dhaka', 'cha'),
  ('iskaton-garden-road-kabab-van-dhaka', 'kabab'),
  ('metro-kitchens-dhaka', 'fish-bbq'),
  ('tehari-ghar-dhanmondi-dhaka', 'tehari'),
  ('moti-biryani-house-dhaka', 'tehari'),
  ('shad-tehari-ghar-dhaka', 'tehari'),
  ('maruf-biryani-house-dhaka', 'tehari')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
