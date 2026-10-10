/**
 * Content outside Dhaka (migrations 0018 and 0019): Chattogram and Sylhet. Same rules as
 * dhaka-data.ts: only what published articles say, no prices or ratings. Sources in
 * docs/content-sources.md.
 *
 * Sylhet is thin on purpose: the only newspaper coverage found names a dish (akhni), not shops.
 * Panshi and Pach Bhai were already seeded; they only gain the shatkora beef link.
 */
import type { DhakaSet } from "./dhaka-data";

export const CHATTOGRAM_SET: DhakaSet = {
  migration: "0018_seed_chattogram.sql",
  number: "0018",
  districtSlug: "chattogram",
  areas: [
    { slug: "chattogram-city", nameBn: "চট্টগ্রাম শহর", nameEn: "Chattogram city" },
    { slug: "shulakbahar", nameBn: "শুলকবহর", nameEn: "Shulakbahar" },
    { slug: "ak-khan", nameBn: "এ কে খান মোড়", nameEn: "AK Khan" },
    { slug: "ss-khaled-road", nameBn: "এস এস খালেদ রোড", nameEn: "SS Khaled Road" },
    { slug: "pahartali", nameBn: "পাহাড়তলী", nameEn: "Pahartali" },
    { slug: "railway-station", nameBn: "রেলওয়ে স্টেশন এলাকা", nameEn: "Railway Station" },
    { slug: "ma-aziz-stadium", nameBn: "এম এ আজিজ স্টেডিয়াম", nameEn: "MA Aziz Stadium" },
    { slug: "jhautola", nameBn: "ঝাউতলা", nameEn: "Jhautola" },
  ],
  foods: [
    {
      slug: "biscuit",
      nameBn: "বিস্কুট",
      nameEn: "Biscuit",
      aboutBn: "কাঠের চুলায় সেঁকা বেকারির বিস্কুট ও পাউরুটি।",
      aliases: ["biscuit", "biscut", "বিস্কিট", "bakery biscuit"],
    },
  ],
  places: [
    {
      slug: "mezzan-haile-aiyun-chattogram",
      nameBn: "মেজ্জান হাইলে আইয়ুন",
      nameEn: "Mezzan Haile Aiyun",
      district: "chattogram",
      type: "restaurant",
      area: "shulakbahar",
      famousFor: ["mezbani"],
    },
    {
      slug: "kutumbari-chattogram",
      nameBn: "কুটুমবাড়ি",
      nameEn: "Kutumbari",
      district: "chattogram",
      type: "restaurant",
      area: "ak-khan",
      famousFor: ["kacchi", "paya"],
    },
    {
      slug: "bir-chattala-chattogram",
      nameBn: "বীর চট্টলা",
      nameEn: "Bir Chattala",
      district: "chattogram",
      type: "restaurant",
      area: "ss-khaled-road",
      famousFor: ["khichuri", "bhorta"],
    },
    {
      slug: "member-hotel-chattogram",
      nameBn: "মেম্বার হোটেল",
      nameEn: "Member Hotel",
      district: "chattogram",
      type: "restaurant",
      area: "pahartali",
      famousFor: ["bhorta"],
    },
    {
      slug: "hotel-nizam-chattogram",
      nameBn: "হোটেল নিজাম",
      nameEn: "Hotel Nizam",
      district: "chattogram",
      type: "restaurant",
      area: "railway-station",
      famousFor: ["bhorta"],
    },
    {
      slug: "hamid-bhai-malai-tea-chattogram",
      nameBn: "হামিদ ভাইয়ের মালাই চা",
      nameEn: "Hamid Bhai er Malai Tea",
      district: "chattogram",
      type: "street_food",
      area: "ma-aziz-stadium",
      famousFor: ["cha"],
    },
    {
      slug: "goni-bakery-chattogram",
      nameBn: "গনি বেকারি",
      nameEn: "Goni Bakery",
      district: "chattogram",
      type: "bakery",
      area: "chattogram-city",
      famousFor: ["biscuit"],
    },
    {
      slug: "jhautola-street-food-chattogram",
      nameBn: "ঝাউতলার স্ট্রিট ফুড",
      nameEn: "Jhautola street food",
      district: "chattogram",
      type: "street_food",
      area: "jhautola",
      famousFor: ["chaap", "haleem"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [],
  fameSources: [
    {
      district: "chattogram",
      food: "mezbani",
      sourceUrl: "https://www.tbsnews.net/features/food/mezban-cuisine-choice-feasts-310606",
    },
  ],
};

export const SYLHET_SET: DhakaSet = {
  migration: "0019_seed_sylhet.sql",
  number: "0019",
  districtSlug: "sylhet",
  fameSortStart: 50,
  areas: [],
  foods: [
    {
      slug: "akhni",
      nameBn: "আখনি",
      nameEn: "Akhni",
      aboutBn:
        "কম মসলায় ছোট টুকরো মাংস দিয়ে রান্না করা সিলেটের পোলাও-জাতীয় খাবার। রমজানে ইফতারে জনপ্রিয়।",
      aliases: ["akni", "akhni biryani", "আখনি বিরিয়ানি"],
    },
  ],
  places: [],
  existingAreas: [],
  existingDishes: [
    { slug: "panshi-restaurant-sylhet", food: "shatkora-beef" },
    { slug: "pach-bhai-restaurant-sylhet", food: "shatkora-beef" },
  ],
  fame: [
    {
      district: "sylhet",
      food: "akhni",
      noteBn: "সিলেটের ইফতারের আখনি",
      sourceUrl:
        "https://www.thedailystar.net/news/bangladesh/news/akhni-staple-sylheti-iftars-3583866",
    },
  ],
  fameSources: [
    {
      district: "sylhet",
      food: "shatkora-beef",
      sourceUrl: "https://en.wikipedia.org/wiki/Satkara_beef",
    },
  ],
};
