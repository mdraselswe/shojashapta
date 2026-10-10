-- 0018: Chattogram content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('chattogram-city', 'চট্টগ্রাম শহর', 'Chattogram city'),
  ('shulakbahar', 'শুলকবহর', 'Shulakbahar'),
  ('ak-khan', 'এ কে খান মোড়', 'AK Khan'),
  ('ss-khaled-road', 'এস এস খালেদ রোড', 'SS Khaled Road'),
  ('pahartali', 'পাহাড়তলী', 'Pahartali'),
  ('railway-station', 'রেলওয়ে স্টেশন এলাকা', 'Railway Station'),
  ('ma-aziz-stadium', 'এম এ আজিজ স্টেডিয়াম', 'MA Aziz Stadium'),
  ('jhautola', 'ঝাউতলা', 'Jhautola')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'chattogram'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('biscuit', 'বিস্কুট', 'Biscuit', 'কাঠের চুলায় সেঁকা বেকারির বিস্কুট ও পাউরুটি।', 'বিস্কুট biscuit', 'biskut biscuit', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('biscuit', 'biscuit', 'biscuit'),
  ('biscuit', 'biscut', 'biscut'),
  ('biscuit', 'বিস্কিট', 'biskit'),
  ('biscuit', 'bakery biscuit', 'bakeri biscuit')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('mezzan-haile-aiyun-chattogram', 'মেজ্জান হাইলে আইয়ুন', 'Mezzan Haile Aiyun', 'restaurant', 'shulakbahar', 'মেজ্জান হাইলে আইয়ুন mezzan haile aiyun', 'mejan haile aiun'),
  ('kutumbari-chattogram', 'কুটুমবাড়ি', 'Kutumbari', 'restaurant', 'ak-khan', 'কুটুমবাড়ি kutumbari', 'kutumbari'),
  ('bir-chattala-chattogram', 'বীর চট্টলা', 'Bir Chattala', 'restaurant', 'ss-khaled-road', 'বীর চট্টলা bir chattala', 'bir catala'),
  ('member-hotel-chattogram', 'মেম্বার হোটেল', 'Member Hotel', 'restaurant', 'pahartali', 'মেম্বার হোটেল member hotel', 'membar hatel member hatel'),
  ('hotel-nizam-chattogram', 'হোটেল নিজাম', 'Hotel Nizam', 'restaurant', 'railway-station', 'হোটেল নিজাম hotel nizam', 'hatel nijam'),
  ('hamid-bhai-malai-tea-chattogram', 'হামিদ ভাইয়ের মালাই চা', 'Hamid Bhai er Malai Tea', 'street_food', 'ma-aziz-stadium', 'হামিদ ভাইয়ের মালাই চা hamid bhai er malai tea', 'hamid baier malai ca hamid bai er malai tea'),
  ('goni-bakery-chattogram', 'গনি বেকারি', 'Goni Bakery', 'bakery', 'chattogram-city', 'গনি বেকারি goni bakery', 'gani bekari gani bakeri'),
  ('jhautola-street-food-chattogram', 'ঝাউতলার স্ট্রিট ফুড', 'Jhautola street food', 'street_food', 'jhautola', 'ঝাউতলার স্ট্রিট ফুড jhautola street food', 'jautlar strit fud jautala strit fud')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'chattogram'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('mezzan-haile-aiyun-chattogram', 'mezbani'),
  ('kutumbari-chattogram', 'kacchi'),
  ('kutumbari-chattogram', 'paya'),
  ('bir-chattala-chattogram', 'khichuri'),
  ('bir-chattala-chattogram', 'bhorta'),
  ('member-hotel-chattogram', 'bhorta'),
  ('hotel-nizam-chattogram', 'bhorta'),
  ('hamid-bhai-malai-tea-chattogram', 'cha'),
  ('goni-bakery-chattogram', 'biscuit'),
  ('jhautola-street-food-chattogram', 'chaap'),
  ('jhautola-street-food-chattogram', 'haleem')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('chattogram', 'mezbani', 'https://www.tbsnews.net/features/food/mezban-cuisine-choice-feasts-310606')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
