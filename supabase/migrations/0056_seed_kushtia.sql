-- 0056: Kushtia content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('joynabad', 'জয়নাবাদ', 'Joynabad')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'kushtia'
on conflict (district_id, slug) do nothing;





insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('bhai-bhai-til-khaja-kushtia', 'নিউ স্পেশাল ভাই ভাই তিলের খাজা', 'New Special Bhai Bhai Tiler Khaja', 'shop', 'joynabad', 'নিউ স্পেশাল ভাই ভাই তিলের খাজা new special bhai bhai tiler khaja', 'niu spesal bai bai tiler kaja neb special bai bai tiler kaja')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'kushtia'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('bhai-bhai-til-khaja-kushtia', 'til-khaja')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;



update regional_fame rf
set source_url = v.source_url
from (values
  ('kushtia', 'til-khaja', 'https://bangla.thedailystar.net/news/bangladesh/news-415586')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
