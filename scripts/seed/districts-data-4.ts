/**
 * Content outside Dhaka, part 4 (migrations 0029 to 0059): the remaining districts that have at
 * least one shop or restaurant named in a newspaper. Same rules as dhaka-data.ts: only what
 * published articles say, no prices or ratings, nothing from review sites or delivery apps.
 * Sources in docs/content-sources.md.
 */
import type { DhakaSet } from "./dhaka-data";

type Place = DhakaSet["places"][number];
type Area = DhakaSet["areas"][number];
type Food = DhakaSet["foods"][number];
type Fame = DhakaSet["fame"][number];
type FameSource = DhakaSet["fameSources"][number];

let counter = 28;

/** One district per migration; numbers run on from 0028. */
function districtSet(
  district: string,
  options: {
    suffix?: string;
    areas?: Area[];
    foods?: Food[];
    places?: Omit<Place, "district">[];
    fame?: Fame[];
    fameSources?: FameSource[];
  },
): DhakaSet {
  counter += 1;
  const number = String(counter).padStart(4, "0");
  const name = `${district.replace(/-/g, "_")}${options.suffix ?? ""}`;
  return {
    migration: `${number}_seed_${name}.sql`,
    number,
    districtSlug: district,
    fameSortStart: 80 + counter,
    areas: options.areas ?? [],
    foods: options.foods ?? [],
    places: (options.places ?? []).map((place) => ({ ...place, district })),
    existingAreas: [],
    existingDishes: [],
    fame: options.fame ?? [],
    fameSources: options.fameSources ?? [],
  };
}

const area = (slug: string, nameBn: string, nameEn: string): Area => ({ slug, nameBn, nameEn });

export const JAMALPUR_SET = districtSet("jamalpur", {
  areas: [area("amlapara", "আমলাপাড়া", "Amlapara")],
  places: [
    {
      slug: "burima-mistanna-bhandar-jamalpur",
      nameBn: "বুড়িমা মিষ্টান্ন ভান্ডার",
      nameEn: "Burima Mistanna Bhandar",
      type: "shop",
      area: "amlapara",
      famousFor: ["chomchom", "doi", "shondesh"],
    },
  ],
});

export const TANGAIL_SET = districtSet("tangail", {
  areas: [area("jamurki", "জামুর্কী", "Jamurki")],
  places: [
    {
      slug: "kalidas-mistanna-bhandar-jamurki",
      nameBn: "কালীদাস মিষ্টান্ন ভান্ডার",
      nameEn: "Kalidas Mistanna Bhandar",
      type: "shop",
      area: "jamurki",
      famousFor: ["shondesh", "chomchom"],
    },
  ],
  fameSources: [
    {
      district: "tangail",
      food: "chomchom",
      sourceUrl: "https://bangla.thedailystar.net/life-living/food-health/news-478986",
    },
  ],
});

export const KURIGRAM_SET = districtSet("kurigram", {
  areas: [area("kalibari", "কালীবাড়ি", "Kalibari")],
  foods: [
    {
      slug: "rasmanjuri",
      nameBn: "রসমঞ্জুরি",
      nameEn: "Rasmanjuri",
      aboutBn: "ছানার মিষ্টি, রসে ডোবানো। উত্তরাঞ্চলে গাইবান্ধা ও কুড়িগ্রামে পরিচিত।",
      aliases: ["rasmanjari", "rasmonjuri", "rosmanjuri", "রসমঞ্জরী"],
    },
  ],
  places: [
    {
      slug: "jhantu-mishtanno-bhandar-kurigram",
      nameBn: "ঝন্টু মিষ্টান্ন ভান্ডার",
      nameEn: "Jhantu Mishtanno Bhandar",
      type: "shop",
      area: "kalibari",
      famousFor: ["chomchom", "rasmanjuri", "shondesh"],
    },
  ],
});

export const JASHORE_SET = districtSet("jashore", {
  areas: [area("chowrasta", "চৌরাস্তা", "Chowrasta")],
  places: [
    {
      slug: "jolojog-jashore",
      nameBn: "জলযোগ",
      nameEn: "Jolojog",
      type: "restaurant",
      area: "chowrasta",
      famousFor: ["luchi", "chomchom", "rasmalai", "chanar-polao"],
    },
  ],
});

export const PABNA_SET = districtSet("pabna", {
  areas: [area("ishwardi", "ঈশ্বরদী", "Ishwardi")],
  places: [
    {
      slug: "kori-pals-sweet-shop-ishwardi",
      nameBn: "কড়ি পালের মিষ্টির দোকান",
      nameEn: "Kori Pal's sweet shop",
      type: "shop",
      area: "ishwardi",
      famousFor: ["mishti", "doi"],
    },
  ],
});

export const GOPALGANJ_SET = districtSet("gopalganj", {
  areas: [area("dc-market", "ডিসি মার্কেট", "DC Market")],
  places: [
    {
      slug: "dutta-mistanna-bhandar-gopalganj",
      nameBn: "দত্ত মিষ্টান্ন ভান্ডার",
      nameEn: "Dutta Mistanna Bhandar",
      type: "shop",
      area: "dc-market",
      famousFor: ["roshogolla", "shondesh", "chomchom", "kalo-jam"],
    },
  ],
});

export const HABIGANJ_SET = districtSet("habiganj", {
  areas: [area("habiganj-town", "হবিগঞ্জ শহর", "Habiganj town")],
  places: [
    {
      slug: "adi-gopal-mistanna-bhandar-habiganj",
      nameBn: "আদি গোপাল মিষ্টান্ন ভান্ডার",
      nameEn: "Adi Gopal Mistanna Bhandar",
      type: "shop",
      area: "habiganj-town",
      famousFor: ["roshogolla", "rasmalai"],
    },
  ],
});

export const SATKHIRA_SET = districtSet("satkhira", {
  areas: [
    area("laboni-mor", "লাবণী মোড়", "Laboni Mor"),
    area("boro-bazar", "বড় বাজার", "Boro Bazar"),
    area("satkhira-town", "সাতক্ষীরা শহর", "Satkhira town"),
  ],
  places: [
    {
      slug: "jayhun-dairy-shop-satkhira",
      nameBn: "জায়হুন ডেইরি শপ",
      nameEn: "Jayhun Dairy Shop",
      type: "shop",
      area: "laboni-mor",
      famousFor: ["mishti"],
    },
    {
      slug: "atar-alir-doi-satkhira",
      nameBn: "আতর আলীর দই",
      nameEn: "Atar Ali's doi",
      type: "shop",
      area: "boro-bazar",
      famousFor: ["doi"],
    },
    {
      slug: "sushil-moyra-satkhira",
      nameBn: "সুশীল ময়রা",
      nameEn: "Sushil Moyra",
      type: "shop",
      area: "satkhira-town",
      famousFor: ["shondesh", "doi", "mishti"],
    },
  ],
});

export const SHARIATPUR_SET = districtSet("shariatpur", {
  areas: [area("palong-bazar", "পালং বাজার", "Palong Bazar")],
  places: [
    {
      slug: "haru-ghosh-mishtanno-bhandar-shariatpur",
      nameBn: "হারু ঘোষ মিষ্টান্ন ভান্ডার",
      nameEn: "Haru Ghosh Mishtanno Bhandar",
      type: "shop",
      area: "palong-bazar",
      famousFor: ["roshogolla", "shondesh", "rasmalai"],
    },
  ],
});

export const SIRAJGANJ_SET = districtSet("sirajganj", {
  areas: [
    area("banshtala-bazar", "বাঁশতলা বাজার", "Banshtala Bazar"),
    area("enayetpur", "এনায়েতপুর", "Enayetpur"),
  ],
  foods: [
    {
      slug: "pantua",
      nameBn: "পানতোয়া",
      nameEn: "Pantua",
      aboutBn: "ছানা ও ময়দার গোল, ভাজা, রসে ডোবানো মিষ্টি। সিরাজগঞ্জ যমুনাপারে পরিচিত।",
      aliases: ["panthua", "pantoa", "পান্তুয়া", "পানতুয়া"],
    },
  ],
  places: [
    {
      slug: "bholanath-mistanna-bhandar-chauhali",
      nameBn: "ভোলানাথ মিষ্টান্ন ভান্ডার",
      nameEn: "Bholanath Mistanna Bhandar",
      type: "shop",
      area: "banshtala-bazar",
      famousFor: ["pantua"],
    },
    {
      slug: "rani-mistanna-bhandar-enayetpur",
      nameBn: "রনি মিষ্টান্ন ভান্ডার",
      nameEn: "Rani Mistanna Bhandar",
      type: "shop",
      area: "enayetpur",
      famousFor: ["pantua", "roshogolla", "rasmalai"],
    },
  ],
});

export const NAOGAON_SET = districtSet("naogaon", {
  areas: [area("atapatti", "আটাপট্টি", "Atapatti")],
  foods: [
    {
      slug: "khasir-biryani",
      nameBn: "খাসির বিরিয়ানি",
      nameEn: "Khasi Biryani",
      aboutBn: "খাসির মাংস ও সুগন্ধি চালে রান্না করা বিরিয়ানি।",
      aliases: ["mutton biryani", "khashi biryani", "খাসী বিরিয়ানি"],
    },
  ],
  places: [
    {
      slug: "sabbir-hotel-restaurant-naogaon",
      nameBn: "সাব্বীর হোটেল অ্যান্ড রেস্টুরেন্ট",
      nameEn: "Sabbir Hotel and Restaurant",
      type: "restaurant",
      area: "atapatti",
      famousFor: ["khasir-biryani"],
    },
  ],
});

export const FENI_SET = districtSet("feni", {
  areas: [area("parshuram", "পরশুরাম", "Parshuram")],
  foods: [
    {
      slug: "khondol",
      nameBn: "খোন্দল মিষ্টি",
      nameEn: "Khondol sweet",
      aboutBn: "ফেনীর পরশুরামের খোন্দল এলাকার ঐতিহ্যবাহী মিষ্টি, গরম বা ঠান্ডা খাওয়া যায়।",
      aliases: ["khondol misti", "khondoler misti", "খন্দলের মিষ্টি", "খোন্দলের মিষ্টি"],
    },
  ],
  places: [
    {
      slug: "khondoler-patwary-misti-mela-feni",
      nameBn: "খোন্দলের পাটওয়ারী মিষ্টি মেলা",
      nameEn: "Khondoler Patwary Misti Mela",
      type: "shop",
      area: "parshuram",
      famousFor: ["khondol"],
    },
  ],
  fame: [
    {
      district: "feni",
      food: "khondol",
      noteBn: "পরশুরামের খোন্দল",
      sourceUrl:
        "https://thefinancialexpress.com.bd/views/fenis-khondol-sweet-a-taste-of-tradition-1627031408",
    },
  ],
});

export const MADARIPUR_SET = districtSet("madaripur", {
  areas: [area("old-court", "পুরোনো আদালত এলাকা", "Old Court area")],
  foods: [
    {
      slug: "khirpuri",
      nameBn: "ক্ষীরপুরি",
      nameEn: "Khirpuri",
      aboutBn: "ক্ষীর ভরা পুরির মতো মিষ্টি। মাদারীপুরের পরিচিত মিষ্টি।",
      aliases: ["kheerpuri", "khirpuri", "khir puri", "ক্ষীরপুরী"],
    },
  ],
  places: [
    {
      slug: "jibon-misthanna-bhandar-madaripur",
      nameBn: "জীবন মিষ্টান্ন ভাণ্ডার",
      nameEn: "Jibon Misthanna Bhandar",
      type: "shop",
      area: "old-court",
      famousFor: ["khirpuri", "roshogolla", "rasmalai"],
    },
  ],
  fame: [
    {
      district: "madaripur",
      food: "khirpuri",
      noteBn: "মাদারীপুরের ক্ষীরপুরি",
      sourceUrl: "https://bangla.thedailystar.net/life-living/food-recipe/news-668541",
    },
  ],
});

export const MANIKGANJ_SET = districtSet("manikganj", {
  areas: [area("terashri-bazar", "তেরশ্রী বাজার", "Terashri Bazar")],
  foods: [
    {
      slug: "nizamer-mishti",
      nameBn: "নিজামের মিষ্টি",
      nameEn: "Nizamer Mishti",
      aboutBn: "ছানার মিষ্টির ওপর মাওয়ার প্রলেপ দেওয়া ঘিওরের মিষ্টি।",
      aliases: ["nizam er misti", "nijamer mishti", "নিজামের মিস্টি"],
    },
  ],
  places: [
    {
      slug: "nizamer-mishti-ghior",
      nameBn: "নিজামের মিষ্টি",
      nameEn: "Nizamer Mishti",
      type: "shop",
      area: "terashri-bazar",
      famousFor: ["nizamer-mishti"],
    },
  ],
});

export const FARIDPUR_SET = districtSet("faridpur", {
  areas: [area("boalmari", "বোয়ালমারী", "Boalmari")],
  foods: [
    {
      slug: "para-shondesh",
      nameBn: "প্যারা সন্দেশ",
      nameEn: "Para Shondesh",
      aboutBn: "ছানা ও চিনির তৈরি গোল সন্দেশ। ফরিদপুরের বোয়ালমারীর পরিচিত মিষ্টি।",
      aliases: ["para sandesh", "pera sandesh", "প্যারা সন্দেশ", "প্যাড়া সন্দেশ"],
    },
  ],
  places: [
    {
      slug: "surjomukhi-boalmari",
      nameBn: "সূর্যমুখী",
      nameEn: "Surjomukhi",
      type: "shop",
      area: "boalmari",
      famousFor: ["para-shondesh"],
    },
  ],
});

export const MUNSHIGANJ_SET = districtSet("munshiganj", {
  areas: [area("haldia-bazar", "হলদিয়া বাজার", "Haldia Bazar")],
  places: [
    {
      slug: "shree-durga-mistanna-bhandar-louhajong",
      nameBn: "শ্রী দুর্গা মিষ্টান্ন ভান্ডার",
      nameEn: "Shree Durga Mistanna Bhandar",
      type: "shop",
      area: "haldia-bazar",
      famousFor: ["roshogolla"],
    },
  ],
});

export const BRAHMANBARIA_SET = districtSet("brahmanbaria", {
  areas: [
    area("mahadev-patti", "মহাদেব পট্টি", "Mahadev Patti"),
    area("aruail-bazar", "অরুয়াইল বাজার", "Aruail Bazar"),
  ],
  foods: [
    {
      slug: "chhanamukhi",
      nameBn: "ছানামুখী",
      nameEn: "Chhanamukhi",
      aboutBn: "ছানা ও চিনির তৈরি ব্রাহ্মণবাড়িয়ার ঐতিহ্যবাহী মিষ্টি।",
      aliases: ["chanamukhi", "chanamukhi misti", "ছানামুখি"],
    },
  ],
  places: [
    {
      slug: "mahadev-mistanna-bhandar-brahmanbaria",
      nameBn: "মহাদেব মিষ্টান্ন ভাণ্ডার",
      nameEn: "Mahadev Mistanna Bhandar",
      type: "shop",
      area: "mahadev-patti",
      famousFor: ["chhanamukhi"],
    },
    {
      slug: "chunilals-roshogolla-sarail",
      nameBn: "চুনিলালের রসগোল্লা",
      nameEn: "Chunilal's Roshogolla",
      type: "shop",
      area: "aruail-bazar",
      famousFor: ["roshogolla"],
    },
  ],
  fame: [
    {
      district: "brahmanbaria",
      food: "chhanamukhi",
      noteBn: "ব্রাহ্মণবাড়িয়ার ছানামুখী",
      sourceUrl: "https://bangla.thedailystar.net/life-living/food-recipe/news-673826",
    },
  ],
});

export const JHALOKATI_SET = districtSet("jhalokati", {
  areas: [
    area("kamarpatti", "কামারপট্টি", "Kamarpatti"),
    area("sadhanar-mor", "সাধনার মোড়", "Sadhanar Mor"),
    area("boro-bazar", "বড় বাজার", "Boro Bazar"),
    area("hoglapatti", "হোগলাপট্টি", "Hoglapatti"),
    area("sadar-chowmatha", "সদর চৌমাথা", "Sadar Chowmatha"),
  ],
  places: [
    {
      slug: "debnath-mistanna-bhandar-jhalokati",
      nameBn: "দেবনাথ মিষ্টান্ন ভান্ডার",
      nameEn: "Debnath Mistanna Bhandar",
      type: "shop",
      area: "kamarpatti",
      famousFor: ["roshogolla", "rasmalai"],
    },
    {
      slug: "nagen-ghosh-sweets-jhalokati",
      nameBn: "নগেন ঘোষের মিষ্টির দোকান",
      nameEn: "Nagen Ghosh's sweet shop",
      type: "shop",
      area: "sadhanar-mor",
      famousFor: ["roshogolla"],
    },
    {
      slug: "gopal-ghosh-roshogolla-jhalokati",
      nameBn: "গোপাল ঘোষের রসগোল্লা",
      nameEn: "Gopal Ghosh's Roshogolla",
      type: "shop",
      area: "boro-bazar",
      famousFor: ["roshogolla"],
    },
    {
      slug: "naren-kuri-roshogolla-jhalokati",
      nameBn: "নরেন কুড়ির রসগোল্লা",
      nameEn: "Naren Kuri's Roshogolla",
      type: "shop",
      area: "hoglapatti",
      famousFor: ["roshogolla"],
    },
    {
      slug: "muslim-mistanna-bhandar-jhalokati",
      nameBn: "মুসলিম মিষ্টান্ন ভান্ডার",
      nameEn: "Muslim Mistanna Bhandar",
      type: "shop",
      area: "sadar-chowmatha",
      famousFor: ["roshogolla"],
    },
  ],
  fame: [
    {
      district: "jhalokati",
      food: "roshogolla",
      noteBn: "ঝালকাঠির রসগোল্লা",
      sourceUrl: "https://www.prothomalo.com/bangladesh/district/v6bazog45s",
    },
  ],
});

export const GAIBANDHA_SET = districtSet("gaibandha", {
  areas: [area("circular-road", "সার্কুলার রোড", "Circular Road")],
  places: [
    {
      slug: "ramesh-sweets-gaibandha",
      nameBn: "রমেশ সুইটস",
      nameEn: "Ramesh Sweets",
      type: "shop",
      area: "circular-road",
      famousFor: ["rasmanjuri"],
    },
  ],
  fame: [
    {
      district: "gaibandha",
      food: "rasmanjuri",
      noteBn: "গাইবান্ধার রসমঞ্জুরি",
      sourceUrl: "https://bangla.thedailystar.net/life-living/food-recipe/news-630421",
    },
  ],
});

export const PIROJPUR_SET = districtSet("pirojpur", {
  areas: [area("press-club-road", "প্রেসক্লাব সড়ক", "Press Club Road")],
  places: [
    {
      slug: "hotel-sotota-pirojpur",
      nameBn: "হোটেল সততা",
      nameEn: "Hotel Sotota",
      type: "restaurant",
      area: "press-club-road",
      famousFor: ["bhorta"],
    },
  ],
});

export const JHENAIDAH_SET = districtSet("jhenaidah", {
  areas: [area("hamdaha-bus-stand", "হামদহ বাস স্ট্যান্ড", "Hamdaha bus stand")],
  foods: [
    {
      slug: "beef-bhuna",
      nameBn: "গরুর ভুনা",
      nameEn: "Beef Bhuna",
      aboutBn: "গরুর মাংস মসলায় কষিয়ে ঘন করে রান্না করা পদ।",
      aliases: ["gorur bhuna", "beef bhuna", "গরু ভুনা", "গরুর মাংস ভুনা"],
    },
  ],
  places: [
    {
      slug: "molla-hotel-jhenaidah",
      nameBn: "মোল্লা হোটেল",
      nameEn: "Molla Hotel",
      type: "restaurant",
      area: "hamdaha-bus-stand",
      famousFor: ["beef-bhuna", "bhorta"],
    },
  ],
});

export const KHAGRACHHARI_SET = districtSet("khagrachhari", {
  areas: [
    area("panakhaiyapara", "পানখাইয়াপাড়া", "Panakhaiyapara"),
    area("mahajanpara", "মহাজনপাড়া", "Mahajanpara"),
  ],
  foods: [
    {
      slug: "pahari-khabar",
      nameBn: "পাহাড়ি খাবার",
      nameEn: "Pahari food",
      aboutBn: "পাহাড়ি মুরগি, বাঁশকোঁড়ল, শুঁটকি ভর্তা, পাচনসহ পার্বত্য অঞ্চলের রান্না।",
      aliases: ["pahari food", "hill food", "pahari khabar", "পাহাড়ি রান্না"],
    },
  ],
  places: [
    {
      slug: "system-restaurant-khagrachhari",
      nameBn: "সিস্টেম রেস্তোরাঁ",
      nameEn: "System Restaurant",
      type: "restaurant",
      area: "panakhaiyapara",
      famousFor: ["pahari-khabar"],
    },
    {
      slug: "bamboo-shoot-khagrachhari",
      nameBn: "ব্যাম্বু শুট",
      nameEn: "Bamboo Shoot",
      type: "restaurant",
      area: "mahajanpara",
      famousFor: ["pahari-khabar"],
    },
    {
      slug: "heritage-dine-khagrachhari",
      nameBn: "হেরিটেজ ডাইন",
      nameEn: "Heritage Dine",
      type: "restaurant",
      area: "panakhaiyapara",
      famousFor: ["pahari-khabar"],
    },
    {
      slug: "kalyani-restaurant-khagrachhari",
      nameBn: "কল্যাণী রেস্তোরাঁ",
      nameEn: "Kalyani Restaurant",
      type: "restaurant",
      area: "mahajanpara",
      famousFor: ["pahari-khabar"],
    },
  ],
});

export const RANGAMATI_SET = districtSet("rangamati", {
  areas: [area("rangamati-town", "রাঙামাটি শহর", "Rangamati town")],
  foods: [
    {
      slug: "bash-korol",
      nameBn: "বাঁশ কোড়ল",
      nameEn: "Bamboo shoot (bash korol)",
      aboutBn: "কচি বাঁশের কোড়ল, ভাজি বা মাংসের সঙ্গে রান্না করা পাহাড়ি পদ।",
      aliases: ["bamboo shoot", "bash korol", "bash koral", "বাঁশকোঁড়ল", "বাঁশ কোরল"],
    },
  ],
  places: [
    {
      slug: "sunzuk-hotel-restaurant-rangamati",
      nameBn: "সুনজুক হোটেল অ্যান্ড রেস্টুরেন্ট",
      nameEn: "Sunzuk Hotel and Restaurant",
      type: "restaurant",
      area: "rangamati-town",
      famousFor: ["bash-korol"],
    },
  ],
});

export const MOULVIBAZAR_SET = districtSet("moulvibazar", {
  areas: [area("sreemangal-sadar", "শ্রীমঙ্গল সদর", "Sreemangal Sadar")],
  places: [
    {
      slug: "kutumbari-restaurant-sreemangal",
      nameBn: "কুটুমবাড়ি রেস্টুরেন্ট",
      nameEn: "Kutumbari Restaurant",
      type: "restaurant",
      area: "sreemangal-sadar",
      famousFor: ["shatkora-beef"],
    },
  ],
});

export const PATUAKHALI_SET = districtSet("patuakhali", {
  areas: [area("kuakata", "কুয়াকাটা", "Kuakata")],
  places: [
    {
      slug: "lebur-char-kuakata",
      nameBn: "লেবুর চর",
      nameEn: "Lebur Char",
      type: "street_food",
      area: "kuakata",
      famousFor: ["spicy-crab"],
    },
  ],
});

export const NATORE_SET = districtSet("natore", {
  areas: [area("lalbazar", "লালবাজার", "Lalbazar")],
  places: [
    {
      slug: "joy-kali-mistanna-bhandar-natore",
      nameBn: "জয় কালী মিষ্টান্ন ভান্ডার",
      nameEn: "Joy Kali Mistanna Bhandar",
      type: "shop",
      area: "lalbazar",
      famousFor: ["kachagolla"],
    },
  ],
  fameSources: [
    {
      district: "natore",
      food: "kachagolla",
      sourceUrl: "https://www.prothomalo.com/bangladesh/cwz6zjpax6",
    },
  ],
});

export const NETROKONA_SET = districtSet("netrokona", {
  areas: [area("barhatta-road", "বারহাট্টা রোড", "Barhatta Road")],
  places: [
    {
      slug: "gayanath-mistanna-bhandar-netrokona",
      nameBn: "গয়ানাথ মিষ্টান্ন ভান্ডার",
      nameEn: "Gayanath Mistanna Bhandar",
      type: "shop",
      area: "barhatta-road",
      famousFor: ["balish-mishti"],
    },
  ],
  fameSources: [
    {
      district: "netrokona",
      food: "balish-mishti",
      sourceUrl:
        "https://www.prothomalo.com/lifestyle/recipe/%E0%A6%AC%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%B6-%E0%A6%AE%E0%A6%BF%E0%A6%B7%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%B0-%E0%A6%87%E0%A6%A4%E0%A6%BF%E0%A6%95%E0%A6%A5%E0%A6%BE",
    },
  ],
});

export const KUSHTIA_SET = districtSet("kushtia", {
  areas: [area("joynabad", "জয়নাবাদ", "Joynabad")],
  places: [
    {
      slug: "bhai-bhai-til-khaja-kushtia",
      nameBn: "নিউ স্পেশাল ভাই ভাই তিলের খাজা",
      nameEn: "New Special Bhai Bhai Tiler Khaja",
      type: "shop",
      area: "joynabad",
      famousFor: ["til-khaja"],
    },
  ],
  fameSources: [
    {
      district: "kushtia",
      food: "til-khaja",
      sourceUrl: "https://bangla.thedailystar.net/news/bangladesh/news-415586",
    },
  ],
});

export const CHATTOGRAM_SET_2 = districtSet("chattogram", {
  suffix: "_2",
  areas: [area("nandan-kanan-mor", "নন্দন কানন মোড়", "Nandan Kanan Mor")],
  places: [
    {
      slug: "bose-brothers-chattogram",
      nameBn: "বোস ব্রাদার্স",
      nameEn: "Bose Brothers",
      type: "shop",
      area: "nandan-kanan-mor",
      famousFor: ["mishti", "singara"],
    },
  ],
});

export const RAJSHAHI_SET_2 = districtSet("rajshahi", {
  suffix: "_2",
  areas: [area("court-chattar", "কোর্ট চত্বর", "Court Chattar")],
  places: [
    {
      slug: "hoba-ghosher-roshogolla-rajshahi",
      nameBn: "হোবা ঘোষের রসগোল্লা",
      nameEn: "Hoba Ghosh's Roshogolla",
      type: "shop",
      area: "court-chattar",
      famousFor: ["roshogolla"],
    },
  ],
});

export const COXS_BAZAR_SET_2 = districtSet("coxs-bazar", {
  suffix: "_2",
  areas: [area("harbang-bazar", "হারবাং বাজার", "Harbang Bazar")],
  places: [
    {
      slug: "pal-misti-bhandar-harbang",
      nameBn: "পাল মিষ্টি ভান্ডার",
      nameEn: "Pal Misti Bhandar",
      type: "shop",
      area: "harbang-bazar",
      famousFor: ["roshogolla"],
    },
  ],
});

export const DISTRICT_SETS_4: DhakaSet[] = [
  JAMALPUR_SET,
  TANGAIL_SET,
  KURIGRAM_SET,
  JASHORE_SET,
  PABNA_SET,
  GOPALGANJ_SET,
  HABIGANJ_SET,
  SATKHIRA_SET,
  SHARIATPUR_SET,
  SIRAJGANJ_SET,
  NAOGAON_SET,
  FENI_SET,
  MADARIPUR_SET,
  MANIKGANJ_SET,
  FARIDPUR_SET,
  MUNSHIGANJ_SET,
  BRAHMANBARIA_SET,
  JHALOKATI_SET,
  GAIBANDHA_SET,
  PIROJPUR_SET,
  JHENAIDAH_SET,
  KHAGRACHHARI_SET,
  RANGAMATI_SET,
  MOULVIBAZAR_SET,
  PATUAKHALI_SET,
  NATORE_SET,
  NETROKONA_SET,
  KUSHTIA_SET,
  CHATTOGRAM_SET_2,
  RAJSHAHI_SET_2,
  COXS_BAZAR_SET_2,
];
