-- 0026: Mymensingh content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('swadeshi-bazar', 'স্বদেশি বাজার', 'Swadeshi Bazar'),
  ('boro-kalibari', 'বড় কালীবাড়ি', 'Boro Kalibari'),
  ('muktagachha', 'মুক্তাগাছা', 'Muktagachha'),
  ('mymensingh-city', 'ময়মনসিংহ শহর', 'Mymensingh city')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'mymensingh'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('malaikari', 'মালাইকারী', 'Malaikari', 'ছানার গোল মিষ্টি মাঝ বরাবর কেটে ভেতরে ক্ষীর ভরা ময়মনসিংহের ঐতিহ্যবাহী মিষ্টি।', 'মালাইকারী malaikari', 'malaikari', true),
  ('pera', 'পেঁড়া', 'Pera', 'দুধ ও চিনি জ্বাল দিয়ে তৈরি নরম, দানাদার মিষ্টি।', 'পেঁড়া pera', 'pera', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('malaikari', 'malaikari', 'malaikari'),
  ('malaikari', 'malai kari', 'malai kari'),
  ('malaikari', 'malaikary', 'malaikari'),
  ('malaikari', 'মালাইকারি', 'malaikari'),
  ('pera', 'peda', 'peda'),
  ('pera', 'pera', 'pera'),
  ('pera', 'পেড়া', 'pera'),
  ('pera', 'প্যাড়া', 'piara')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('janaki-nag-sweets-mymensingh', 'জানকী নাগ সুইটস মিট', 'Janaki Nag Sweets', 'shop', 'swadeshi-bazar', 'জানকী নাগ সুইটস মিট janaki nag sweets', 'janki nag suitas mit janaki nag sbits'),
  ('krishna-cabin-mymensingh', 'কৃষ্ণা কেবিন', 'Krishna Cabin', 'shop', 'mymensingh-city', 'কৃষ্ণা কেবিন krishna cabin', 'krisna kebin krisna cabin'),
  ('gopal-pal-monda-muktagachha', 'গোপাল পালের সিংহ মার্কা মণ্ডা', 'Gopal Pal''s Shingha Marka Monda', 'shop', 'muktagachha', 'গোপাল পালের সিংহ মার্কা মণ্ডা gopal pal''s shingha marka monda', 'gapal paler sing marka manda gapal pal s singa marka manda'),
  ('bikrampur-sweet-meat-mymensingh', 'বিক্রমপুর সুইট মিট', 'Bikrampur Sweet Meat', 'shop', 'boro-kalibari', 'বিক্রমপুর সুইট মিট bikrampur sweet meat', 'bikramapur suit mit bikrampur sbit meat'),
  ('adarsha-mistanno-bhandar-mymensingh', 'আদর্শ মিষ্টান্ন ভাণ্ডার', 'Adarsha Mistanno Bhandar', 'shop', 'boro-kalibari', 'আদর্শ মিষ্টান্ন ভাণ্ডার adarsha mistanno bhandar', 'adars mistan bandar adarsa mistana bandar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'mymensingh'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('janaki-nag-sweets-mymensingh', 'malaikari'),
  ('krishna-cabin-mymensingh', 'malaikari'),
  ('gopal-pal-monda-muktagachha', 'monda'),
  ('bikrampur-sweet-meat-mymensingh', 'pera'),
  ('adarsha-mistanno-bhandar-mymensingh', 'pera')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('mymensingh', 'malaikari', 'ময়মনসিংহের মালাইকারী', 'https://www.prothomalo.com/bangladesh/district/x2r6bnyevm', 71)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;

update regional_fame rf
set source_url = v.source_url
from (values
  ('mymensingh', 'monda', 'https://thefinancialexpress.com.bd/national/the-interesting-history-behind-sweetmeat-monda-1578594577')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
