// Food passport and points (docs/01-product-spec.md §3.11b): a score and a stamp book, never spent.

export type PointKind =
  "experience" | "place_create" | "discoverer" | "claim_vote" | "edit_accepted";

/** What the points were for; revoking an entity takes back everything awarded for it. */
export type RewardEntity = "experience" | "place" | "claim" | "edit_suggestion";

export type StampKind = "visit" | "discoverer";

export type Stamp = {
  districtId: number;
  kind: StampKind;
  /** The food that earned it ("আবিষ্কারক" stamps), if any. */
  foodId: string | null;
  createdAt: Date;
};
