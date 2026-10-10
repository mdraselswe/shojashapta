-- 0038: Sirajganj content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('banshtala-bazar', 'বাঁশতলা বাজার', 'Banshtala Bazar'),
  ('enayetpur', 'এনায়েতপুর', 'Enayetpur')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'sirajganj'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('pantua', 'পানতোয়া', 'Pantua', 'ছানা ও ময়দার গোল, ভাজা, রসে ডোবানো মিষ্টি। সিরাজগঞ্জ যমুনাপারে পরিচিত।', 'পানতোয়া pantua', 'pantaia pantua', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('pantua', 'panthua', 'pantua'),
  ('pantua', 'pantoa', 'panta'),
  ('pantua', 'পান্তুয়া', 'pantuia'),
  ('pantua', 'পানতুয়া', 'pantuia')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('bholanath-mistanna-bhandar-chauhali', 'ভোলানাথ মিষ্টান্ন ভান্ডার', 'Bholanath Mistanna Bhandar', 'shop', 'banshtala-bazar', 'ভোলানাথ মিষ্টান্ন ভান্ডার bholanath mistanna bhandar', 'balanat mistan bandar balanat mistana bandar'),
  ('rani-mistanna-bhandar-enayetpur', 'রনি মিষ্টান্ন ভান্ডার', 'Rani Mistanna Bhandar', 'shop', 'enayetpur', 'রনি মিষ্টান্ন ভান্ডার rani mistanna bhandar', 'rani mistan bandar rani mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'sirajganj'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('bholanath-mistanna-bhandar-chauhali', 'pantua'),
  ('rani-mistanna-bhandar-enayetpur', 'pantua'),
  ('rani-mistanna-bhandar-enayetpur', 'roshogolla'),
  ('rani-mistanna-bhandar-enayetpur', 'rasmalai')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;





update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
