-- 0023: Bogura content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('bogura-city', 'বগুড়া শহর', 'Bogura city'),
  ('nawabbari', 'নবাববাড়ি', 'Nawabbari'),
  ('sherpur', 'শেরপুর', 'Sherpur'),
  ('jhautala', 'ঝাউতলা', 'Jhautala')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'bogura'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('shri-gour-gopal-dadhi-bhandar-bogura', 'শ্রী গৌর গোপাল দধি ও মিষ্টান্ন ভাণ্ডার', 'Shri Gour Gopal Dadhi and Mistanna Bhandar', 'shop', 'nawabbari', 'শ্রী গৌর গোপাল দধি ও মিষ্টান্ন ভাণ্ডার shri gour gopal dadhi and mistanna bhandar', 'sri gaur gapal dadi a mistan bandar sri gaur gapal dadi and mistana bandar'),
  ('ruchita-bogura', 'রুচিতা', 'Ruchita', 'shop', 'nawabbari', 'রুচিতা ruchita', 'rucita'),
  ('sherpur-doi-ghar-bogura', 'শেরপুর দই ঘর', 'Sherpur Doi Ghar', 'shop', 'sherpur', 'শেরপুর দই ঘর sherpur doi ghar', 'serpur dai gar'),
  ('enam-doi-ghar-bogura', 'এনাম দই ঘর', 'Enam Doi Ghar', 'shop', 'jhautala', 'এনাম দই ঘর enam doi ghar', 'enam dai gar'),
  ('asia-sweets-bogura', 'এশিয়া সুইটস', 'Asia Sweets', 'shop', 'bogura-city', 'এশিয়া সুইটস asia sweets', 'esia suitas asia sbits'),
  ('akbaria-bogura', 'আকবরিয়া', 'Akbaria', 'shop', 'bogura-city', 'আকবরিয়া akbaria', 'akabaria akbaria'),
  ('chinipata-bogura', 'চিনিপাতা', 'Chinipata', 'shop', 'bogura-city', 'চিনিপাতা chinipata', 'cinipata'),
  ('shyamoli-hotel-bogura', 'শ্যামলী হোটেল অ্যান্ড রেস্টুরেন্ট', 'Shyamoli Hotel and Restaurant', 'restaurant', 'bogura-city', 'শ্যামলী হোটেল অ্যান্ড রেস্টুরেন্ট shyamoli hotel and restaurant', 'siamli hatel aiand resturent siamali hatel and restaurant')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'bogura'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('shri-gour-gopal-dadhi-bhandar-bogura', 'doi'),
  ('ruchita-bogura', 'doi'),
  ('sherpur-doi-ghar-bogura', 'doi'),
  ('enam-doi-ghar-bogura', 'doi'),
  ('asia-sweets-bogura', 'doi'),
  ('akbaria-bogura', 'doi'),
  ('chinipata-bogura', 'doi'),
  ('shyamoli-hotel-bogura', 'doi')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('bogura', 'doi', 'https://www.bssnews.net/district/316161')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
