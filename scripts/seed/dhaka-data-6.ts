/**
 * Dhaka content, part 6 (migration 0020): kacchi, morog polao, nihari, shawarma and tea.
 * Same rules as dhaka-data.ts: only what published articles say, no prices or ratings. Sources in
 * docs/content-sources.md. Mishti doi has no entry: no newspaper names a Dhaka shop for it.
 */
import type { DhakaSet } from "./dhaka-data";

export const DHAKA_SET_6: DhakaSet = {
  migration: "0020_seed_dhaka_6.sql",
  number: "0020",
  fameSortStart: 40,
  areas: [
    { slug: "satrowza", nameBn: "সাতরওজা", nameEn: "Satrowza" },
    { slug: "jigatola", nameBn: "জিগাতলা", nameEn: "Jigatola" },
    { slug: "wari", nameBn: "ওয়ারী", nameEn: "Wari" },
    { slug: "banasree", nameBn: "বনশ্রী", nameEn: "Banasree" },
  ],
  foods: [
    {
      slug: "morog-polao",
      nameBn: "মোরগ পোলাও",
      nameEn: "Morog Polao",
      aboutBn:
        "সুগন্ধি চালে দেশি মুরগি দিয়ে রান্না করা হালকা মসলার পোলাও। পুরান ঢাকার পরিচিত খাবার।",
      aliases: [
        "morog pulao",
        "murgh polao",
        "murgi polao",
        "chicken polao",
        "মোরগ পুলাও",
        "শাহী মোরগ পোলাও",
      ],
    },
    {
      slug: "nihari",
      nameBn: "নিহারি",
      nameEn: "Nihari",
      aboutBn:
        "গরু বা খাসির শ্যাঙ্কের ধীরে রান্না করা ঘন ঝোল। সাধারণত সকালে রুটি বা নানের সঙ্গে খাওয়া হয়।",
      aliases: ["nehari", "nihari", "নেহারি", "গরুর নিহারি"],
    },
    {
      slug: "shawarma",
      nameBn: "শর্মা",
      nameEn: "Shawarma",
      aboutBn:
        "মাংসের সরু টুকরো রুটিতে মুড়িয়ে স্যালাড ও সসের সঙ্গে খাওয়ার রোল। ঢাকায় জনপ্রিয় রাস্তার খাবার।",
      aliases: ["shwarma", "sharma", "shorma", "শোয়ারমা", "শাওয়ার্মা"],
    },
  ],
  places: [
    {
      slug: "kolkata-kachchi-dhaka",
      nameBn: "কলকাতা কাচ্চি",
      nameEn: "Kolkata Kachchi",
      district: "dhaka",
      type: "restaurant",
      area: "satrowza",
      famousFor: ["kacchi"],
    },
    {
      slug: "grand-nawab-dhaka",
      nameBn: "গ্র্যান্ড নবাব",
      nameEn: "Grand Nawab",
      district: "dhaka",
      type: "restaurant",
      area: "puran-dhaka",
      famousFor: ["kacchi", "tehari"],
    },
    {
      slug: "kachchi-bhai-dhaka",
      nameBn: "কাচ্চি ভাই",
      nameEn: "Kachchi Bhai",
      district: "dhaka",
      type: "restaurant",
      area: "bashundhara",
      famousFor: ["kacchi"],
    },
    {
      slug: "bashmoti-kachchi-dhaka",
      nameBn: "বাসমতি কাচ্চি",
      nameEn: "Bashmoti Kachchi",
      district: "dhaka",
      type: "restaurant",
      area: "jigatola",
      famousFor: ["kacchi"],
    },
    {
      slug: "maa-shahi-halim-dhaka",
      nameBn: "মা শাহী হালিম",
      nameEn: "Maa Shahi Halim (Siddiqui Bhai)",
      district: "dhaka",
      type: "restaurant",
      area: "lalbagh",
      famousFor: ["nihari", "haleem"],
    },
    {
      slug: "nihariwala-dhaka",
      nameBn: "নিহারিওয়ালা",
      nameEn: "Nihariwala",
      district: "dhaka",
      type: "restaurant",
      area: "banani",
      famousFor: ["nihari"],
    },
    {
      slug: "mia-bhai-restaurant-dhaka",
      nameBn: "মিয়া ভাই রেস্টুরেন্ট",
      nameEn: "Mia Bhai Restaurant",
      district: "dhaka",
      type: "restaurant",
      area: "banasree",
      famousFor: ["nihari"],
    },
    {
      slug: "peshwarain-dhaka",
      nameBn: "পেশোয়ারাইন",
      nameEn: "Peshwarain",
      district: "dhaka",
      type: "restaurant",
      area: "wari",
      famousFor: ["nihari"],
    },
    {
      slug: "grand-chandu-shahi-nihari-dhaka",
      nameBn: "গ্র্যান্ড চান্দু শাহী নিহারি",
      nameEn: "Grand Chandu Shahi Nihari",
      district: "dhaka",
      type: "restaurant",
      area: "mirpur",
      famousFor: ["nihari"],
    },
    {
      slug: "lahori-nihari-dhaka",
      nameBn: "লাহোরি নিহারি ঢাকা",
      nameEn: "Lahori Nihari Dhaka",
      district: "dhaka",
      type: "restaurant",
      area: "dhanmondi",
      famousFor: ["nihari"],
    },
    {
      slug: "shawarma-house-dhaka",
      nameBn: "শর্মা হাউজ",
      nameEn: "Shawarma House",
      district: "dhaka",
      type: "restaurant",
      area: "dhanmondi",
      famousFor: ["shawarma"],
    },
    {
      slug: "arabian-fast-food-dhaka",
      nameBn: "আরাবিয়ান ফাস্ট ফুড",
      nameEn: "Arabian Fast Food",
      district: "dhaka",
      type: "restaurant",
      area: "dhanmondi",
      famousFor: ["shawarma"],
    },
    {
      slug: "pannu-tea-store-dhaka",
      nameBn: "পান্নুর চা",
      nameEn: "Pannu's Tea",
      district: "dhaka",
      type: "street_food",
      area: "nazira-bazar",
      famousFor: ["cha"],
    },
    {
      slug: "cha-chai-gulshan-dhaka",
      nameBn: "চা চাই",
      nameEn: "Cha Chai",
      district: "dhaka",
      type: "restaurant",
      area: "gulshan",
      famousFor: ["cha"],
    },
  ],
  existingAreas: [{ slug: "sultans-dine-dhaka", area: "dhanmondi" }],
  existingDishes: [
    { slug: "junu-polao-ghor-dhaka", food: "morog-polao" },
    { slug: "star-hotel-dhaka", food: "cha" },
  ],
  fame: [
    {
      district: "dhaka",
      food: "morog-polao",
      noteBn: "পুরান ঢাকার মোরগ পোলাও",
      sourceUrl:
        "https://www.tbsnews.net/feature/food/jhunu-polao-ghor-serving-aromatic-morog-polao-51-years-229126",
    },
    {
      district: "dhaka",
      food: "nihari",
      noteBn: "লালবাগের নিহারি",
      sourceUrl:
        "https://www.thedailystar.net/my-dhaka/news/why-old-dhakas-siddiqui-bhai-nihari-must-try-3972511",
    },
    {
      district: "dhaka",
      food: "cha",
      noteBn: "নাজিরা বাজারের চা",
      sourceUrl:
        "https://www.thedailystar.net/life-living/food-recipes/news/the-best-tea-spots-you-can-find-3161996",
    },
  ],
  fameSources: [],
};
