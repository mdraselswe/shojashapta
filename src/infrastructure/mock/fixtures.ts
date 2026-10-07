import type {
  AppUser,
  Claim,
  District,
  Dish,
  Experience,
  Food,
  Place,
  RegionalFame,
} from "@/core/domain";
import { wilsonLowerBound } from "@/lib/ranking/wilson";

// Fixture data for DB_PROVIDER=mock (CI, e2e, Lighthouse, /dev pages, offline work). Includes the
// paths the pipeline checks: /food/doi, /place/sample-place, /district/bogura. Sample names are
// placeholders, not real businesses or reviews.

const district = (
  id: number,
  slug: string,
  nameBn: string,
  nameEn: string,
  divisionBn: string,
  divisionEn: string,
  placeCount: number,
): District => ({ id, slug, nameBn, nameEn, divisionBn, divisionEn, placeCount });

export const districts: District[] = [
  district(1, "dhaka", "ঢাকা", "Dhaka", "ঢাকা", "Dhaka", 1),
  district(2, "bogura", "বগুড়া", "Bogura", "রাজশাহী", "Rajshahi", 2),
  district(3, "chattogram", "চট্টগ্রাম", "Chattogram", "চট্টগ্রাম", "Chattogram", 1),
  district(4, "natore", "নাটোর", "Natore", "রাজশাহী", "Rajshahi", 0),
];

const food = (
  id: string,
  slug: string,
  nameBn: string,
  nameEn: string,
  aboutBn: string | null,
): Food => ({
  id,
  slug,
  nameBn,
  nameEn,
  aboutBn,
  cover: null,
  status: "active",
  experienceCount: 0,
  lovedCount: 0,
});

export const foods: Food[] = [
  food("f-doi", "doi", "দই", "Doi", "বগুড়ার মিষ্টি দই সারা দেশে পরিচিত।"),
  food("f-kacchi", "kacchi", "কাচ্চি বিরিয়ানি", "Kacchi Biryani", null),
  food(
    "f-mezbani",
    "mezbani",
    "মেজবানি মাংস",
    "Mezbani Beef",
    "চট্টগ্রামের ঐতিহ্যবাহী ভোজের মাংস।",
  ),
  food("f-kachagolla", "kachagolla", "কাঁচাগোল্লা", "Kachagolla", "নাটোরের বিখ্যাত মিষ্টি।"),
];

export const regionalFame: (Omit<RegionalFame, "food"> & { foodId: string })[] = [
  { districtId: 2, areaId: null, foodId: "f-doi", noteBn: null, sourceUrl: null },
  { districtId: 3, areaId: null, foodId: "f-mezbani", noteBn: null, sourceUrl: null },
  { districtId: 4, areaId: null, foodId: "f-kachagolla", noteBn: null, sourceUrl: null },
];

const placeIn = (d: District): Place["district"] => ({ id: d.id, slug: d.slug, nameBn: d.nameBn });
const [dhaka, bogura, chattogram] = districts as [District, District, District, District];

export const places: Place[] = [
  {
    id: "p-sample",
    slug: "sample-place",
    nameBn: "নমুনা দই ঘর",
    nameEn: "Sample Doi Ghor",
    type: "shop",
    district: placeIn(bogura),
    area: { id: 1, slug: "satmatha", nameBn: "সাতমাথা" },
    address: null,
    location: null,
    openingHours: { sat: [["09:00", "22:00"]], sun: [["09:00", "22:00"]] },
    price: { min: 120, max: 180 },
    status: "active",
    mergedIntoId: null,
  },
  {
    id: "p-second",
    slug: "second-sample-place",
    nameBn: "নমুনা মিষ্টিমুখ",
    nameEn: null,
    type: "shop",
    district: placeIn(bogura),
    area: null,
    address: null,
    location: null,
    openingHours: null,
    price: { min: 100, max: 150 },
    status: "active",
    mergedIntoId: null,
  },
  {
    id: "p-kacchi",
    slug: "sample-kacchi-house",
    nameBn: "নমুনা কাচ্চি ঘর",
    nameEn: null,
    type: "restaurant",
    district: placeIn(dhaka),
    area: null,
    address: null,
    location: null,
    openingHours: null,
    price: { min: 250, max: 380 },
    status: "active",
    mergedIntoId: null,
  },
  {
    id: "p-mezbani",
    slug: "sample-mezbani",
    nameBn: "নমুনা মেজবান",
    nameEn: null,
    type: "restaurant",
    district: placeIn(chattogram),
    area: null,
    address: null,
    location: null,
    openingHours: null,
    price: { min: 300, max: 450 },
    status: "active",
    mergedIntoId: null,
  },
];

const dish = (
  id: string,
  placeId: string,
  foodId: string,
  loved: number,
  okay: number,
  disliked: number,
): Dish => ({
  id,
  placeId,
  foodId,
  displayName: null,
  price: { min: null, max: null },
  priceConfirmedAt: null,
  lovedCount: loved,
  okayCount: okay,
  dislikedCount: disliked,
  experienceCount: loved + okay + disliked,
  wilsonScore: wilsonLowerBound(loved, loved + okay + disliked),
  lastExperienceAt: new Date("2026-10-01T10:00:00Z"),
  status: "active",
});

export const dishes: Dish[] = [
  { ...dish("d-sample-doi", "p-sample", "f-doi", 23, 2, 0), price: { min: 120, max: 180 } },
  dish("d-second-doi", "p-second", "f-doi", 3, 0, 0),
  dish("d-kacchi", "p-kacchi", "f-kacchi", 40, 8, 4),
  dish("d-mezbani", "p-mezbani", "f-mezbani", 12, 3, 1),
];

export const demoUser: AppUser = {
  id: "u-demo",
  displayName: "নমুনা ব্যবহারকারী",
  avatarUrl: null,
  role: "user",
  homeDistrictId: 2,
  isBanned: false,
  pointsTotal: 30,
};

export const experiences: Experience[] = [
  {
    id: "e-1",
    dishId: "d-sample-doi",
    user: { id: demoUser.id, displayName: demoUser.displayName, avatarUrl: null },
    reaction: "loved",
    comment: "টক-মিষ্টি ঠিকঠাক, হাঁড়ির দই।",
    pricePaid: 150,
    visitedOn: new Date("2026-09-28"),
    photos: [],
    status: "active",
    createdAt: new Date("2026-09-28T12:00:00Z"),
  },
];

export const claims: Claim[] = [
  {
    id: "c-price",
    entity: "dish",
    entityId: "d-sample-doi",
    type: "price",
    value: { min: 120, max: 180 },
    status: "confirmed",
    counts: { correct: 5, partial: 1, wrong: 0 },
    lastConfirmedAt: new Date("2026-09-20T00:00:00Z"),
    expiresAt: new Date("2026-10-20T00:00:00Z"),
  },
  {
    id: "c-availability",
    entity: "place",
    entityId: "p-sample",
    type: "availability",
    value: { available: true },
    status: "unverified",
    counts: { correct: 1, partial: 0, wrong: 0 },
    lastConfirmedAt: null,
    expiresAt: null,
  },
];
