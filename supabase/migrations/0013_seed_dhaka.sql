-- 0013: Dhaka content, by area (generated — do not edit by hand).
-- Source: scripts/seed/dhaka-data.ts · regenerate: pnpm db:seed · sources: docs/content-sources.md
--
-- Same rules as 0007: flagged is_seed (select purge_seed_data(); removes it), and no ratings,
-- reviews, prices, hours, addresses or claims are written here. A place is a name, an area and what
-- it is known for; real people add and verify the rest.

insert into areas (district_id, slug, name_bn, name_en)
select d.id, v.slug, v.name_bn, v.name_en
from (values
  ('puran-dhaka', 'পুরান ঢাকা', 'Old Dhaka'),
  ('nazira-bazar', 'নাজিরা বাজার', 'Nazira Bazar'),
  ('johnson-road', 'জনসন রোড', 'Johnson Road'),
  ('gandaria', 'গেণ্ডারিয়া', 'Gandaria'),
  ('thatari-bazar', 'ঠাটারী বাজার', 'Thatari Bazar'),
  ('armanitola', 'আর্মানিটোলা', 'Armanitola'),
  ('bangshal', 'বংশাল', 'Bangshal'),
  ('agamasi-lane', 'আগামসি লেন', 'Agamasi Lane'),
  ('becharam-dewri', 'বেচারাম দেউড়ি', 'Becharam Dewri'),
  ('mohammadpur', 'মোহাম্মদপুর', 'Mohammadpur'),
  ('lalmatia', 'লালমাটিয়া', 'Lalmatia'),
  ('mirpur', 'মিরপুর', 'Mirpur'),
  ('dhanmondi', 'ধানমন্ডি', 'Dhanmondi'),
  ('gulshan', 'গুলশান', 'Gulshan'),
  ('uttara', 'উত্তরা', 'Uttara')
) as v(slug, name_bn, name_en)
join districts d on d.slug = 'dhaka'
on conflict (district_id, slug) do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('tehari', 'তেহারি', 'Tehari', 'মাংস আর চাল একসঙ্গে মসলায় রান্না করা ঢাকার পরিচিত খাবার। পুরান ঢাকায় বিশেষ জনপ্রিয়।', 'তেহারি tehari', 'tehari', true),
  ('chaap', 'চাপ', 'Chaap', 'হালকা ভাজা মাংসের টুকরো। পরোটা বা লুচির সঙ্গে খাওয়া হয়।', 'চাপ chaap', 'cap', true),
  ('kabab', 'কাবাব', 'Kabab', 'সেঁকা বা ভাজা মাংসের কাবাব। পুরান ঢাকা ও মোহাম্মদপুরের পরিচিত খাবার।', 'কাবাব kabab', 'kabab', true),
  ('lassi', 'লাচ্ছি', 'Lassi', 'দই, চিনি আর বরফ দিয়ে তৈরি ঠান্ডা পানীয়।', 'লাচ্ছি lassi', 'laci lasi', true),
  ('faluda', 'ফালুদা', 'Faluda', 'দুধ, শরবত আর সেমাইয়ের মতো ফালুদা দিয়ে তৈরি ঠান্ডা মিষ্টি।', 'ফালুদা faluda', 'faluda', true),
  ('fuchka', 'ফুচকা', 'Fuchka', 'টক-ঝাল পানিতে ডোবানো ফাঁপা কুড়মুড়ে ফুচকা, ভেতরে ছোলা বা আলুর পুর।', 'ফুচকা fuchka', 'fucka', true),
  ('chotpoti', 'চটপটি', 'Chotpoti', 'সেদ্ধ ছোলা, আলু ও ডিম টক-ঝালে মাখানো।', 'চটপটি chotpoti', 'catapati catpati', true),
  ('bhorta', 'ভর্তা', 'Bhorta', 'সেদ্ধ বা পোড়া উপকরণ মসলায় মেখে বানানো ভর্তা। ভাতের সঙ্গে খাওয়া হয়।', 'ভর্তা bhorta', 'barta', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('tehari', 'tehary', 'tehari'),
  ('tehari', 'tehri', 'tehri'),
  ('tehari', 'তেহারী', 'tehari'),
  ('chaap', 'chap', 'cap'),
  ('chaap', 'chaop', 'cap'),
  ('chaap', 'চাপ', 'cap'),
  ('kabab', 'kebab', 'kebab'),
  ('kabab', 'kabob', 'kabab'),
  ('kabab', 'kabab ghor', 'kabab gar'),
  ('lassi', 'lacchi', 'laci'),
  ('lassi', 'lasi', 'lasi'),
  ('lassi', 'লাসসি', 'lasi'),
  ('lassi', 'লাচ্ছি', 'laci'),
  ('faluda', 'falooda', 'faluda'),
  ('faluda', 'faloda', 'falada'),
  ('faluda', 'ফালুদা', 'faluda'),
  ('fuchka', 'phuchka', 'fucka'),
  ('fuchka', 'puchka', 'pucka'),
  ('fuchka', 'pani puri', 'pani puri'),
  ('fuchka', 'panipuri', 'panipuri'),
  ('fuchka', 'ফুসকা', 'fuska'),
  ('fuchka', 'পানিপুরি', 'panipuri'),
  ('chotpoti', 'chotpoti', 'catpati'),
  ('chotpoti', 'chatpati', 'catpati'),
  ('chotpoti', 'chotpotti', 'catpati'),
  ('chotpoti', 'চটপটী', 'catapati'),
  ('bhorta', 'vorta', 'barta'),
  ('bhorta', 'bharta', 'barta'),
  ('bhorta', 'ভর্তা', 'barta')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into places (slug, name_bn, name_en, type, district_id, area_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, a.id, v.search_text, v.search_key, true
from (values
  ('hanif-biryani-dhaka', 'হানিফ বিরিয়ানি', 'Hanif Biryani', 'restaurant', 'nazira-bazar', 'হানিফ বিরিয়ানি hanif biryani', 'hanif biriani'),
  ('nanna-biryani-dhaka', 'নান্না মিয়ার বিরিয়ানি', 'Nanna Miar Biryani', 'restaurant', 'puran-dhaka', 'নান্না মিয়ার বিরিয়ানি nanna miar biryani', 'nana miar biriani'),
  ('junu-polao-ghor-dhaka', 'জুনু পোলাও ঘর', 'Junu Polao Ghor', 'restaurant', 'puran-dhaka', 'জুনু পোলাও ঘর junu polao ghor', 'junu pala gar'),
  ('star-hotel-dhaka', 'স্টার হোটেল', 'Star Hotel', 'restaurant', 'puran-dhaka', 'স্টার হোটেল star hotel', 'star hatel'),
  ('al-razzaque-dhaka', 'হোটেল আল-রাজ্জাক', 'Hotel Al-Razzaque', 'restaurant', 'puran-dhaka', 'হোটেল আল-রাজ্জাক hotel al-razzaque', 'hatel al rajak hatel al rajakue'),
  ('bokhari-restaurant-dhaka', 'বোখারী রেস্তোরাঁ', 'Bokhari Restaurant', 'restaurant', 'johnson-road', 'বোখারী রেস্তোরাঁ bokhari restaurant', 'bakari restara bakari restaurant'),
  ('beauty-lassi-dhaka', 'বিউটি লাচ্ছি ও ফালুদা', 'Beauty Lassi and Faluda', 'shop', 'johnson-road', 'বিউটি লাচ্ছি ও ফালুদা beauty lassi and faluda', 'biuti laci a faluda beauti lasi and faluda'),
  ('bismillah-kabab-ghar-dhaka', 'বিসমিল্লাহ কাবাব ঘর', 'Bismillah Kabab Ghar', 'restaurant', 'nazira-bazar', 'বিসমিল্লাহ কাবাব ঘর bismillah kabab ghar', 'bismilah kabab gar'),
  ('badshahi-kabab-dhaka', 'বাদশাহী কাবাব', 'Badshahi Kabab', 'restaurant', 'nazira-bazar', 'বাদশাহী কাবাব badshahi kabab', 'badsahi kabab'),
  ('kabab-king-dhaka', 'কাবাব কিং', 'Kabab King', 'restaurant', 'puran-dhaka', 'কাবাব কিং kabab king', 'kabab king'),
  ('rahmania-kabab-dhaka', 'রহমানিয়া কাবাব', 'Rahmania Kabab', 'restaurant', 'gandaria', 'রহমানিয়া কাবাব rahmania kabab', 'rahamania kabab rahmania kabab'),
  ('bot-tolar-kabab-dhaka', 'বটতলার কাবাব', 'Bot Tolar Kabab', 'restaurant', 'thatari-bazar', 'বটতলার কাবাব bot tolar kabab', 'batatalar kabab bat talar kabab'),
  ('al-amin-bakarkhani-dhaka', 'আল-আমিন বাকরখানি', 'Al-Amin Bakarkhani', 'bakery', 'puran-dhaka', 'আল-আমিন বাকরখানি al-amin bakarkhani', 'al amin bakarakani al amin bakarkani'),
  ('shahjalal-bakarkhani-dhaka', 'শাহজালালের বাকরখানি', 'Shahjalal Bakarkhani', 'bakery', 'agamasi-lane', 'শাহজালালের বাকরখানি shahjalal bakarkhani', 'sahjalaler bakarakani sahjalal bakarkani'),
  ('yakub-ali-bakarkhani-dhaka', 'ইয়াকুব আলীর বাকরখানি', 'Yakub Ali Bakarkhani', 'bakery', 'nazira-bazar', 'ইয়াকুব আলীর বাকরখানি yakub ali bakarkhani', 'iakub alir bakarakani iakub ali bakarkani'),
  ('mostofa-bakarkhani-dhaka', 'মোস্তফার বাকরখানি', 'Mostofa Bakarkhani', 'bakery', 'becharam-dewri', 'মোস্তফার বাকরখানি mostofa bakarkhani', 'mastafar bakarakani mastafa bakarkani'),
  ('jummon-fuchka-dhaka', 'জুম্মন ফুচকা', 'Jummon Fuchka', 'street_food', 'armanitola', 'জুম্মন ফুচকা jummon fuchka', 'juman fucka'),
  ('mujibur-miar-fuchka-dhaka', 'মুজিবুর মিয়ার ফুচকা', 'Mujibur Miar Fuchka', 'street_food', 'bangshal', 'মুজিবুর মিয়ার ফুচকা mujibur miar fuchka', 'mujibur miar fucka'),
  ('mama-fuchka-dhaka', 'মামা ফুচকা', 'Mama Fuchka', 'street_food', 'lalmatia', 'মামা ফুচকা mama fuchka', 'mama fucka'),
  ('paanipuri-gulshan-dhaka', 'পানিপুরি (গুলশান)', 'Paanipuri Gulshan', 'street_food', 'gulshan', 'পানিপুরি (গুলশান) paanipuri gulshan', 'panipuri gulsan'),
  ('mostakim-chaap-dhaka', 'মোস্তাকিমের চাপ', 'Mostakim''s Chaap', 'restaurant', 'mohammadpur', 'মোস্তাকিমের চাপ mostakim''s chaap', 'mastakimer cap mastakim s cap'),
  ('selim-kabab-ghor-dhaka', 'সেলিম কাবাব ঘর', 'Selim Kabab Ghor', 'restaurant', 'mohammadpur', 'সেলিম কাবাব ঘর selim kabab ghor', 'selim kabab gar'),
  ('shawkat-kabab-ghor-dhaka', 'শওকত কাবাব ঘর', 'Shawkat Kabab Ghor', 'restaurant', 'mirpur', 'শওকত কাবাব ঘর shawkat kabab ghor', 'sukat kabab gar sabkat kabab gar'),
  ('kallu-kabab-ghar-dhaka', 'কাল্লু কাবাব ঘর', 'Kallu Kabab Ghar', 'restaurant', 'mirpur', 'কাল্লু কাবাব ঘর kallu kabab ghar', 'kalu kabab gar'),
  ('kasturi-dhaka', 'কস্তুরী', 'Kasturi', 'restaurant', 'dhanmondi', 'কস্তুরী kasturi', 'kasturi'),
  ('star-kabab-dhaka', 'স্টার কাবাব', 'Star Kabab', 'restaurant', 'dhanmondi', 'স্টার কাবাব star kabab', 'star kabab'),
  ('chittagong-bull-dhaka', 'চিটাগাং বুল', 'Chittagong Bull', 'restaurant', 'gulshan', 'চিটাগাং বুল chittagong bull', 'citagang bul'),
  ('kacchi-wala-dhaka', 'কাচ্চি ওয়ালা', 'Kacchi Wala', 'restaurant', 'uttara', 'কাচ্চি ওয়ালা kacchi wala', 'kaci aiala kaci bala')
) as v(slug, name_bn, name_en, type, area_slug, search_text, search_key)
join districts d on d.slug = 'dhaka'
join areas a on a.district_id = d.id and a.slug = v.area_slug
on conflict (slug) do nothing;

update places p
set area_id = a.id
from (values
  ('haji-biryani-dhaka', 'nazira-bazar')
) as v(place_slug, area_slug), areas a
where p.slug = v.place_slug and a.district_id = p.district_id and a.slug = v.area_slug
  and p.area_id is null;

insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('hanif-biryani-dhaka', 'tehari'),
  ('nanna-biryani-dhaka', 'kacchi'),
  ('junu-polao-ghor-dhaka', 'kacchi'),
  ('star-hotel-dhaka', 'kacchi'),
  ('al-razzaque-dhaka', 'kacchi'),
  ('bokhari-restaurant-dhaka', 'lassi'),
  ('bokhari-restaurant-dhaka', 'faluda'),
  ('bokhari-restaurant-dhaka', 'kabab'),
  ('beauty-lassi-dhaka', 'lassi'),
  ('beauty-lassi-dhaka', 'faluda'),
  ('bismillah-kabab-ghar-dhaka', 'chaap'),
  ('bismillah-kabab-ghar-dhaka', 'kabab'),
  ('badshahi-kabab-dhaka', 'kabab'),
  ('kabab-king-dhaka', 'kabab'),
  ('rahmania-kabab-dhaka', 'kabab'),
  ('bot-tolar-kabab-dhaka', 'kabab'),
  ('al-amin-bakarkhani-dhaka', 'bakarkhani'),
  ('shahjalal-bakarkhani-dhaka', 'bakarkhani'),
  ('yakub-ali-bakarkhani-dhaka', 'bakarkhani'),
  ('mostofa-bakarkhani-dhaka', 'bakarkhani'),
  ('jummon-fuchka-dhaka', 'fuchka'),
  ('mujibur-miar-fuchka-dhaka', 'fuchka'),
  ('mama-fuchka-dhaka', 'fuchka'),
  ('mama-fuchka-dhaka', 'chotpoti'),
  ('paanipuri-gulshan-dhaka', 'fuchka'),
  ('mostakim-chaap-dhaka', 'chaap'),
  ('selim-kabab-ghor-dhaka', 'kabab'),
  ('selim-kabab-ghor-dhaka', 'chaap'),
  ('shawkat-kabab-ghor-dhaka', 'chaap'),
  ('shawkat-kabab-ghor-dhaka', 'kabab'),
  ('kallu-kabab-ghar-dhaka', 'chaap'),
  ('kasturi-dhaka', 'bhorta'),
  ('kasturi-dhaka', 'ilish'),
  ('star-kabab-dhaka', 'kabab'),
  ('chittagong-bull-dhaka', 'mezbani'),
  ('kacchi-wala-dhaka', 'kacchi'),
  ('haji-biryani-dhaka', 'tehari')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

insert into regional_fame (district_id, food_id, note_bn, source_url, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.source_url, v.sort_order, true
from (values
  ('dhaka', 'tehari', 'নাজিরা বাজারের তেহারি', 'https://en.prothomalo.com/lifestyle/5j2cgkma56', 10),
  ('dhaka', 'lassi', 'জনসন রোডের লাচ্ছি', 'https://www.tbsnews.net/node/260941', 11),
  ('dhaka', 'chaap', 'মোহাম্মদপুর ও মিরপুরের চাপ', 'https://www.tbsnews.net/node/29997', 12),
  ('dhaka', 'kabab', 'পুরান ঢাকার কাবাব', 'https://www.dhakatribune.com/bangladesh/351060/culinary-delights-of-puran-dhaka-a-voyage-through', 13),
  ('dhaka', 'fuchka', 'পুরান ঢাকা ও মোহাম্মদপুরের ফুচকা', 'https://www.tbsnews.net/node/493514', 14)
) as v(district_slug, food_slug, note_bn, source_url, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;

update regional_fame rf
set source_url = v.source_url
from (values
  ('dhaka', 'kacchi', 'https://en.prothomalo.com/lifestyle/oy35boxrqf'),
  ('dhaka', 'bakarkhani', 'https://www.tbsnews.net/feature/food/still-love-bakarkhani')
) as v(district_slug, food_slug, source_url), districts d, foods f
where d.slug = v.district_slug and f.slug = v.food_slug
  and rf.district_id = d.id and rf.food_id = f.id and rf.source_url is null;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
