-- 0007: curated launch content (generated — do not edit by hand).
-- Source: scripts/seed/data.ts · regenerate: pnpm db:seed · checked by scripts/seed/seed.test.ts
--
-- Everything except districts is flagged is_seed. Remove it later with:  select purge_seed_data();
-- (0006). No ratings, reviews, prices, hours, addresses or claims are invented here; real people
-- add those. After this migration is applied, changes to the content go into a NEW migration.

insert into districts (id, slug, name_bn, name_en, division_bn, division_en, search_text, search_key) values
  (1, 'barguna', 'বরগুনা', 'Barguna', 'বরিশাল', 'Barishal', 'বরগুনা barguna', 'baraguna barguna'),
  (2, 'barishal', 'বরিশাল', 'Barishal', 'বরিশাল', 'Barishal', 'বরিশাল barishal barisal', 'barisal'),
  (3, 'bhola', 'ভোলা', 'Bhola', 'বরিশাল', 'Barishal', 'ভোলা bhola', 'bala'),
  (4, 'jhalokati', 'ঝালকাঠি', 'Jhalokati', 'বরিশাল', 'Barishal', 'ঝালকাঠি jhalokati jhalakathi jhalokathi', 'jalkati jalakati'),
  (5, 'patuakhali', 'পটুয়াখালী', 'Patuakhali', 'বরিশাল', 'Barishal', 'পটুয়াখালী patuakhali', 'patuiakali patuakali'),
  (6, 'pirojpur', 'পিরোজপুর', 'Pirojpur', 'বরিশাল', 'Barishal', 'পিরোজপুর pirojpur', 'pirajpur'),
  (7, 'bandarban', 'বান্দরবান', 'Bandarban', 'চট্টগ্রাম', 'Chattogram', 'বান্দরবান bandarban', 'bandaraban bandarban'),
  (8, 'brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'Brahmanbaria', 'চট্টগ্রাম', 'Chattogram', 'ব্রাহ্মণবাড়িয়া brahmanbaria b baria', 'brahmanabaria brahmanbaria b baria'),
  (9, 'chandpur', 'চাঁদপুর', 'Chandpur', 'চট্টগ্রাম', 'Chattogram', 'চাঁদপুর chandpur', 'cadapur candpur'),
  (10, 'chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম', 'Chattogram', 'চট্টগ্রাম chattogram chittagong ctg chottogram', 'catagram citagang ctg'),
  (11, 'cumilla', 'কুমিল্লা', 'Cumilla', 'চট্টগ্রাম', 'Chattogram', 'কুমিল্লা cumilla comilla', 'kumila cumila camila'),
  (12, 'coxs-bazar', 'কক্সবাজার', 'Cox''s Bazar', 'চট্টগ্রাম', 'Chattogram', 'কক্সবাজার cox''s bazar cox bazar coxs bazar coxsbazar', 'kaksabajar caks s bajar caks bajar caksbajar'),
  (13, 'feni', 'ফেনী', 'Feni', 'চট্টগ্রাম', 'Chattogram', 'ফেনী feni', 'feni'),
  (14, 'khagrachhari', 'খাগড়াছড়ি', 'Khagrachhari', 'চট্টগ্রাম', 'Chattogram', 'খাগড়াছড়ি khagrachhari khagrachari', 'kagracri kagracari'),
  (15, 'lakshmipur', 'লক্ষ্মীপুর', 'Lakshmipur', 'চট্টগ্রাম', 'Chattogram', 'লক্ষ্মীপুর lakshmipur laxmipur', 'laksmipur'),
  (16, 'noakhali', 'নোয়াখালী', 'Noakhali', 'চট্টগ্রাম', 'Chattogram', 'নোয়াখালী noakhali', 'naiakali nakali'),
  (17, 'rangamati', 'রাঙামাটি', 'Rangamati', 'চট্টগ্রাম', 'Chattogram', 'রাঙামাটি rangamati', 'rangamati'),
  (18, 'dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা', 'Dhaka', 'ঢাকা dhaka dacca', 'daka daca'),
  (19, 'faridpur', 'ফরিদপুর', 'Faridpur', 'ঢাকা', 'Dhaka', 'ফরিদপুর faridpur', 'faridpur'),
  (20, 'gazipur', 'গাজীপুর', 'Gazipur', 'ঢাকা', 'Dhaka', 'গাজীপুর gazipur', 'gajipur'),
  (21, 'gopalganj', 'গোপালগঞ্জ', 'Gopalganj', 'ঢাকা', 'Dhaka', 'গোপালগঞ্জ gopalganj gopalgonj', 'gapalaganj gapalganj'),
  (22, 'kishoreganj', 'কিশোরগঞ্জ', 'Kishoreganj', 'ঢাকা', 'Dhaka', 'কিশোরগঞ্জ kishoreganj kishorgonj', 'kisaraganj kisareganj kisarganj'),
  (23, 'madaripur', 'মাদারীপুর', 'Madaripur', 'ঢাকা', 'Dhaka', 'মাদারীপুর madaripur', 'madaripur'),
  (24, 'manikganj', 'মানিকগঞ্জ', 'Manikganj', 'ঢাকা', 'Dhaka', 'মানিকগঞ্জ manikganj manikgonj', 'manikaganj manikganj'),
  (25, 'munshiganj', 'মুন্সীগঞ্জ', 'Munshiganj', 'ঢাকা', 'Dhaka', 'মুন্সীগঞ্জ munshiganj munshigonj', 'munsiganj'),
  (26, 'narayanganj', 'নারায়ণগঞ্জ', 'Narayanganj', 'ঢাকা', 'Dhaka', 'নারায়ণগঞ্জ narayanganj narayangonj', 'naraianaganj naraianganj'),
  (27, 'narsingdi', 'নরসিংদী', 'Narsingdi', 'ঢাকা', 'Dhaka', 'নরসিংদী narsingdi narshingdi', 'narasingdi narsingdi'),
  (28, 'rajbari', 'রাজবাড়ী', 'Rajbari', 'ঢাকা', 'Dhaka', 'রাজবাড়ী rajbari', 'rajbari'),
  (29, 'shariatpur', 'শরীয়তপুর', 'Shariatpur', 'ঢাকা', 'Dhaka', 'শরীয়তপুর shariatpur', 'sariatapur sariatpur'),
  (30, 'tangail', 'টাঙ্গাইল', 'Tangail', 'ঢাকা', 'Dhaka', 'টাঙ্গাইল tangail', 'tangail'),
  (31, 'bagerhat', 'বাগেরহাট', 'Bagerhat', 'খুলনা', 'Khulna', 'বাগেরহাট bagerhat', 'bagerat'),
  (32, 'chuadanga', 'চুয়াডাঙ্গা', 'Chuadanga', 'খুলনা', 'Khulna', 'চুয়াডাঙ্গা chuadanga', 'cuiadanga cuadanga'),
  (33, 'jashore', 'যশোর', 'Jashore', 'খুলনা', 'Khulna', 'যশোর jashore jessore', 'jasar jasare jesare'),
  (34, 'jhenaidah', 'ঝিনাইদহ', 'Jhenaidah', 'খুলনা', 'Khulna', 'ঝিনাইদহ jhenaidah jhenidah', 'jinaidah jenaidah jenidah'),
  (35, 'khulna', 'খুলনা', 'Khulna', 'খুলনা', 'Khulna', 'খুলনা khulna', 'kulna'),
  (36, 'kushtia', 'কুষ্টিয়া', 'Kushtia', 'খুলনা', 'Khulna', 'কুষ্টিয়া kushtia kustia', 'kustia'),
  (37, 'magura', 'মাগুরা', 'Magura', 'খুলনা', 'Khulna', 'মাগুরা magura', 'magura'),
  (38, 'meherpur', 'মেহেরপুর', 'Meherpur', 'খুলনা', 'Khulna', 'মেহেরপুর meherpur', 'meherpur'),
  (39, 'narail', 'নড়াইল', 'Narail', 'খুলনা', 'Khulna', 'নড়াইল narail', 'narail'),
  (40, 'satkhira', 'সাতক্ষীরা', 'Satkhira', 'খুলনা', 'Khulna', 'সাতক্ষীরা satkhira shatkhira', 'sataksira satkira'),
  (41, 'jamalpur', 'জামালপুর', 'Jamalpur', 'ময়মনসিংহ', 'Mymensingh', 'জামালপুর jamalpur', 'jamalpur'),
  (42, 'mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ', 'Mymensingh', 'ময়মনসিংহ mymensingh mymensing', 'maiamanasing mimensing'),
  (43, 'netrokona', 'নেত্রকোণা', 'Netrokona', 'ময়মনসিংহ', 'Mymensingh', 'নেত্রকোণা netrokona netrakona', 'netrakana'),
  (44, 'sherpur', 'শেরপুর', 'Sherpur', 'ময়মনসিংহ', 'Mymensingh', 'শেরপুর sherpur', 'serpur'),
  (45, 'bogura', 'বগুড়া', 'Bogura', 'রাজশাহী', 'Rajshahi', 'বগুড়া bogura bogra', 'bagura bagra'),
  (46, 'joypurhat', 'জয়পুরহাট', 'Joypurhat', 'রাজশাহী', 'Rajshahi', 'জয়পুরহাট joypurhat jaipurhat', 'jaiapurat jaipurat'),
  (47, 'naogaon', 'নওগাঁ', 'Naogaon', 'রাজশাহী', 'Rajshahi', 'নওগাঁ naogaon noagaon', 'nuga nagan'),
  (48, 'natore', 'নাটোর', 'Natore', 'রাজশাহী', 'Rajshahi', 'নাটোর natore', 'natar natare'),
  (49, 'chapainawabganj', 'চাঁপাইনবাবগঞ্জ', 'Chapainawabganj', 'রাজশাহী', 'Rajshahi', 'চাঁপাইনবাবগঞ্জ chapainawabganj chapai nawabganj nawabganj', 'capainbabaganj capainababganj capai nababganj nababganj'),
  (50, 'pabna', 'পাবনা', 'Pabna', 'রাজশাহী', 'Rajshahi', 'পাবনা pabna', 'pabna'),
  (51, 'rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী', 'Rajshahi', 'রাজশাহী rajshahi', 'rajsahi'),
  (52, 'sirajganj', 'সিরাজগঞ্জ', 'Sirajganj', 'রাজশাহী', 'Rajshahi', 'সিরাজগঞ্জ sirajganj sirajgonj', 'sirajaganj sirajganj'),
  (53, 'dinajpur', 'দিনাজপুর', 'Dinajpur', 'রংপুর', 'Rangpur', 'দিনাজপুর dinajpur', 'dinajpur'),
  (54, 'gaibandha', 'গাইবান্ধা', 'Gaibandha', 'রংপুর', 'Rangpur', 'গাইবান্ধা gaibandha gaibanda', 'gaibanda'),
  (55, 'kurigram', 'কুড়িগ্রাম', 'Kurigram', 'রংপুর', 'Rangpur', 'কুড়িগ্রাম kurigram', 'kurigram'),
  (56, 'lalmonirhat', 'লালমনিরহাট', 'Lalmonirhat', 'রংপুর', 'Rangpur', 'লালমনিরহাট lalmonirhat', 'lalamanirat lalmanirat'),
  (57, 'nilphamari', 'নীলফামারী', 'Nilphamari', 'রংপুর', 'Rangpur', 'নীলফামারী nilphamari nilphamary', 'nilfamari'),
  (58, 'panchagarh', 'পঞ্চগড়', 'Panchagarh', 'রংপুর', 'Rangpur', 'পঞ্চগড় panchagarh', 'pancagar'),
  (59, 'rangpur', 'রংপুর', 'Rangpur', 'রংপুর', 'Rangpur', 'রংপুর rangpur', 'rangpur'),
  (60, 'thakurgaon', 'ঠাকুরগাঁও', 'Thakurgaon', 'রংপুর', 'Rangpur', 'ঠাকুরগাঁও thakurgaon', 'takurga takurgan'),
  (61, 'habiganj', 'হবিগঞ্জ', 'Habiganj', 'সিলেট', 'Sylhet', 'হবিগঞ্জ habiganj hobiganj', 'habiganj'),
  (62, 'moulvibazar', 'মৌলভীবাজার', 'Moulvibazar', 'সিলেট', 'Sylhet', 'মৌলভীবাজার moulvibazar maulvibazar moulovibazar', 'maulbibajar maulabibajar'),
  (63, 'sunamganj', 'সুনামগঞ্জ', 'Sunamganj', 'সিলেট', 'Sylhet', 'সুনামগঞ্জ sunamganj sunamgonj', 'sunamaganj sunamganj'),
  (64, 'sylhet', 'সিলেট', 'Sylhet', 'সিলেট', 'Sylhet', 'সিলেট sylhet', 'silet')
on conflict (id) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'district', d.id::text, v.alias, v.search_key
from (values
  ('barishal', 'barisal', 'barisal'),
  ('jhalokati', 'jhalakathi', 'jalakati'),
  ('jhalokati', 'jhalokathi', 'jalakati'),
  ('brahmanbaria', 'b baria', 'b baria'),
  ('chattogram', 'chittagong', 'citagang'),
  ('chattogram', 'ctg', 'ctg'),
  ('chattogram', 'chottogram', 'catagram'),
  ('cumilla', 'comilla', 'camila'),
  ('coxs-bazar', 'cox bazar', 'caks bajar'),
  ('coxs-bazar', 'coxs bazar', 'caks bajar'),
  ('coxs-bazar', 'coxsbazar', 'caksbajar'),
  ('khagrachhari', 'khagrachari', 'kagracari'),
  ('lakshmipur', 'laxmipur', 'laksmipur'),
  ('dhaka', 'dacca', 'daca'),
  ('gopalganj', 'gopalgonj', 'gapalganj'),
  ('kishoreganj', 'kishorgonj', 'kisarganj'),
  ('manikganj', 'manikgonj', 'manikganj'),
  ('munshiganj', 'munshigonj', 'munsiganj'),
  ('narayanganj', 'narayangonj', 'naraianganj'),
  ('narsingdi', 'narshingdi', 'narsingdi'),
  ('jashore', 'jessore', 'jesare'),
  ('jhenaidah', 'jhenidah', 'jenidah'),
  ('kushtia', 'kustia', 'kustia'),
  ('satkhira', 'shatkhira', 'satkira'),
  ('mymensingh', 'mymensing', 'mimensing'),
  ('netrokona', 'netrakona', 'netrakana'),
  ('bogura', 'bogra', 'bagra'),
  ('joypurhat', 'jaipurhat', 'jaipurat'),
  ('naogaon', 'noagaon', 'nagan'),
  ('chapainawabganj', 'chapai nawabganj', 'capai nababganj'),
  ('chapainawabganj', 'nawabganj', 'nababganj'),
  ('sirajganj', 'sirajgonj', 'sirajganj'),
  ('gaibandha', 'gaibanda', 'gaibanda'),
  ('nilphamari', 'nilphamary', 'nilfamari'),
  ('habiganj', 'hobiganj', 'habiganj'),
  ('moulvibazar', 'maulvibazar', 'maulbibajar'),
  ('moulvibazar', 'moulovibazar', 'maulabibajar'),
  ('sunamganj', 'sunamgonj', 'sunamganj')
) as v(district_slug, alias, search_key)
join districts d on d.slug = v.district_slug
on conflict do nothing;

insert into foods (slug, name_bn, name_en, about_bn, search_text, search_key, is_seed) values
  ('doi', 'দই', 'Doi', 'মাটির হাঁড়িতে জমানো মিষ্টি দই। বগুড়ার দই সারা দেশে পরিচিত।', 'দই doi', 'dai', true),
  ('kacchi', 'কাচ্চি বিরিয়ানি', 'Kacchi Biryani', 'মসলায় মাখানো কাঁচা মাংস আর চাল একসাথে হাঁড়িতে রান্না করা বিরিয়ানি।', 'কাচ্চি বিরিয়ানি kacchi biryani', 'kaci biriani', true),
  ('bakarkhani', 'বাকরখানি', 'Bakarkhani', 'পুরান ঢাকার পরিচিত মুচমুচে স্তরওয়ালা রুটি।', 'বাকরখানি bakarkhani', 'bakarakani bakarkani', true),
  ('mezbani', 'মেজবানি মাংস', 'Mezbani Beef', 'চট্টগ্রামের ঐতিহ্যবাহী মেজবান ভোজের ঝাল গরুর মাংস।', 'মেজবানি মাংস mezbani beef', 'mejbani mangs mejbani bif', true),
  ('kachagolla', 'কাঁচাগোল্লা', 'Kachagolla', 'ছানা দিয়ে তৈরি নাটোরের পরিচিত মিষ্টি।', 'কাঁচাগোল্লা kachagolla', 'kacagala', true),
  ('rasmalai', 'রসমালাই', 'Rasmalai', 'দুধের ঘন রসে ভাসানো ছানার মিষ্টি। কুমিল্লার রসমালাই সুপরিচিত।', 'রসমালাই rasmalai', 'rasamalai rasmalai', true),
  ('chomchom', 'চমচম', 'Chomchom', 'টাঙ্গাইলের পোড়াবাড়ীর চমচম পরিচিত।', 'চমচম chomchom', 'camacam camcam', true),
  ('monda', 'মণ্ডা', 'Monda', 'দুধ আর চিনি জ্বাল দিয়ে তৈরি মিষ্টি। ময়মনসিংহের মুক্তাগাছার মণ্ডা পরিচিত।', 'মণ্ডা monda', 'manda', true),
  ('shatkora-beef', 'সাতকরা দিয়ে গরুর মাংস', 'Shatkora Beef', 'সিলেটের বিশেষ লেবুজাতীয় ফল সাতকরা দিয়ে রান্না করা গরুর মাংস।', 'সাতকরা দিয়ে গরুর মাংস shatkora beef', 'satakara die garur mangs satkara bif', true),
  ('mango', 'আম', 'Mango', 'রাজশাহী অঞ্চল আর চাঁপাইনবাবগঞ্জ আমের জন্য সুপরিচিত।', 'আম mango', 'am manga', true),
  ('ilish', 'ইলিশ', 'Hilsa', 'বাংলাদেশের জাতীয় মাছ। চাঁদপুরের ইলিশ সুপরিচিত।', 'ইলিশ hilsa', 'ilis hilsa', true),
  ('shutki', 'শুঁটকি', 'Shutki (Dried Fish)', 'রোদে শুকানো মাছ। কক্সবাজার শুঁটকির জন্য পরিচিত।', 'শুঁটকি shutki (dried fish)', 'sutaki sutki dried fis', true),
  ('chui-jhal', 'চুইঝালের মাংস', 'Chui Jhal Meat', 'চুইঝাল লতার ঝাঁজালো স্বাদে রান্না করা মাংস। খুলনার পরিচিত খাবার।', 'চুইঝালের মাংস chui jhal meat', 'cuijaler mangs cui jal meat', true),
  ('khejur-gur', 'খেজুরের গুড়', 'Date Palm Jaggery', 'খেজুরের রস জ্বাল দিয়ে তৈরি গুড়। শীতকালে যশোর অঞ্চলে পাওয়া যায়।', 'খেজুরের গুড় date palm jaggery', 'kejurer gur date palm jageri', true),
  ('kataribhog', 'কাটারিভোগ চাল', 'Katarivog Rice', 'সুগন্ধি চাল। দিনাজপুরের কাটারিভোগ পরিচিত।', 'কাটারিভোগ চাল katarivog rice', 'kataribag cal kataribag rice', true),
  ('lichu', 'লিচু', 'Lychee', 'গ্রীষ্মের মৌসুমি ফল। দিনাজপুরের লিচু পরিচিত।', 'লিচু lychee', 'licu lici', true),
  ('sat-rongi-cha', 'সাত রঙের চা', 'Seven-Colour Tea', 'এক কাপে সাত স্তরের চা। শ্রীমঙ্গলের (মৌলভীবাজার) পরিচিত পানীয়।', 'সাত রঙের চা seven-colour tea', 'sat ranger ca seben calaur tea', true),
  ('balish-mishti', 'বালিশ মিষ্টি', 'Balish Mishti', 'বালিশের মতো বড় আকারের মিষ্টি। নেত্রকোণার পরিচিত মিষ্টি।', 'বালিশ মিষ্টি balish mishti', 'balis misti', true),
  ('til-khaja', 'তিলের খাজা', 'Til Khaja', 'তিল আর চিনি দিয়ে তৈরি মিষ্টি। কুষ্টিয়ার তিলের খাজা পরিচিত।', 'তিলের খাজা til khaja', 'tiler kaja til kaja', true),
  ('bamboo-chicken', 'বাঁশের চোঙায় মুরগি', 'Bamboo Chicken', 'বাঁশের চোঙায় ভরে রান্না করা মুরগি। পার্বত্য অঞ্চলের পরিচিত খাবার।', 'বাঁশের চোঙায় মুরগি bamboo chicken', 'baser cangai murgi bambu ciken', true),
  ('cha', 'চা', 'Tea', 'পঞ্চগড়ের তেঁতুলিয়া অঞ্চলে চা চাষ হয়।', 'চা tea', 'ca tea', true)
on conflict (slug) do nothing;

insert into aliases (entity, entity_id, alias, search_key)
select 'food', f.id::text, v.alias, v.search_key
from (values
  ('doi', 'mishti doi', 'misti dai'),
  ('doi', 'misti doi', 'misti dai'),
  ('doi', 'doy', 'dai'),
  ('doi', 'মিষ্টি দই', 'misti dai'),
  ('kacchi', 'kachchi', 'kaci'),
  ('kacchi', 'kacci', 'kaci'),
  ('kacchi', 'kachi', 'kaci'),
  ('kacchi', 'kacchi biriyani', 'kaci biriani'),
  ('kacchi', 'কাচ্চি', 'kaci'),
  ('kacchi', 'কাচি', 'kaci'),
  ('bakarkhani', 'bakorkhani', 'bakarkani'),
  ('bakarkhani', 'bakirkhani', 'bakirkani'),
  ('bakarkhani', 'baqarkhani', 'bakarkani'),
  ('mezbani', 'mejbani', 'mejbani'),
  ('mezbani', 'mezban', 'mejban'),
  ('mezbani', 'mejban', 'mejban'),
  ('mezbani', 'মেজবান', 'mejban'),
  ('kachagolla', 'kacha golla', 'kaca gala'),
  ('kachagolla', 'kancha golla', 'kanca gala'),
  ('kachagolla', 'kachagola', 'kacagala'),
  ('rasmalai', 'rosomalai', 'rasamalai'),
  ('rasmalai', 'roshmalai', 'rasmalai'),
  ('rasmalai', 'ros malai', 'ras malai'),
  ('chomchom', 'cham cham', 'cam cam'),
  ('chomchom', 'chom chom', 'cam cam'),
  ('chomchom', 'পোড়াবাড়ীর চমচম', 'parabarir camacam'),
  ('monda', 'mohnda', 'mahnda'),
  ('monda', 'mondaa', 'manda'),
  ('monda', 'মুক্তাগাছার মণ্ডা', 'muktagacar manda'),
  ('shatkora-beef', 'satkora beef', 'satkara bif'),
  ('shatkora-beef', 'shatkora', 'satkara'),
  ('shatkora-beef', 'satkora', 'satkara'),
  ('shatkora-beef', 'sat kora beef', 'sat kara bif'),
  ('mango', 'aam', 'am'),
  ('mango', 'rajshahi aam', 'rajsahi am'),
  ('mango', 'himsagar', 'himsagar'),
  ('mango', 'langra', 'langra'),
  ('ilish', 'hilsa', 'hilsa'),
  ('ilish', 'elish', 'elis'),
  ('ilish', 'ilish mach', 'ilis mac'),
  ('ilish', 'ইলিশ মাছ', 'ilis mac'),
  ('shutki', 'sutki', 'sutki'),
  ('shutki', 'dry fish', 'dri fis'),
  ('shutki', 'dried fish', 'dried fis'),
  ('shutki', 'shutki mach', 'sutki mac'),
  ('chui-jhal', 'chuijhal', 'cuijal'),
  ('chui-jhal', 'chui jhal mangsho', 'cui jal mangsa'),
  ('chui-jhal', 'chui jhaal', 'cui jal'),
  ('khejur-gur', 'khejur gur', 'kejur gur'),
  ('khejur-gur', 'khejur gud', 'kejur gud'),
  ('khejur-gur', 'gur', 'gur'),
  ('khejur-gur', 'date gur', 'date gur'),
  ('kataribhog', 'kataribhog', 'kataribag'),
  ('kataribhog', 'katari bhog', 'katari bag'),
  ('kataribhog', 'katarivog', 'kataribag'),
  ('lichu', 'lichi', 'lici'),
  ('lichu', 'litchi', 'litci'),
  ('lichu', 'lychee', 'lici'),
  ('sat-rongi-cha', 'seven color tea', 'seben calar tea'),
  ('sat-rongi-cha', '7 color tea', '7 calar tea'),
  ('sat-rongi-cha', 'saat rongi cha', 'sat rangi ca'),
  ('sat-rongi-cha', 'sat rangi cha', 'sat rangi ca'),
  ('sat-rongi-cha', 'seven layer tea', 'seben laier tea'),
  ('balish-mishti', 'balish misti', 'balis misti'),
  ('balish-mishti', 'balis mishti', 'balis misti'),
  ('balish-mishti', 'balish sweet', 'balis sbit'),
  ('til-khaja', 'tilkhaja', 'tilkaja'),
  ('til-khaja', 'til khaja', 'til kaja'),
  ('til-khaja', 'tilkut', 'tilkut'),
  ('til-khaja', 'kushtia khaja', 'kustia kaja'),
  ('bamboo-chicken', 'bash chicken', 'bas ciken'),
  ('bamboo-chicken', 'bamboo chicken', 'bambu ciken'),
  ('bamboo-chicken', 'bash er chicken', 'bas er ciken'),
  ('bamboo-chicken', 'বাঁশ চিকেন', 'bas ciken'),
  ('cha', 'tea', 'tea'),
  ('cha', 'cha pata', 'ca pata'),
  ('cha', 'chaa', 'ca')
) as v(food_slug, alias, search_key)
join foods f on f.slug = v.food_slug
on conflict do nothing;

insert into regional_fame (district_id, food_id, note_bn, sort_order, is_seed)
select d.id, f.id, v.note_bn, v.sort_order, true
from (values
  ('dhaka', 'kacchi', 'পুরান ঢাকার কাচ্চি', 0),
  ('dhaka', 'bakarkhani', null, 1),
  ('bogura', 'doi', 'মাটির হাঁড়ির দই', 2),
  ('natore', 'kachagolla', null, 3),
  ('chattogram', 'mezbani', null, 4),
  ('cumilla', 'rasmalai', null, 5),
  ('tangail', 'chomchom', 'পোড়াবাড়ীর চমচম', 6),
  ('mymensingh', 'monda', 'মুক্তাগাছার মণ্ডা', 7),
  ('sylhet', 'shatkora-beef', null, 8),
  ('rajshahi', 'mango', null, 9),
  ('chapainawabganj', 'mango', null, 10),
  ('chandpur', 'ilish', null, 11),
  ('coxs-bazar', 'shutki', null, 12),
  ('khulna', 'chui-jhal', null, 13),
  ('jashore', 'khejur-gur', null, 14),
  ('dinajpur', 'kataribhog', null, 15),
  ('dinajpur', 'lichu', null, 16),
  ('moulvibazar', 'sat-rongi-cha', 'শ্রীমঙ্গল', 17),
  ('netrokona', 'balish-mishti', null, 18),
  ('kushtia', 'til-khaja', null, 19),
  ('rangamati', 'bamboo-chicken', null, 20),
  ('bandarban', 'bamboo-chicken', null, 21),
  ('panchagarh', 'cha', 'তেঁতুলিয়া', 22)
) as v(district_slug, food_slug, note_bn, sort_order)
join districts d on d.slug = v.district_slug
join foods f on f.slug = v.food_slug
on conflict (district_id, food_id) do nothing;

insert into places (slug, name_bn, name_en, type, district_id, search_text, search_key, is_seed)
select v.slug, v.name_bn, v.name_en, v.type::place_type, d.id, v.search_text, v.search_key, true
from (values
  ('haji-biryani-dhaka', 'হাজীর বিরিয়ানি', 'Haji Biryani', 'restaurant', 'dhaka', 'হাজীর বিরিয়ানি haji biryani', 'hajir biriani haji biriani'),
  ('fakruddin-biryani-dhaka', 'ফখরুদ্দিন বিরিয়ানি', 'Fakruddin Biryani', 'restaurant', 'dhaka', 'ফখরুদ্দিন বিরিয়ানি fakruddin biryani', 'fakarudin biriani fakrudin biriani'),
  ('sultans-dine-dhaka', 'সুলতানস ডাইন', 'Sultan''s Dine', 'restaurant', 'dhaka', 'সুলতানস ডাইন sultan''s dine', 'sultanas dain sultan s dine'),
  ('matri-bhandar-cumilla', 'মাতৃ ভাণ্ডার', 'Matri Bhandar', 'shop', 'cumilla', 'মাতৃ ভাণ্ডার matri bhandar', 'matri bandar'),
  ('nilkantha-tea-cabin-moulvibazar', 'নীলকণ্ঠ টি কেবিন', 'Nilkantha Tea Cabin', 'shop', 'moulvibazar', 'নীলকণ্ঠ টি কেবিন nilkantha tea cabin', 'nilakant ti kebin nilkanta tea cabin'),
  ('panshi-restaurant-sylhet', 'পানসী রেস্টুরেন্ট', 'Panshi Restaurant', 'restaurant', 'sylhet', 'পানসী রেস্টুরেন্ট panshi restaurant', 'pansi resturent pansi restaurant'),
  ('pach-bhai-restaurant-sylhet', 'পাঁচ ভাই রেস্টুরেন্ট', 'Pach Bhai Restaurant', 'restaurant', 'sylhet', 'পাঁচ ভাই রেস্টুরেন্ট pach bhai restaurant', 'pac bai resturent pac bai restaurant')
) as v(slug, name_bn, name_en, type, district_slug, search_text, search_key)
join districts d on d.slug = v.district_slug
on conflict (slug) do nothing;

insert into dishes (place_id, food_id, is_seed)
select p.id, f.id, true
from (values
  ('haji-biryani-dhaka', 'kacchi'),
  ('fakruddin-biryani-dhaka', 'kacchi'),
  ('sultans-dine-dhaka', 'kacchi'),
  ('matri-bhandar-cumilla', 'rasmalai'),
  ('nilkantha-tea-cabin-moulvibazar', 'sat-rongi-cha')
) as v(place_slug, food_slug)
join places p on p.slug = v.place_slug
join foods f on f.slug = v.food_slug
on conflict (place_id, food_id) do nothing;

update districts d
set place_count = (select count(*) from places p where p.district_id = d.id and p.status = 'active');
