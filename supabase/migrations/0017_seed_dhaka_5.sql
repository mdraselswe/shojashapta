-- 0017: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('kalabagan', 'কলাবাগান', 'Kalabagan'),
  ('gopibag', 'গোপীবাগ', 'Gopibag'),
  ('motijheel', 'মতিঝিল', 'Motijheel'),
  ('banglabazar', 'বাংলাবাজার', 'Banglabazar'),
  ('hathkhola', 'হাতখোলা', 'Hathkhola'),
  ('chankharpul', 'চানখারপুল', 'Chankharpul'),
  ('baily-road', 'বেইলি রোড', 'Baily Road'),
  ('shantinagar', 'শান্তিনগর', 'Shantinagar')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('luchi', 'লুচি', 'Luchi', 'ময়দার ফোলা ভাজা রুটি। সকালে আলুর দম, ডাল বা হালুয়ার সঙ্গে খাওয়া হয়।', 'লুচি luchi', 'luci', true),
  ('puri-bhaji', 'পুরি-ভাজি', 'Puri Bhaji', 'ভাজা পুরির সঙ্গে সবজির ভাজি। ঢাকার পরিচিত সকালের নাশতা।', 'পুরি-ভাজি puri bhaji', 'puri baji', true),
  ('paratha-bhaji', 'পরোটা-ভাজি', 'Paratha Bhaji', 'পরোটার সঙ্গে সবজির ভাজি। সকালের নাশতার পরিচিত পদ।', 'পরোটা-ভাজি paratha bhaji', 'parata baji', true),
  ('paya', 'পায়া', 'Paya', 'গরু বা খাসির পায়ার ঘন ঝোল। পুরান ঢাকার সকালের নাশতায় পরিচিত।', 'পায়া paya', 'paia', true),
  ('khichuri', 'খিচুড়ি', 'Khichuri', 'চাল আর ডাল একসঙ্গে রান্না করা খাবার। মাংস বা ভর্তার সঙ্গে খাওয়া হয়।', 'খিচুড়ি khichuri', 'kicuri', true),
  ('bhapa-pitha', 'ভাপা পিঠা', 'Bhapa Pitha', 'চালের গুঁড়োর ভেতরে নারকেল-গুড় দিয়ে ভাপে সেদ্ধ করা শীতের পিঠা।', 'ভাপা পিঠা bhapa pitha', 'bapa pita', true),
  ('patishapta', 'পাটিসাপটা', 'Patishapta', 'চালের গোলার পাতলা আস্তরে নারকেল বা ক্ষীরের পুর ভরা পিঠা।', 'পাটিসাপটা patishapta', 'patisapta', true),
  ('puli-pitha', 'পুলি পিঠা', 'Puli Pitha', 'চালের গুঁড়োর খোলে নারকেল বা মাংসের পুর ভরে রান্না করা পিঠা।', 'পুলি পিঠা puli pitha', 'puli pita', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('luchi', 'luci', 'luci'),
  ('luchi', 'loochi', 'luci'),
  ('puri-bhaji', 'puri bhaji', 'puri baji'),
  ('puri-bhaji', 'puri', 'puri'),
  ('puri-bhaji', 'poori bhaji', 'puri baji'),
  ('puri-bhaji', 'পুরি ভাজি', 'puri baji'),
  ('paratha-bhaji', 'porota bhaji', 'parata baji'),
  ('paratha-bhaji', 'paratha bhaji', 'parata baji'),
  ('paratha-bhaji', 'পরোটা ভাজি', 'parata baji'),
  ('paratha-bhaji', 'parota bhaji', 'parata baji'),
  ('paya', 'paya soup', 'paia saup'),
  ('paya', 'paya curry', 'paia curi'),
  ('paya', 'পায়ার ঝোল', 'paiar jal'),
  ('khichuri', 'khichri', 'kicri'),
  ('khichuri', 'khichdi', 'kicdi'),
  ('khichuri', 'খিচুরি', 'kicuri'),
  ('khichuri', 'ভুনা খিচুড়ি', 'buna kicuri'),
  ('bhapa-pitha', 'bhapa', 'bapa'),
  ('bhapa-pitha', 'vapa pitha', 'bapa pita'),
  ('bhapa-pitha', 'ভাপা', 'bapa'),
  ('patishapta', 'patisapta', 'patisapta'),
  ('patishapta', 'patishapta pitha', 'patisapta pita'),
  ('patishapta', 'পাটি সাপটা', 'pati sapta'),
  ('puli-pitha', 'puli', 'puli'),
  ('puli-pitha', 'pulee pitha', 'puli pita'),
  ('puli-pitha', 'পুলি', 'puli')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('mona-bhai-haleem-dhaka', 'মোনা ভাইয়ের হালিম ও স্যুপ', 'Mona Bhai Haleem and Soup', 'shop', 'mohammadpur', 'মোনা ভাইয়ের হালিম ও স্যুপ mona bhai haleem and soup', 'mana baier halim a siup mana bai halim and saup'),
  ('khaza-haleem-dhaka', 'খাজা হালিম', 'Khaza Haleem', 'shop', 'gopibag', 'খাজা হালিম khaza haleem', 'kaja halim'),
  ('mama-haleem-dhaka', 'মামা হালিম', 'Mama Haleem', 'shop', 'kalabagan', 'মামা হালিম mama haleem', 'mama halim'),
  ('decent-bakery-dhaka', 'ডিসেন্ট বেকারি', 'Decent Bakery', 'bakery', 'dhanmondi', 'ডিসেন্ট বেকারি decent bakery', 'disent bekari decent bakeri'),
  ('nirob-hotel-dhaka', 'নিরব হোটেল', 'Nirob Hotel', 'restaurant', 'chankharpul', 'নিরব হোটেল nirob hotel', 'nirab hatel'),
  ('chowrangi-restaurant-dhaka', 'চৌরঙ্গী রেস্টুরেন্ট', 'Chowrangi Restaurant', 'restaurant', 'banglabazar', 'চৌরঙ্গী রেস্টুরেন্ট chowrangi restaurant', 'caurangi resturent cabrangi restaurant'),
  ('hirajheel-hotel-dhaka', 'হীরাঝিল হোটেল', 'Hirajheel Hotel', 'restaurant', 'motijheel', 'হীরাঝিল হোটেল hirajheel hotel', 'hirajil hatel'),
  ('deshbondhu-sweetmeat-dhaka', 'দেশবন্ধু সুইটমিট', 'Deshbondhu Sweetmeat', 'shop', 'hathkhola', 'দেশবন্ধু সুইটমিট deshbondhu sweetmeat', 'desabandu suitmit desbandu sbitmeat'),
  ('bailey-pitha-ghor-dhaka', 'বেইলি পিঠা ঘর', 'Bailey Pitha Ghor', 'restaurant', 'baily-road', 'বেইলি পিঠা ঘর bailey pitha ghor', 'beili pita gar bailei pita gar'),
  ('adda-prabartana-dhaka', 'আড্ডা প্রবর্তনা', 'Adda Prabartana', 'restaurant', 'mohammadpur', 'আড্ডা প্রবর্তনা adda prabartana', 'ada prabartana'),
  ('mirpur-pitha-ghar-dhaka', 'মিরপুর পিঠা ঘর', 'Mirpur Pitha Ghar', 'shop', 'mirpur', 'মিরপুর পিঠা ঘর mirpur pitha ghar', 'mirpur pita gar'),
  ('shantinagar-pitha-ghar-dhaka', 'শান্তিনগর পিঠা ঘর অ্যান্ড কাবাব', 'Shantinagar Pitha Ghar and Kabab', 'restaurant', 'shantinagar', 'শান্তিনগর পিঠা ঘর অ্যান্ড কাবাব shantinagar pitha ghar and kabab', 'santinagar pita gar aiand kabab santinagar pita gar and kabab'),
  ('uttara-pitha-ghar-dhaka', 'উত্তরা পিঠা ঘর', 'Uttara Pitha Ghar', 'shop', 'uttara', 'উত্তরা পিঠা ঘর uttara pitha ghar', 'utara pita gar')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;



insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('mona-bhai-haleem-dhaka', 'haleem'),
  ('khaza-haleem-dhaka', 'haleem'),
  ('mama-haleem-dhaka', 'haleem'),
  ('decent-bakery-dhaka', 'haleem'),
  ('nirob-hotel-dhaka', 'puri-bhaji'),
  ('nirob-hotel-dhaka', 'bhorta'),
  ('chowrangi-restaurant-dhaka', 'luchi'),
  ('hirajheel-hotel-dhaka', 'paya'),
  ('hirajheel-hotel-dhaka', 'khichuri'),
  ('deshbondhu-sweetmeat-dhaka', 'paratha-bhaji'),
  ('bailey-pitha-ghor-dhaka', 'chitoi-pitha'),
  ('bailey-pitha-ghor-dhaka', 'puli-pitha'),
  ('adda-prabartana-dhaka', 'bhapa-pitha'),
  ('adda-prabartana-dhaka', 'chitoi-pitha'),
  ('adda-prabartana-dhaka', 'patishapta'),
  ('mirpur-pitha-ghar-dhaka', 'puli-pitha'),
  ('mirpur-pitha-ghar-dhaka', 'patishapta'),
  ('mirpur-pitha-ghar-dhaka', 'chitoi-pitha'),
  ('shantinagar-pitha-ghar-dhaka', 'chitoi-pitha'),
  ('shantinagar-pitha-ghar-dhaka', 'patishapta'),
  ('uttara-pitha-ghar-dhaka', 'patishapta'),
  ('green-sweet-meat-dhaka', 'luchi')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('dhaka', 'haleem', 'ঢাকার হালিম', 'https://www.tbsnews.net/features/food/5-hearty-haleems-dhaka-city-407646', 30),
  ('dhaka', 'chitoi-pitha', 'শীতের পিঠা', 'https://www.tbsnews.net/feature/food/best-places-get-pitha-winter-186202', 31)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;



update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
