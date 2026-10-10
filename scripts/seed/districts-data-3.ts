/**
 * Content outside Dhaka, part 3 (migrations 0025 to 0028): Barishal, Mymensingh, Rangpur, Cox's Bazar.
 * Same rules as dhaka-data.ts: only what published articles say, no prices or ratings, nothing
 * from review sites or delivery apps. Sources in docs/content-sources.md. These districts have
 * few newspaper-named shops; the lists stay short on purpose.
 */
import type { DhakaSet } from "./dhaka-data";

export const BARISHAL_SET: DhakaSet = {
  migration: "0025_seed_barishal.sql",
  number: "0025",
  districtSlug: "barishal",
  fameSortStart: 70,
  areas: [{ slug: "gournadi", nameBn: "গৌরনদী", nameEn: "Gournadi" }],
  foods: [],
  places: [
    {
      slug: "gaur-nitai-mistanna-bhandar-gournadi",
      nameBn: "গৌর নিতাই মিষ্টান্ন ভাণ্ডার",
      nameEn: "Gaur Nitai Mistanna Bhandar",
      district: "barishal",
      type: "shop",
      area: "gournadi",
      famousFor: ["doi", "rasmalai"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [
    {
      district: "barishal",
      food: "doi",
      noteBn: "গৌরনদীর দই",
      sourceUrl: "https://bangladeshpost.net/posts/gournadi-yogurt-gains-popularity-64263",
    },
  ],
  fameSources: [],
};

export const MYMENSINGH_SET: DhakaSet = {
  migration: "0026_seed_mymensingh.sql",
  number: "0026",
  districtSlug: "mymensingh",
  fameSortStart: 71,
  areas: [
    { slug: "swadeshi-bazar", nameBn: "স্বদেশি বাজার", nameEn: "Swadeshi Bazar" },
    { slug: "boro-kalibari", nameBn: "বড় কালীবাড়ি", nameEn: "Boro Kalibari" },
    { slug: "muktagachha", nameBn: "মুক্তাগাছা", nameEn: "Muktagachha" },
    { slug: "mymensingh-city", nameBn: "ময়মনসিংহ শহর", nameEn: "Mymensingh city" },
  ],
  foods: [
    {
      slug: "malaikari",
      nameBn: "মালাইকারী",
      nameEn: "Malaikari",
      aboutBn: "ছানার গোল মিষ্টি মাঝ বরাবর কেটে ভেতরে ক্ষীর ভরা ময়মনসিংহের ঐতিহ্যবাহী মিষ্টি।",
      aliases: ["malaikari", "malai kari", "malaikary", "মালাইকারি"],
    },
    {
      slug: "pera",
      nameBn: "পেঁড়া",
      nameEn: "Pera",
      aboutBn: "দুধ ও চিনি জ্বাল দিয়ে তৈরি নরম, দানাদার মিষ্টি।",
      aliases: ["peda", "pera", "পেড়া", "প্যাড়া"],
    },
  ],
  places: [
    {
      slug: "janaki-nag-sweets-mymensingh",
      nameBn: "জানকী নাগ সুইটস মিট",
      nameEn: "Janaki Nag Sweets",
      district: "mymensingh",
      type: "shop",
      area: "swadeshi-bazar",
      famousFor: ["malaikari"],
    },
    {
      slug: "krishna-cabin-mymensingh",
      nameBn: "কৃষ্ণা কেবিন",
      nameEn: "Krishna Cabin",
      district: "mymensingh",
      type: "shop",
      area: "mymensingh-city",
      famousFor: ["malaikari"],
    },
    {
      slug: "gopal-pal-monda-muktagachha",
      nameBn: "গোপাল পালের সিংহ মার্কা মণ্ডা",
      nameEn: "Gopal Pal's Shingha Marka Monda",
      district: "mymensingh",
      type: "shop",
      area: "muktagachha",
      famousFor: ["monda"],
    },
    {
      slug: "bikrampur-sweet-meat-mymensingh",
      nameBn: "বিক্রমপুর সুইট মিট",
      nameEn: "Bikrampur Sweet Meat",
      district: "mymensingh",
      type: "shop",
      area: "boro-kalibari",
      famousFor: ["pera"],
    },
    {
      slug: "adarsha-mistanno-bhandar-mymensingh",
      nameBn: "আদর্শ মিষ্টান্ন ভাণ্ডার",
      nameEn: "Adarsha Mistanno Bhandar",
      district: "mymensingh",
      type: "shop",
      area: "boro-kalibari",
      famousFor: ["pera"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [
    {
      district: "mymensingh",
      food: "malaikari",
      noteBn: "ময়মনসিংহের মালাইকারী",
      sourceUrl: "https://www.prothomalo.com/bangladesh/district/x2r6bnyevm",
    },
  ],
  fameSources: [
    {
      district: "mymensingh",
      food: "monda",
      sourceUrl:
        "https://thefinancialexpress.com.bd/national/the-interesting-history-behind-sweetmeat-monda-1578594577",
    },
  ],
};

export const RANGPUR_SET: DhakaSet = {
  migration: "0027_seed_rangpur.sql",
  number: "0027",
  districtSlug: "rangpur",
  areas: [{ slug: "haripatti", nameBn: "হাড়িপাট্টি", nameEn: "Haripatti" }],
  foods: [],
  places: [
    {
      slug: "rangpur-shingara-house",
      nameBn: "রংপুর সিঙ্গারা হাউজ",
      nameEn: "Rangpur Shingara House",
      district: "rangpur",
      type: "street_food",
      area: "haripatti",
      famousFor: ["singara"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [],
  fameSources: [],
};

export const COXS_BAZAR_SET: DhakaSet = {
  migration: "0028_seed_coxs_bazar.sql",
  number: "0028",
  districtSlug: "coxs-bazar",
  areas: [{ slug: "coxs-bazar-town", nameBn: "কক্সবাজার শহর", nameEn: "Cox's Bazar town" }],
  foods: [
    {
      slug: "loitta-fry",
      nameBn: "লইট্যা ফ্রাই",
      nameEn: "Loitta Fry",
      aboutBn: "লইট্যা (বোম্বে ডাক) মাছের ভাজা। কক্সবাজারে ভ্রমণকারীদের পরিচিত পদ।",
      aliases: ["loitta fry", "bombay duck fry", "bombil fry", "লইট্টা ফ্রাই", "লইট্যা মাছ ভাজা"],
    },
    {
      slug: "rupchanda-fry",
      nameBn: "রূপচাঁদা ফ্রাই",
      nameEn: "Rupchanda Fry",
      aboutBn: "সামুদ্রিক রূপচাঁদা (পমফ্রেট) মাছের ভাজা বা গ্রিল।",
      aliases: ["rupchanda fry", "pomfret fry", "rupchada fry", "রূপচান্দা ফ্রাই"],
    },
    {
      slug: "spicy-crab",
      nameBn: "স্পাইসি ক্র্যাব",
      nameEn: "Spicy Crab",
      aboutBn: "ঝাল মসলায় রান্না করা কাঁকড়া। কক্সবাজারের সামুদ্রিক খাবারের পরিচিত পদ।",
      aliases: ["spicy crab", "crab masala", "kakra", "কাঁকড়া ভুনা", "কাঁকড়ার ঝাল"],
    },
  ],
  places: [
    {
      slug: "poushi-restaurant-coxs-bazar",
      nameBn: "পৌষী রেস্টুরেন্ট",
      nameEn: "Poushi Restaurant",
      district: "coxs-bazar",
      type: "restaurant",
      area: "coxs-bazar-town",
      famousFor: ["loitta-fry"],
    },
    {
      slug: "jhaubon-coxs-bazar",
      nameBn: "ঝাউবন",
      nameEn: "Jhaubon",
      district: "coxs-bazar",
      type: "restaurant",
      area: "coxs-bazar-town",
      famousFor: ["rupchanda-fry"],
    },
    {
      slug: "salt-bistro-cafe-coxs-bazar",
      nameBn: "সল্ট বিস্ট্রো অ্যান্ড ক্যাফে",
      nameEn: "Salt Bistro and Cafe",
      district: "coxs-bazar",
      type: "restaurant",
      area: "coxs-bazar-town",
      famousFor: ["spicy-crab"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [],
  fameSources: [
    {
      district: "coxs-bazar",
      food: "shutki",
      sourceUrl: "https://www.thedailystar.net/coxs-bazar-to-do-list-48534",
    },
  ],
};
