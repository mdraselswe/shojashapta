/**
 * Dhaka content, part 4 (migration 0016): Chawkbazar iftar and the old sweet shops of Dhaka.
 * Same rules as dhaka-data.ts: only what published articles say, no prices or ratings (the iftar
 * prices in the articles change every year). Sources in docs/content-sources.md.
 */
import type { DhakaSet } from "./dhaka-data";

export const DHAKA_SET_4: DhakaSet = {
  migration: "0016_seed_dhaka_4.sql",
  number: "0016",
  fameSortStart: 20,
  areas: [
    { slug: "chawkbazar", nameBn: "চকবাজার", nameEn: "Chawkbazar" },
    { slug: "lalbagh", nameBn: "লালবাগ", nameEn: "Lalbagh" },
    { slug: "shakharibazar", nameBn: "শাঁখারীবাজার", nameEn: "Shakharibazar" },
    { slug: "nawabpur", nameBn: "নবাবপুর", nameEn: "Nawabpur" },
  ],
  foods: [
    {
      slug: "boro-baper-polay-khay",
      nameBn: "বড় বাপের পোলায় খায়",
      nameEn: "Boro Baper Polay Khay",
      aboutBn: "ছোলা, কিমা, ডিম, মগজসহ নানা উপকরণ ঘিয়ে মসলায় মেশানো চকবাজারের ইফতারের পরিচিত পদ।",
      aliases: [
        "boro baper pola khay",
        "bara bapke pole khay",
        "boro baper polay khai",
        "বড় বাপের পোলা",
      ],
    },
    {
      slug: "jilapi",
      nameBn: "জিলাপি",
      nameEn: "Jilapi",
      aboutBn:
        "ময়দার গোলা তেলে ভেজে চিনির রসে ডোবানো মিষ্টি। চকবাজারের শাহী জিলাপি রমজানে বিশেষ পরিচিত।",
      aliases: ["jalebi", "jilebi", "shahi jilapi", "জিলেপি", "শাহী জিলাপি"],
    },
    {
      slug: "haleem",
      nameBn: "হালিম",
      nameEn: "Haleem",
      aboutBn: "ডাল, গম ও মাংস একসঙ্গে ঘন করে রান্না করা খাবার। ইফতারে জনপ্রিয়।",
      aliases: ["halim", "haleem", "হালীম"],
    },
    {
      slug: "borhani",
      nameBn: "বোরহানি",
      nameEn: "Borhani",
      aboutBn: "দইয়ের ঝাল-টক পানীয়। বিরিয়ানি ও ইফতারের সঙ্গে খাওয়া হয়।",
      aliases: ["burhani", "borhani", "বুরহানি"],
    },
    {
      slug: "kalo-jam",
      nameBn: "কালো জাম",
      nameEn: "Kalo Jam",
      aboutBn: "ছানা বা খোয়ার গাঢ় রঙের ভাজা মিষ্টি, চিনির রসে ভেজা।",
      aliases: ["kalojam", "kala jamun", "kalo jaam", "কালোজাম"],
    },
    {
      slug: "malai-chop",
      nameBn: "মালাই চপ",
      nameEn: "Malai Chop",
      aboutBn: "মালাইয়ে ডোবানো নরম ছানার মিষ্টি।",
      aliases: ["malai chap", "malaichop", "মালাইচপ"],
    },
  ],
  places: [
    {
      slug: "chawkbazar-iftar-market-dhaka",
      nameBn: "চকবাজারের ইফতার বাজার",
      nameEn: "Chawkbazar iftar market",
      district: "dhaka",
      type: "street_food",
      area: "chawkbazar",
      famousFor: ["boro-baper-polay-khay", "jilapi", "haleem", "borhani"],
    },
    {
      slug: "madina-mishtanno-bhandar-dhaka",
      nameBn: "মদিনা মিষ্টান্ন ভাণ্ডার",
      nameEn: "Madina Mishtanno Bhandar",
      district: "dhaka",
      type: "shop",
      area: "lalbagh",
      famousFor: ["malai-chop"],
    },
    {
      slug: "omullo-mishtanno-bhandar-dhaka",
      nameBn: "অমূল্য মিষ্টান্ন ভাণ্ডার",
      nameEn: "Omullo Mishtanno Bhandar",
      district: "dhaka",
      type: "shop",
      area: "shakharibazar",
      famousFor: ["kalo-jam"],
    },
    {
      slug: "green-sweet-meat-dhaka",
      nameBn: "গ্রিন সুইট মিট",
      nameEn: "Green Sweet Meat",
      district: "dhaka",
      type: "shop",
      area: "thatari-bazar",
      famousFor: ["jilapi"],
    },
    {
      slug: "shonamia-mishtanno-bhandar-dhaka",
      nameBn: "সোনামিয়া মিষ্টান্ন ভাণ্ডার",
      nameEn: "Shonamia Mishtanno Bhandar",
      district: "dhaka",
      type: "shop",
      area: "gandaria",
      famousFor: ["chomchom", "doi", "rasmalai"],
    },
    {
      slug: "moron-chand-and-grandsons-dhaka",
      nameBn: "মরণ চাঁদ অ্যান্ড গ্র্যান্ডসন্স",
      nameEn: "Moron Chand and Grandsons",
      district: "dhaka",
      type: "shop",
      area: "nawabpur",
      famousFor: ["rasmalai", "kalo-jam"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [
    {
      district: "dhaka",
      food: "boro-baper-polay-khay",
      noteBn: "চকবাজারের ইফতার",
      sourceUrl: "https://en.wikipedia.org/wiki/Chawkbazar_Iftar_Market",
    },
    {
      district: "dhaka",
      food: "jilapi",
      noteBn: "চকবাজারের শাহী জিলাপি",
      sourceUrl: "https://en.wikipedia.org/wiki/Shahi_jilapi",
    },
  ],
  fameSources: [],
};
