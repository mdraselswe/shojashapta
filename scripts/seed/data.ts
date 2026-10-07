/**
 * Launch content (decision T16): the 64 districts, curated "famous for" foods and a few
 * well-known places. Everything except districts is flagged is_seed in the database, so
 * `select purge_seed_data();` removes it once real contributors have taken over.
 *
 * Editorial rules (docs/01-product-spec.md, decisions P5/P9):
 * - "Famous for" is editorial, not a rating. Only well-known associations are listed.
 * - No ratings, reviews, prices, opening hours, addresses or claims are invented — those must come
 *   from real people. A place here is a name, a district and what it is known for.
 * - Add a place only when it is clearly real; it is better to be short than wrong.
 */

export const DIVISIONS = {
  barishal: { bn: "বরিশাল", en: "Barishal" },
  chattogram: { bn: "চট্টগ্রাম", en: "Chattogram" },
  dhaka: { bn: "ঢাকা", en: "Dhaka" },
  khulna: { bn: "খুলনা", en: "Khulna" },
  mymensingh: { bn: "ময়মনসিংহ", en: "Mymensingh" },
  rajshahi: { bn: "রাজশাহী", en: "Rajshahi" },
  rangpur: { bn: "রংপুর", en: "Rangpur" },
  sylhet: { bn: "সিলেট", en: "Sylhet" },
} as const;

export type DivisionKey = keyof typeof DIVISIONS;

export type DistrictSeed = {
  slug: string;
  nameBn: string;
  nameEn: string;
  division: DivisionKey;
  /** Other spellings people type (Banglish, old names). */
  aliases?: string[];
};

const d = (
  division: DivisionKey,
  slug: string,
  nameBn: string,
  nameEn: string,
  aliases?: string[],
): DistrictSeed => ({ division, slug, nameBn, nameEn, ...(aliases ? { aliases } : {}) });

// Order = district id (1–64): by division, then by name.
export const DISTRICTS: DistrictSeed[] = [
  d("barishal", "barguna", "বরগুনা", "Barguna"),
  d("barishal", "barishal", "বরিশাল", "Barishal", ["barisal"]),
  d("barishal", "bhola", "ভোলা", "Bhola"),
  d("barishal", "jhalokati", "ঝালকাঠি", "Jhalokati", ["jhalakathi", "jhalokathi"]),
  d("barishal", "patuakhali", "পটুয়াখালী", "Patuakhali"),
  d("barishal", "pirojpur", "পিরোজপুর", "Pirojpur"),

  d("chattogram", "bandarban", "বান্দরবান", "Bandarban"),
  d("chattogram", "brahmanbaria", "ব্রাহ্মণবাড়িয়া", "Brahmanbaria", ["b baria"]),
  d("chattogram", "chandpur", "চাঁদপুর", "Chandpur"),
  d("chattogram", "chattogram", "চট্টগ্রাম", "Chattogram", ["chittagong", "ctg", "chottogram"]),
  d("chattogram", "cumilla", "কুমিল্লা", "Cumilla", ["comilla"]),
  d("chattogram", "coxs-bazar", "কক্সবাজার", "Cox's Bazar", [
    "cox bazar",
    "coxs bazar",
    "coxsbazar",
  ]),
  d("chattogram", "feni", "ফেনী", "Feni"),
  d("chattogram", "khagrachhari", "খাগড়াছড়ি", "Khagrachhari", ["khagrachari"]),
  d("chattogram", "lakshmipur", "লক্ষ্মীপুর", "Lakshmipur", ["laxmipur"]),
  d("chattogram", "noakhali", "নোয়াখালী", "Noakhali"),
  d("chattogram", "rangamati", "রাঙামাটি", "Rangamati"),

  d("dhaka", "dhaka", "ঢাকা", "Dhaka", ["dacca"]),
  d("dhaka", "faridpur", "ফরিদপুর", "Faridpur"),
  d("dhaka", "gazipur", "গাজীপুর", "Gazipur"),
  d("dhaka", "gopalganj", "গোপালগঞ্জ", "Gopalganj", ["gopalgonj"]),
  d("dhaka", "kishoreganj", "কিশোরগঞ্জ", "Kishoreganj", ["kishorgonj"]),
  d("dhaka", "madaripur", "মাদারীপুর", "Madaripur"),
  d("dhaka", "manikganj", "মানিকগঞ্জ", "Manikganj", ["manikgonj"]),
  d("dhaka", "munshiganj", "মুন্সীগঞ্জ", "Munshiganj", ["munshigonj"]),
  d("dhaka", "narayanganj", "নারায়ণগঞ্জ", "Narayanganj", ["narayangonj"]),
  d("dhaka", "narsingdi", "নরসিংদী", "Narsingdi", ["narshingdi"]),
  d("dhaka", "rajbari", "রাজবাড়ী", "Rajbari"),
  d("dhaka", "shariatpur", "শরীয়তপুর", "Shariatpur"),
  d("dhaka", "tangail", "টাঙ্গাইল", "Tangail"),

  d("khulna", "bagerhat", "বাগেরহাট", "Bagerhat"),
  d("khulna", "chuadanga", "চুয়াডাঙ্গা", "Chuadanga"),
  d("khulna", "jashore", "যশোর", "Jashore", ["jessore"]),
  d("khulna", "jhenaidah", "ঝিনাইদহ", "Jhenaidah", ["jhenidah"]),
  d("khulna", "khulna", "খুলনা", "Khulna"),
  d("khulna", "kushtia", "কুষ্টিয়া", "Kushtia", ["kustia"]),
  d("khulna", "magura", "মাগুরা", "Magura"),
  d("khulna", "meherpur", "মেহেরপুর", "Meherpur"),
  d("khulna", "narail", "নড়াইল", "Narail"),
  d("khulna", "satkhira", "সাতক্ষীরা", "Satkhira", ["shatkhira"]),

  d("mymensingh", "jamalpur", "জামালপুর", "Jamalpur"),
  d("mymensingh", "mymensingh", "ময়মনসিংহ", "Mymensingh", ["mymensing"]),
  d("mymensingh", "netrokona", "নেত্রকোণা", "Netrokona", ["netrakona"]),
  d("mymensingh", "sherpur", "শেরপুর", "Sherpur"),

  d("rajshahi", "bogura", "বগুড়া", "Bogura", ["bogra"]),
  d("rajshahi", "joypurhat", "জয়পুরহাট", "Joypurhat", ["jaipurhat"]),
  d("rajshahi", "naogaon", "নওগাঁ", "Naogaon", ["noagaon"]),
  d("rajshahi", "natore", "নাটোর", "Natore"),
  d("rajshahi", "chapainawabganj", "চাঁপাইনবাবগঞ্জ", "Chapainawabganj", [
    "chapai nawabganj",
    "nawabganj",
  ]),
  d("rajshahi", "pabna", "পাবনা", "Pabna"),
  d("rajshahi", "rajshahi", "রাজশাহী", "Rajshahi"),
  d("rajshahi", "sirajganj", "সিরাজগঞ্জ", "Sirajganj", ["sirajgonj"]),

  d("rangpur", "dinajpur", "দিনাজপুর", "Dinajpur"),
  d("rangpur", "gaibandha", "গাইবান্ধা", "Gaibandha", ["gaibanda"]),
  d("rangpur", "kurigram", "কুড়িগ্রাম", "Kurigram"),
  d("rangpur", "lalmonirhat", "লালমনিরহাট", "Lalmonirhat"),
  d("rangpur", "nilphamari", "নীলফামারী", "Nilphamari", ["nilphamary"]),
  d("rangpur", "panchagarh", "পঞ্চগড়", "Panchagarh"),
  d("rangpur", "rangpur", "রংপুর", "Rangpur"),
  d("rangpur", "thakurgaon", "ঠাকুরগাঁও", "Thakurgaon"),

  d("sylhet", "habiganj", "হবিগঞ্জ", "Habiganj", ["hobiganj"]),
  d("sylhet", "moulvibazar", "মৌলভীবাজার", "Moulvibazar", ["maulvibazar", "moulovibazar"]),
  d("sylhet", "sunamganj", "সুনামগঞ্জ", "Sunamganj", ["sunamgonj"]),
  d("sylhet", "sylhet", "সিলেট", "Sylhet"),
];

export type FoodSeed = {
  slug: string;
  nameBn: string;
  nameEn: string;
  /** "কেন বিখ্যাত" — one plain sentence, nothing that needs a citation. */
  aboutBn: string;
  aliases: string[];
};

export const FOODS: FoodSeed[] = [
  {
    slug: "doi",
    nameBn: "দই",
    nameEn: "Doi",
    aboutBn: "মাটির হাঁড়িতে জমানো মিষ্টি দই। বগুড়ার দই সারা দেশে পরিচিত।",
    aliases: ["mishti doi", "misti doi", "doy", "মিষ্টি দই"],
  },
  {
    slug: "kacchi",
    nameBn: "কাচ্চি বিরিয়ানি",
    nameEn: "Kacchi Biryani",
    aboutBn: "মসলায় মাখানো কাঁচা মাংস আর চাল একসাথে হাঁড়িতে রান্না করা বিরিয়ানি।",
    aliases: ["kachchi", "kacci", "kachi", "kacchi biriyani", "কাচ্চি", "কাচি"],
  },
  {
    slug: "bakarkhani",
    nameBn: "বাকরখানি",
    nameEn: "Bakarkhani",
    aboutBn: "পুরান ঢাকার পরিচিত মুচমুচে স্তরওয়ালা রুটি।",
    aliases: ["bakorkhani", "bakirkhani", "baqarkhani"],
  },
  {
    slug: "mezbani",
    nameBn: "মেজবানি মাংস",
    nameEn: "Mezbani Beef",
    aboutBn: "চট্টগ্রামের ঐতিহ্যবাহী মেজবান ভোজের ঝাল গরুর মাংস।",
    aliases: ["mejbani", "mezban", "mejban", "মেজবান"],
  },
  {
    slug: "kachagolla",
    nameBn: "কাঁচাগোল্লা",
    nameEn: "Kachagolla",
    aboutBn: "ছানা দিয়ে তৈরি নাটোরের পরিচিত মিষ্টি।",
    aliases: ["kacha golla", "kancha golla", "kachagola"],
  },
  {
    slug: "rasmalai",
    nameBn: "রসমালাই",
    nameEn: "Rasmalai",
    aboutBn: "দুধের ঘন রসে ভাসানো ছানার মিষ্টি। কুমিল্লার রসমালাই সুপরিচিত।",
    aliases: ["rosomalai", "roshmalai", "ros malai"],
  },
  {
    slug: "chomchom",
    nameBn: "চমচম",
    nameEn: "Chomchom",
    aboutBn: "টাঙ্গাইলের পোড়াবাড়ীর চমচম পরিচিত।",
    aliases: ["cham cham", "chom chom", "পোড়াবাড়ীর চমচম"],
  },
  {
    slug: "monda",
    nameBn: "মণ্ডা",
    nameEn: "Monda",
    aboutBn: "দুধ আর চিনি জ্বাল দিয়ে তৈরি মিষ্টি। ময়মনসিংহের মুক্তাগাছার মণ্ডা পরিচিত।",
    aliases: ["mohnda", "mondaa", "মুক্তাগাছার মণ্ডা"],
  },
  {
    slug: "shatkora-beef",
    nameBn: "সাতকরা দিয়ে গরুর মাংস",
    nameEn: "Shatkora Beef",
    aboutBn: "সিলেটের বিশেষ লেবুজাতীয় ফল সাতকরা দিয়ে রান্না করা গরুর মাংস।",
    aliases: ["satkora beef", "shatkora", "satkora", "sat kora beef"],
  },
  {
    slug: "mango",
    nameBn: "আম",
    nameEn: "Mango",
    aboutBn: "রাজশাহী অঞ্চল আর চাঁপাইনবাবগঞ্জ আমের জন্য সুপরিচিত।",
    aliases: ["aam", "rajshahi aam", "himsagar", "langra"],
  },
  {
    slug: "ilish",
    nameBn: "ইলিশ",
    nameEn: "Hilsa",
    aboutBn: "বাংলাদেশের জাতীয় মাছ। চাঁদপুরের ইলিশ সুপরিচিত।",
    aliases: ["hilsa", "elish", "ilish mach", "ইলিশ মাছ"],
  },
  {
    slug: "shutki",
    nameBn: "শুঁটকি",
    nameEn: "Shutki (Dried Fish)",
    aboutBn: "রোদে শুকানো মাছ। কক্সবাজার শুঁটকির জন্য পরিচিত।",
    aliases: ["sutki", "dry fish", "dried fish", "shutki mach"],
  },
  {
    slug: "chui-jhal",
    nameBn: "চুইঝালের মাংস",
    nameEn: "Chui Jhal Meat",
    aboutBn: "চুইঝাল লতার ঝাঁজালো স্বাদে রান্না করা মাংস। খুলনার পরিচিত খাবার।",
    aliases: ["chuijhal", "chui jhal mangsho", "chui jhaal"],
  },
  {
    slug: "khejur-gur",
    nameBn: "খেজুরের গুড়",
    nameEn: "Date Palm Jaggery",
    aboutBn: "খেজুরের রস জ্বাল দিয়ে তৈরি গুড়। শীতকালে যশোর অঞ্চলে পাওয়া যায়।",
    aliases: ["khejur gur", "khejur gud", "gur", "date gur"],
  },
  {
    slug: "kataribhog",
    nameBn: "কাটারিভোগ চাল",
    nameEn: "Katarivog Rice",
    aboutBn: "সুগন্ধি চাল। দিনাজপুরের কাটারিভোগ পরিচিত।",
    aliases: ["kataribhog", "katari bhog", "katarivog"],
  },
  {
    slug: "lichu",
    nameBn: "লিচু",
    nameEn: "Lychee",
    aboutBn: "গ্রীষ্মের মৌসুমি ফল। দিনাজপুরের লিচু পরিচিত।",
    aliases: ["lichi", "litchi", "lychee"],
  },
  {
    slug: "sat-rongi-cha",
    nameBn: "সাত রঙের চা",
    nameEn: "Seven-Colour Tea",
    aboutBn: "এক কাপে সাত স্তরের চা। শ্রীমঙ্গলের (মৌলভীবাজার) পরিচিত পানীয়।",
    aliases: [
      "seven color tea",
      "7 color tea",
      "saat rongi cha",
      "sat rangi cha",
      "seven layer tea",
    ],
  },
  {
    slug: "balish-mishti",
    nameBn: "বালিশ মিষ্টি",
    nameEn: "Balish Mishti",
    aboutBn: "বালিশের মতো বড় আকারের মিষ্টি। নেত্রকোণার পরিচিত মিষ্টি।",
    aliases: ["balish misti", "balis mishti", "balish sweet"],
  },
  {
    slug: "til-khaja",
    nameBn: "তিলের খাজা",
    nameEn: "Til Khaja",
    aboutBn: "তিল আর চিনি দিয়ে তৈরি মিষ্টি। কুষ্টিয়ার তিলের খাজা পরিচিত।",
    aliases: ["tilkhaja", "til khaja", "tilkut", "kushtia khaja"],
  },
  {
    slug: "bamboo-chicken",
    nameBn: "বাঁশের চোঙায় মুরগি",
    nameEn: "Bamboo Chicken",
    aboutBn: "বাঁশের চোঙায় ভরে রান্না করা মুরগি। পার্বত্য অঞ্চলের পরিচিত খাবার।",
    aliases: ["bash chicken", "bamboo chicken", "bash er chicken", "বাঁশ চিকেন"],
  },
  {
    slug: "cha",
    nameBn: "চা",
    nameEn: "Tea",
    aboutBn: "পঞ্চগড়ের তেঁতুলিয়া অঞ্চলে চা চাষ হয়।",
    aliases: ["tea", "cha pata", "chaa"],
  },
];

export type FameSeed = { district: string; food: string; noteBn?: string };

/** Editorial "famous for" list. Order inside a district = display order. */
export const FAME: FameSeed[] = [
  { district: "dhaka", food: "kacchi", noteBn: "পুরান ঢাকার কাচ্চি" },
  { district: "dhaka", food: "bakarkhani" },
  { district: "bogura", food: "doi", noteBn: "মাটির হাঁড়ির দই" },
  { district: "natore", food: "kachagolla" },
  { district: "chattogram", food: "mezbani" },
  { district: "cumilla", food: "rasmalai" },
  { district: "tangail", food: "chomchom", noteBn: "পোড়াবাড়ীর চমচম" },
  { district: "mymensingh", food: "monda", noteBn: "মুক্তাগাছার মণ্ডা" },
  { district: "sylhet", food: "shatkora-beef" },
  { district: "rajshahi", food: "mango" },
  { district: "chapainawabganj", food: "mango" },
  { district: "chandpur", food: "ilish" },
  { district: "coxs-bazar", food: "shutki" },
  { district: "khulna", food: "chui-jhal" },
  { district: "jashore", food: "khejur-gur" },
  { district: "dinajpur", food: "kataribhog" },
  { district: "dinajpur", food: "lichu" },
  { district: "moulvibazar", food: "sat-rongi-cha", noteBn: "শ্রীমঙ্গল" },
  { district: "netrokona", food: "balish-mishti" },
  { district: "kushtia", food: "til-khaja" },
  { district: "rangamati", food: "bamboo-chicken" },
  { district: "bandarban", food: "bamboo-chicken" },
  { district: "panchagarh", food: "cha", noteBn: "তেঁতুলিয়া" },
];

export type PlaceType = "restaurant" | "shop" | "street_food" | "bakery" | "home_kitchen" | "other";

export type PlaceSeed = {
  slug: string;
  nameBn: string;
  nameEn: string;
  district: string;
  type: PlaceType;
  /** Foods this place is widely known for (food slugs). Counts, ratings and prices stay empty. */
  famousFor: string[];
};

/**
 * Only places that are clearly real and well known. Details (address, hours, price) are left for
 * contributors to confirm through the app's own verify flow.
 */
export const PLACES: PlaceSeed[] = [
  {
    slug: "haji-biryani-dhaka",
    nameBn: "হাজীর বিরিয়ানি",
    nameEn: "Haji Biryani",
    district: "dhaka",
    type: "restaurant",
    famousFor: ["kacchi"],
  },
  {
    slug: "fakruddin-biryani-dhaka",
    nameBn: "ফখরুদ্দিন বিরিয়ানি",
    nameEn: "Fakruddin Biryani",
    district: "dhaka",
    type: "restaurant",
    famousFor: ["kacchi"],
  },
  {
    slug: "sultans-dine-dhaka",
    nameBn: "সুলতানস ডাইন",
    nameEn: "Sultan's Dine",
    district: "dhaka",
    type: "restaurant",
    famousFor: ["kacchi"],
  },
  {
    slug: "matri-bhandar-cumilla",
    nameBn: "মাতৃ ভাণ্ডার",
    nameEn: "Matri Bhandar",
    district: "cumilla",
    type: "shop",
    famousFor: ["rasmalai"],
  },
  {
    slug: "nilkantha-tea-cabin-moulvibazar",
    nameBn: "নীলকণ্ঠ টি কেবিন",
    nameEn: "Nilkantha Tea Cabin",
    district: "moulvibazar",
    type: "shop",
    famousFor: ["sat-rongi-cha"],
  },
  {
    slug: "panshi-restaurant-sylhet",
    nameBn: "পানসী রেস্টুরেন্ট",
    nameEn: "Panshi Restaurant",
    district: "sylhet",
    type: "restaurant",
    famousFor: [],
  },
  {
    slug: "pach-bhai-restaurant-sylhet",
    nameBn: "পাঁচ ভাই রেস্টুরেন্ট",
    nameEn: "Pach Bhai Restaurant",
    district: "sylhet",
    type: "restaurant",
    famousFor: [],
  },
];
