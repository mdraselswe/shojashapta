-- 0016: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('chawkbazar', 'চকবাজার', 'Chawkbazar'),
  ('lalbagh', 'লালবাগ', 'Lalbagh'),
  ('shakharibazar', 'শাঁখারীবাজার', 'Shakharibazar'),
  ('nawabpur', 'নবাবপুর', 'Nawabpur')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('boro-baper-polay-khay', 'বড় বাপের পোলায় খায়', 'Boro Baper Polay Khay', 'ছোলা, কিমা, ডিম, মগজসহ নানা উপকরণ ঘিয়ে মসলায় মেশানো চকবাজারের ইফতারের পরিচিত পদ।', 'বড় বাপের পোলায় খায় boro baper polay khay', 'bar baper palai kai bara baper palai kai', true),
  ('jilapi', 'জিলাপি', 'Jilapi', 'ময়দার গোলা তেলে ভেজে চিনির রসে ডোবানো মিষ্টি। চকবাজারের শাহী জিলাপি রমজানে বিশেষ পরিচিত।', 'জিলাপি jilapi', 'jilapi', true),
  ('haleem', 'হালিম', 'Haleem', 'ডাল, গম ও মাংস একসঙ্গে ঘন করে রান্না করা খাবার। ইফতারে জনপ্রিয়।', 'হালিম haleem', 'halim', true),
  ('borhani', 'বোরহানি', 'Borhani', 'দইয়ের ঝাল-টক পানীয়। বিরিয়ানি ও ইফতারের সঙ্গে খাওয়া হয়।', 'বোরহানি borhani', 'barani', true),
  ('kalo-jam', 'কালো জাম', 'Kalo Jam', 'ছানা বা খোয়ার গাঢ় রঙের ভাজা মিষ্টি, চিনির রসে ভেজা।', 'কালো জাম kalo jam', 'kala jam', true),
  ('malai-chop', 'মালাই চপ', 'Malai Chop', 'মালাইয়ে ডোবানো নরম ছানার মিষ্টি।', 'মালাই চপ malai chop', 'malai cap', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('boro-baper-polay-khay', 'boro baper pola khay', 'bara baper pala kai'),
  ('boro-baper-polay-khay', 'bara bapke pole khay', 'bara bapke pale kai'),
  ('boro-baper-polay-khay', 'boro baper polay khai', 'bara baper palai kai'),
  ('boro-baper-polay-khay', 'বড় বাপের পোলা', 'bar baper pala'),
  ('jilapi', 'jalebi', 'jalebi'),
  ('jilapi', 'jilebi', 'jilebi'),
  ('jilapi', 'shahi jilapi', 'sahi jilapi'),
  ('jilapi', 'জিলেপি', 'jilepi'),
  ('jilapi', 'শাহী জিলাপি', 'sahi jilapi'),
  ('haleem', 'halim', 'halim'),
  ('haleem', 'haleem', 'halim'),
  ('haleem', 'হালীম', 'halim'),
  ('borhani', 'burhani', 'burani'),
  ('borhani', 'borhani', 'barani'),
  ('borhani', 'বুরহানি', 'burani'),
  ('kalo-jam', 'kalojam', 'kalajam'),
  ('kalo-jam', 'kala jamun', 'kala jamun'),
  ('kalo-jam', 'kalo jaam', 'kala jam'),
  ('kalo-jam', 'কালোজাম', 'kalajam'),
  ('malai-chop', 'malai chap', 'malai cap'),
  ('malai-chop', 'malaichop', 'malaicap'),
  ('malai-chop', 'মালাইচপ', 'malaicap')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('chawkbazar-iftar-market-dhaka', 'চকবাজারের ইফতার বাজার', 'Chawkbazar iftar market', 'street_food', 'chawkbazar', 'চকবাজারের ইফতার বাজার chawkbazar iftar market', 'cakabajarer iftar bajar cabkbajar iftar market'),
  ('madina-mishtanno-bhandar-dhaka', 'মদিনা মিষ্টান্ন ভাণ্ডার', 'Madina Mishtanno Bhandar', 'shop', 'lalbagh', 'মদিনা মিষ্টান্ন ভাণ্ডার madina mishtanno bhandar', 'madina mistan bandar madina mistana bandar'),
  ('omullo-mishtanno-bhandar-dhaka', 'অমূল্য মিষ্টান্ন ভাণ্ডার', 'Omullo Mishtanno Bhandar', 'shop', 'shakharibazar', 'অমূল্য মিষ্টান্ন ভাণ্ডার omullo mishtanno bhandar', 'amuli mistan bandar amula mistana bandar'),
  ('green-sweet-meat-dhaka', 'গ্রিন সুইট মিট', 'Green Sweet Meat', 'shop', 'thatari-bazar', 'গ্রিন সুইট মিট green sweet meat', 'grin suit mit grin sbit meat'),
  ('shonamia-mishtanno-bhandar-dhaka', 'সোনামিয়া মিষ্টান্ন ভাণ্ডার', 'Shonamia Mishtanno Bhandar', 'shop', 'gandaria', 'সোনামিয়া মিষ্টান্ন ভাণ্ডার shonamia mishtanno bhandar', 'sanamia mistan bandar sanamia mistana bandar'),
  ('moron-chand-and-grandsons-dhaka', 'মরণ চাঁদ অ্যান্ড গ্র্যান্ডসন্স', 'Moron Chand and Grandsons', 'shop', 'nawabpur', 'মরণ চাঁদ অ্যান্ড গ্র্যান্ডসন্স moron chand and grandsons', 'maran cad aiand griandasans maran cand and grandsans')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('chawkbazar-iftar-market-dhaka', 'boro-baper-polay-khay'),
  ('chawkbazar-iftar-market-dhaka', 'jilapi'),
  ('chawkbazar-iftar-market-dhaka', 'haleem'),
  ('chawkbazar-iftar-market-dhaka', 'borhani'),
  ('madina-mishtanno-bhandar-dhaka', 'malai-chop'),
  ('omullo-mishtanno-bhandar-dhaka', 'kalo-jam'),
  ('green-sweet-meat-dhaka', 'jilapi'),
  ('shonamia-mishtanno-bhandar-dhaka', 'chomchom'),
  ('shonamia-mishtanno-bhandar-dhaka', 'doi'),
  ('shonamia-mishtanno-bhandar-dhaka', 'rasmalai'),
  ('moron-chand-and-grandsons-dhaka', 'rasmalai'),
  ('moron-chand-and-grandsons-dhaka', 'kalo-jam')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('dhaka', 'boro-baper-polay-khay', 'চকবাজারের ইফতার', 'https://en.wikipedia.org/wiki/Chawkbazar_Iftar_Market', 20),
  ('dhaka', 'jilapi', 'চকবাজারের শাহী জিলাপি', 'https://en.wikipedia.org/wiki/Shahi_jilapi', 21)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
