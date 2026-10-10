-- 0022: Rajshahi content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('new-market', 'নিউ মার্কেট', 'New Market'),
  ('laxmipur', 'লক্ষ্মীপুর', 'Laxmipur'),
  ('malopara', 'মালোপাড়া', 'Malopara'),
  ('ranibazar', 'রানীবাজার', 'Ranibazar'),
  ('saheb-bazar', 'সাহেব বাজার', 'Saheb Bazar'),
  ('batar-mor', 'বাটার মোড়', 'Batar Mor'),
  ('sadhur-mor', 'সাধুর মোড়', 'Sadhur Mor')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'rajshahi'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('puri-burger', 'পুরি বার্গার', 'Puri Burger', 'পুরির ভেতরে পাকোড়া-সিঙ্গারার কুচি ও সস দেওয়া রাজশাহীর রাস্তার খাবার।', 'পুরি বার্গার puri burger', 'puri bargar puri burger', true),
  ('seekh-burger', 'সিক বার্গার', 'Seekh Burger', 'সিক কাবাব ভরা বার্গার। রাজশাহীর সাধুর মোড়ের সন্ধ্যার খাবার।', 'সিক বার্গার seekh burger', 'sik bargar sik burger', true),
  ('kaliza-singara', 'কলিজা সিঙ্গারা', 'Kaliza Singara', 'গরুর কলিজার পুর দেওয়া সিঙ্গারা। রাজশাহীর পরিচিত নাশতা।', 'কলিজা সিঙ্গারা kaliza singara', 'kalija singara', true),
  ('chanar-polao', 'ছানার পোলাও', 'Chanar Polao', 'ছানা দিয়ে তৈরি পোলাওয়ের মতো দেখতে মিষ্টি।', 'ছানার পোলাও chanar polao', 'canar pala', true),
  ('mishti', 'মিষ্টি', 'Mishti', 'বাংলাদেশের নানা রকম মিষ্টির সাধারণ নাম।', 'মিষ্টি mishti', 'misti', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('puri-burger', 'puri burger', 'puri burger'),
  ('puri-burger', 'puri-burger', 'puri burger'),
  ('puri-burger', 'পুরি বার্গার', 'puri bargar'),
  ('seekh-burger', 'seek burger', 'sik burger'),
  ('seekh-burger', 'shik burger', 'sik burger'),
  ('seekh-burger', 'সিখ বার্গার', 'sik bargar'),
  ('kaliza-singara', 'koliza singara', 'kalija singara'),
  ('kaliza-singara', 'koliji singara', 'kaliji singara'),
  ('kaliza-singara', 'কলিজা সমুচা', 'kalija samuca'),
  ('kaliza-singara', 'কলিজা সিংগারা', 'kalija singara'),
  ('chanar-polao', 'chhanar polao', 'canar pala'),
  ('chanar-polao', 'chana polao', 'cana pala'),
  ('chanar-polao', 'ছানার পুলাও', 'canar pula'),
  ('mishti', 'sweets', 'sbits'),
  ('mishti', 'sweetmeat', 'sbitmeat'),
  ('mishti', 'মিষ্টান্ন', 'mistan')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('puri-burger-new-market-rajshahi', 'নিউ মার্কেটের পুরি বার্গার', 'New Market puri burger', 'street_food', 'new-market', 'নিউ মার্কেটের পুরি বার্গার new market puri burger', 'niu marketer puri bargar neb market puri burger'),
  ('sadhur-mor-seekh-burger-rajshahi', 'সাধুর মোড়ের সিক বার্গার', 'Sadhur Mor seekh burger', 'street_food', 'sadhur-mor', 'সাধুর মোড়ের সিক বার্গার sadhur mor seekh burger', 'sadur marer sik bargar sadur mar sik burger'),
  ('haji-restaurant-rajshahi', 'হাজী রেস্টুরেন্ট', 'Haji Restaurant', 'restaurant', 'laxmipur', 'হাজী রেস্টুরেন্ট haji restaurant', 'haji resturent haji restaurant'),
  ('tripti-restaurant-rajshahi', 'তৃপ্তি রেস্টুরেন্ট', 'Tripti Restaurant', 'restaurant', 'laxmipur', 'তৃপ্তি রেস্টুরেন্ট tripti restaurant', 'tripti resturent tripti restaurant'),
  ('jorakali-restaurant-rajshahi', 'জোড়াকালী রেস্টুরেন্ট', 'Jorakali Restaurant', 'restaurant', 'malopara', 'জোড়াকালী রেস্টুরেন্ট jorakali restaurant', 'jarakali resturent jarakali restaurant'),
  ('ranars-sweet-rajshahi', 'রানার মিষ্টি', 'Ranar''s Sweet', 'shop', 'ranibazar', 'রানার মিষ্টি ranar''s sweet', 'ranar misti ranar s sbit'),
  ('noborup-rajshahi', 'নবরূপ', 'Noborup', 'shop', 'saheb-bazar', 'নবরূপ noborup', 'nabarup'),
  ('batar-morer-jilapi-rajshahi', 'বাটার মোড়ের জিলাপি', 'Batar Morer Jilapi', 'shop', 'batar-mor', 'বাটার মোড়ের জিলাপি batar morer jilapi', 'batar marer jilapi')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'rajshahi'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('puri-burger-new-market-rajshahi', 'puri-burger'),
  ('sadhur-mor-seekh-burger-rajshahi', 'seekh-burger'),
  ('haji-restaurant-rajshahi', 'kaliza-singara'),
  ('tripti-restaurant-rajshahi', 'kaliza-singara'),
  ('jorakali-restaurant-rajshahi', 'luchi'),
  ('ranars-sweet-rajshahi', 'mishti'),
  ('noborup-rajshahi', 'chanar-polao'),
  ('batar-morer-jilapi-rajshahi', 'jilapi')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('rajshahi', 'jilapi', 'বাটার মোড়ের জিলাপি', 'https://www.tbsnews.net/feature/food/rajshahi-food-you-should-never-miss', 60),
  ('rajshahi', 'puri-burger', 'নিউ মার্কেটের পুরি বার্গার', 'https://www.tbsnews.net/feature/food/rajshahi-food-you-should-never-miss', 61)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
