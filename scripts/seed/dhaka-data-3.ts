/**
 * Dhaka content, part 3 (migration 0015): Karwan Bazar and a few more named places from the same
 * sources. Badda and Jatrabari are not here: no article names a shop there, and nothing is invented.
 * Same rules as dhaka-data.ts; sources in docs/content-sources.md.
 */
import type { DhakaSet } from "./dhaka-data";

export const DHAKA_SET_3: DhakaSet = {
  migration: "0015_seed_dhaka_3.sql",
  number: "0015",
  areas: [{ slug: "karwan-bazar", nameBn: "কারওয়ান বাজার", nameEn: "Karwan Bazar" }],
  foods: [],
  places: [
    {
      slug: "star-hotel-karwan-bazar-dhaka",
      nameBn: "স্টার হোটেল (কারওয়ান বাজার)",
      nameEn: "Star Hotel Karwan Bazar",
      district: "dhaka",
      type: "restaurant",
      area: "karwan-bazar",
      famousFor: ["kacchi", "kabab"],
    },
    {
      slug: "rabbani-hotel-dhaka",
      nameBn: "রাব্বানী হোটেল",
      nameEn: "Rabbani Hotel",
      district: "dhaka",
      type: "restaurant",
      area: "mirpur",
      famousFor: ["chaap", "kabab"],
    },
    {
      slug: "hotel-jannat-dhaka",
      nameBn: "হোটেল জান্নাত",
      nameEn: "Hotel Jannat",
      district: "dhaka",
      type: "restaurant",
      area: "mohammadpur",
      famousFor: ["kabab"],
    },
    {
      slug: "mamun-biryani-house-dhaka",
      nameBn: "মামুন বিরিয়ানি হাউস",
      nameEn: "Mamun Biryani House",
      district: "dhaka",
      type: "restaurant",
      area: "nazira-bazar",
      famousFor: ["kacchi"],
    },
  ],
  existingAreas: [],
  existingDishes: [],
  fame: [],
  fameSources: [],
};
