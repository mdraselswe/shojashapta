/**
 * Dhaka content (migration 0013): well-known places and what each is known for, by area.
 * Flagged is_seed like the rest, so `select purge_seed_data();` can remove it.
 *
 * Rules (decisions P5/P9, docs/01-product-spec.md): only what published articles say. A place is a
 * name, an area and what it is known for. No ratings, reviews, prices, hours, addresses or claims
 * are written here; contributors add and verify those in the app. Sources are listed in
 * docs/content-sources.md. Shops can close or move: the app's own verify flow keeps this honest.
 */
import type { FameSeed, FoodSeed, PlaceSeed } from "./data";

export type AreaSeed = { slug: string; nameBn: string; nameEn: string };

/** Areas of Dhaka district (the area a place sits in). */
export const DHAKA_AREAS: AreaSeed[] = [
  { slug: "puran-dhaka", nameBn: "পুরান ঢাকা", nameEn: "Old Dhaka" },
  { slug: "nazira-bazar", nameBn: "নাজিরা বাজার", nameEn: "Nazira Bazar" },
  { slug: "johnson-road", nameBn: "জনসন রোড", nameEn: "Johnson Road" },
  { slug: "gandaria", nameBn: "গেণ্ডারিয়া", nameEn: "Gandaria" },
  { slug: "thatari-bazar", nameBn: "ঠাটারী বাজার", nameEn: "Thatari Bazar" },
  { slug: "armanitola", nameBn: "আর্মানিটোলা", nameEn: "Armanitola" },
  { slug: "bangshal", nameBn: "বংশাল", nameEn: "Bangshal" },
  { slug: "agamasi-lane", nameBn: "আগামসি লেন", nameEn: "Agamasi Lane" },
  { slug: "becharam-dewri", nameBn: "বেচারাম দেউড়ি", nameEn: "Becharam Dewri" },
  { slug: "mohammadpur", nameBn: "মোহাম্মদপুর", nameEn: "Mohammadpur" },
  { slug: "lalmatia", nameBn: "লালমাটিয়া", nameEn: "Lalmatia" },
  { slug: "mirpur", nameBn: "মিরপুর", nameEn: "Mirpur" },
  { slug: "dhanmondi", nameBn: "ধানমন্ডি", nameEn: "Dhanmondi" },
  { slug: "gulshan", nameBn: "গুলশান", nameEn: "Gulshan" },
  { slug: "uttara", nameBn: "উত্তরা", nameEn: "Uttara" },
];

export const DHAKA_FOODS: FoodSeed[] = [
  {
    slug: "tehari",
    nameBn: "তেহারি",
    nameEn: "Tehari",
    aboutBn:
      "মাংস আর চাল একসঙ্গে মসলায় রান্না করা ঢাকার পরিচিত খাবার। পুরান ঢাকায় বিশেষ জনপ্রিয়।",
    aliases: ["tehary", "tehri", "তেহারী"],
  },
  {
    slug: "chaap",
    nameBn: "চাপ",
    nameEn: "Chaap",
    aboutBn: "হালকা ভাজা মাংসের টুকরো। পরোটা বা লুচির সঙ্গে খাওয়া হয়।",
    aliases: ["chap", "chaop", "চাপ"],
  },
  {
    slug: "kabab",
    nameBn: "কাবাব",
    nameEn: "Kabab",
    aboutBn: "সেঁকা বা ভাজা মাংসের কাবাব। পুরান ঢাকা ও মোহাম্মদপুরের পরিচিত খাবার।",
    aliases: ["kebab", "kabob", "kabab ghor"],
  },
  {
    slug: "lassi",
    nameBn: "লাচ্ছি",
    nameEn: "Lassi",
    aboutBn: "দই, চিনি আর বরফ দিয়ে তৈরি ঠান্ডা পানীয়।",
    aliases: ["lacchi", "lasi", "লাসসি", "লাচ্ছি"],
  },
  {
    slug: "faluda",
    nameBn: "ফালুদা",
    nameEn: "Faluda",
    aboutBn: "দুধ, শরবত আর সেমাইয়ের মতো ফালুদা দিয়ে তৈরি ঠান্ডা মিষ্টি।",
    aliases: ["falooda", "faloda", "ফালুদা"],
  },
  {
    slug: "fuchka",
    nameBn: "ফুচকা",
    nameEn: "Fuchka",
    aboutBn: "টক-ঝাল পানিতে ডোবানো ফাঁপা কুড়মুড়ে ফুচকা, ভেতরে ছোলা বা আলুর পুর।",
    aliases: ["phuchka", "puchka", "pani puri", "panipuri", "ফুসকা", "পানিপুরি"],
  },
  {
    slug: "chotpoti",
    nameBn: "চটপটি",
    nameEn: "Chotpoti",
    aboutBn: "সেদ্ধ ছোলা, আলু ও ডিম টক-ঝালে মাখানো।",
    aliases: ["chotpoti", "chatpati", "chotpotti", "চটপটী"],
  },
  {
    slug: "bhorta",
    nameBn: "ভর্তা",
    nameEn: "Bhorta",
    aboutBn: "সেদ্ধ বা পোড়া উপকরণ মসলায় মেখে বানানো ভর্তা। ভাতের সঙ্গে খাওয়া হয়।",
    aliases: ["vorta", "bharta", "ভর্তা"],
  },
];

export type DhakaPlace = PlaceSeed & { area: string };

const place = (
  slug: string,
  nameBn: string,
  nameEn: string,
  type: PlaceSeed["type"],
  area: string,
  famousFor: string[],
): DhakaPlace => ({ slug, nameBn, nameEn, district: "dhaka", type, area, famousFor });

export const DHAKA_PLACES: DhakaPlace[] = [
  // পুরান ঢাকা: বিরিয়ানি ও তেহারি
  place("hanif-biryani-dhaka", "হানিফ বিরিয়ানি", "Hanif Biryani", "restaurant", "nazira-bazar", [
    "tehari",
  ]),
  place(
    "nanna-biryani-dhaka",
    "নান্না মিয়ার বিরিয়ানি",
    "Nanna Miar Biryani",
    "restaurant",
    "puran-dhaka",
    ["kacchi"],
  ),
  place("junu-polao-ghor-dhaka", "জুনু পোলাও ঘর", "Junu Polao Ghor", "restaurant", "puran-dhaka", [
    "kacchi",
  ]),
  place("star-hotel-dhaka", "স্টার হোটেল", "Star Hotel", "restaurant", "puran-dhaka", ["kacchi"]),
  place("al-razzaque-dhaka", "হোটেল আল-রাজ্জাক", "Hotel Al-Razzaque", "restaurant", "puran-dhaka", [
    "kacchi",
  ]),
  place(
    "bokhari-restaurant-dhaka",
    "বোখারী রেস্তোরাঁ",
    "Bokhari Restaurant",
    "restaurant",
    "johnson-road",
    ["lassi", "faluda", "kabab"],
  ),

  // পুরান ঢাকা: লাচ্ছি
  place(
    "beauty-lassi-dhaka",
    "বিউটি লাচ্ছি ও ফালুদা",
    "Beauty Lassi and Faluda",
    "shop",
    "johnson-road",
    ["lassi", "faluda"],
  ),

  // পুরান ঢাকা: কাবাব
  place(
    "bismillah-kabab-ghar-dhaka",
    "বিসমিল্লাহ কাবাব ঘর",
    "Bismillah Kabab Ghar",
    "restaurant",
    "nazira-bazar",
    ["chaap", "kabab"],
  ),
  place("badshahi-kabab-dhaka", "বাদশাহী কাবাব", "Badshahi Kabab", "restaurant", "nazira-bazar", [
    "kabab",
  ]),
  place("kabab-king-dhaka", "কাবাব কিং", "Kabab King", "restaurant", "puran-dhaka", ["kabab"]),
  place("rahmania-kabab-dhaka", "রহমানিয়া কাবাব", "Rahmania Kabab", "restaurant", "gandaria", [
    "kabab",
  ]),
  place("bot-tolar-kabab-dhaka", "বটতলার কাবাব", "Bot Tolar Kabab", "restaurant", "thatari-bazar", [
    "kabab",
  ]),

  // পুরান ঢাকা: বাকরখানি
  place(
    "al-amin-bakarkhani-dhaka",
    "আল-আমিন বাকরখানি",
    "Al-Amin Bakarkhani",
    "bakery",
    "puran-dhaka",
    ["bakarkhani"],
  ),
  place(
    "shahjalal-bakarkhani-dhaka",
    "শাহজালালের বাকরখানি",
    "Shahjalal Bakarkhani",
    "bakery",
    "agamasi-lane",
    ["bakarkhani"],
  ),
  place(
    "yakub-ali-bakarkhani-dhaka",
    "ইয়াকুব আলীর বাকরখানি",
    "Yakub Ali Bakarkhani",
    "bakery",
    "nazira-bazar",
    ["bakarkhani"],
  ),
  place(
    "mostofa-bakarkhani-dhaka",
    "মোস্তফার বাকরখানি",
    "Mostofa Bakarkhani",
    "bakery",
    "becharam-dewri",
    ["bakarkhani"],
  ),

  // ফুচকা
  place("jummon-fuchka-dhaka", "জুম্মন ফুচকা", "Jummon Fuchka", "street_food", "armanitola", [
    "fuchka",
  ]),
  place(
    "mujibur-miar-fuchka-dhaka",
    "মুজিবুর মিয়ার ফুচকা",
    "Mujibur Miar Fuchka",
    "street_food",
    "bangshal",
    ["fuchka"],
  ),
  place("mama-fuchka-dhaka", "মামা ফুচকা", "Mama Fuchka", "street_food", "lalmatia", [
    "fuchka",
    "chotpoti",
  ]),
  place(
    "paanipuri-gulshan-dhaka",
    "পানিপুরি (গুলশান)",
    "Paanipuri Gulshan",
    "street_food",
    "gulshan",
    ["fuchka"],
  ),

  // মোহাম্মদপুর
  place(
    "mostakim-chaap-dhaka",
    "মোস্তাকিমের চাপ",
    "Mostakim's Chaap",
    "restaurant",
    "mohammadpur",
    ["chaap"],
  ),
  place(
    "selim-kabab-ghor-dhaka",
    "সেলিম কাবাব ঘর",
    "Selim Kabab Ghor",
    "restaurant",
    "mohammadpur",
    ["kabab", "chaap"],
  ),

  // মিরপুর
  place("shawkat-kabab-ghor-dhaka", "শওকত কাবাব ঘর", "Shawkat Kabab Ghor", "restaurant", "mirpur", [
    "chaap",
    "kabab",
  ]),
  place("kallu-kabab-ghar-dhaka", "কাল্লু কাবাব ঘর", "Kallu Kabab Ghar", "restaurant", "mirpur", [
    "chaap",
  ]),

  // ধানমন্ডি, গুলশান, উত্তরা
  place("kasturi-dhaka", "কস্তুরী", "Kasturi", "restaurant", "dhanmondi", ["bhorta", "ilish"]),
  place("star-kabab-dhaka", "স্টার কাবাব", "Star Kabab", "restaurant", "dhanmondi", ["kabab"]),
  place("chittagong-bull-dhaka", "চিটাগাং বুল", "Chittagong Bull", "restaurant", "gulshan", [
    "mezbani",
  ]),
  place("kacchi-wala-dhaka", "কাচ্চি ওয়ালা", "Kacchi Wala", "restaurant", "uttara", ["kacchi"]),
];

/** The first places (seeded in 0007) get their area, and what they are also known for. */
export const EXISTING_PLACE_AREAS: { slug: string; area: string }[] = [
  { slug: "haji-biryani-dhaka", area: "nazira-bazar" },
];

/** Extra dishes for places that already exist. */
export const EXISTING_PLACE_DISHES: { slug: string; food: string }[] = [
  { slug: "haji-biryani-dhaka", food: "tehari" },
];

export type DhakaFame = FameSeed & { sourceUrl: string };

/** Dhaka's "famous for" list, each with the article it comes from. */
export const DHAKA_FAME: DhakaFame[] = [
  {
    district: "dhaka",
    food: "tehari",
    noteBn: "নাজিরা বাজারের তেহারি",
    sourceUrl: "https://en.prothomalo.com/lifestyle/5j2cgkma56",
  },
  {
    district: "dhaka",
    food: "lassi",
    noteBn: "জনসন রোডের লাচ্ছি",
    sourceUrl: "https://www.tbsnews.net/node/260941",
  },
  {
    district: "dhaka",
    food: "chaap",
    noteBn: "মোহাম্মদপুর ও মিরপুরের চাপ",
    sourceUrl: "https://www.tbsnews.net/node/29997",
  },
  {
    district: "dhaka",
    food: "kabab",
    noteBn: "পুরান ঢাকার কাবাব",
    sourceUrl:
      "https://www.dhakatribune.com/bangladesh/351060/culinary-delights-of-puran-dhaka-a-voyage-through",
  },
  {
    district: "dhaka",
    food: "fuchka",
    noteBn: "পুরান ঢাকা ও মোহাম্মদপুরের ফুচকা",
    sourceUrl: "https://www.tbsnews.net/node/493514",
  },
];

/** Sources for the two entries already in the list (0007). */
export const EXISTING_FAME_SOURCES: { district: string; food: string; sourceUrl: string }[] = [
  {
    district: "dhaka",
    food: "kacchi",
    sourceUrl: "https://en.prothomalo.com/lifestyle/oy35boxrqf",
  },
  {
    district: "dhaka",
    food: "bakarkhani",
    sourceUrl: "https://www.tbsnews.net/feature/food/still-love-bakarkhani",
  },
];

/** One migration's worth of Dhaka content. */
export type DhakaSet = {
  migration: string;
  number: string;
  /** District the areas and places belong to (default "dhaka"). */
  districtSlug?: string;
  /** Display order of this part's famous-for entries starts here (default 10). */
  fameSortStart?: number;
  areas: AreaSeed[];
  foods: FoodSeed[];
  places: DhakaPlace[];
  existingAreas: { slug: string; area: string }[];
  existingDishes: { slug: string; food: string }[];
  fame: DhakaFame[];
  fameSources: { district: string; food: string; sourceUrl: string }[];
};

export const DHAKA_SET_1: DhakaSet = {
  migration: "0013_seed_dhaka.sql",
  number: "0013",
  areas: DHAKA_AREAS,
  foods: DHAKA_FOODS,
  places: DHAKA_PLACES,
  existingAreas: EXISTING_PLACE_AREAS,
  existingDishes: EXISTING_PLACE_DISHES,
  fame: DHAKA_FAME,
  fameSources: EXISTING_FAME_SOURCES,
};
