-- 0019: Sylhet content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.



insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('akhni', 'আখনি', 'Akhni', 'কম মসলায় ছোট টুকরো মাংস দিয়ে রান্না করা সিলেটের পোলাও-জাতীয় খাবার। রমজানে ইফতারে জনপ্রিয়।', 'আখনি akhni', 'akni', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('akhni', 'akni', 'akni'),
  ('akhni', 'akhni biryani', 'akni biriani'),
  ('akhni', 'আখনি বিরিয়ানি', 'akni biriani')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;





insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('panshi-restaurant-sylhet', 'shatkora-beef'),
  ('pach-bhai-restaurant-sylhet', 'shatkora-beef')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('sylhet', 'akhni', 'সিলেটের ইফতারের আখনি', 'https://www.thedailystar.net/news/bangladesh/news/akhni-staple-sylheti-iftars-3583866', 50)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;

update regional_fame rf
set source_url = v.source_url
from (values
  ('sylhet', 'shatkora-beef', 'https://en.wikipedia.org/wiki/Satkara_beef')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
