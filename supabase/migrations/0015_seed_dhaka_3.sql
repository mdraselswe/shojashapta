-- 0015: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('karwan-bazar', 'কারওয়ান বাজার', 'Karwan Bazar')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('star-hotel-karwan-bazar-dhaka', 'স্টার হোটেল (কারওয়ান বাজার)', 'Star Hotel Karwan Bazar', 'restaurant', 'karwan-bazar', 'স্টার হোটেল (কারওয়ান বাজার) star hotel karwan bazar', 'star hatel karuian bajar star hatel karban bajar'),
  ('rabbani-hotel-dhaka', 'রাব্বানী হোটেল', 'Rabbani Hotel', 'restaurant', 'mirpur', 'রাব্বানী হোটেল rabbani hotel', 'rabani hatel'),
  ('hotel-jannat-dhaka', 'হোটেল জান্নাত', 'Hotel Jannat', 'restaurant', 'mohammadpur', 'হোটেল জান্নাত hotel jannat', 'hatel janat'),
  ('mamun-biryani-house-dhaka', 'মামুন বিরিয়ানি হাউস', 'Mamun Biryani House', 'restaurant', 'nazira-bazar', 'মামুন বিরিয়ানি হাউস mamun biryani house', 'mamun biriani haus mamun biriani hause')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('star-hotel-karwan-bazar-dhaka', 'kacchi'),
  ('star-hotel-karwan-bazar-dhaka', 'kabab'),
  ('rabbani-hotel-dhaka', 'chaap'),
  ('rabbani-hotel-dhaka', 'kabab'),
  ('hotel-jannat-dhaka', 'kabab'),
  ('mamun-biryani-house-dhaka', 'kacchi')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
