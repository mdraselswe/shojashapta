// Pure rules for the food passport (docs/01-product-spec.md §3.11b): how a stamp looks, how far
// each division has come, and which stamp to suggest next.

export type StampInkIndex = 1 | 2 | 3 | 4;

/** Ink colour (--stamp-1..4) fixed per district, so a district always looks the same. */
export function stampInk(districtId: number): StampInkIndex {
  return (((Math.abs(districtId) * 3) % 4) + 1) as StampInkIndex;
}

/** Tilt in degrees (-8 to 8), fixed per district, like a stamp pressed by hand. */
export function stampRotation(districtId: number): number {
  return ((districtId * 37) % 17) - 8;
}

export type DivisionProgress = { name: string; unlocked: number; total: number };

/** Unlocked and total districts per division, in the order the divisions first appear. */
export function divisionProgress(
  districts: { id: number; divisionBn: string }[],
  unlocked: ReadonlySet<number>,
): DivisionProgress[] {
  const byDivision = new Map<string, DivisionProgress>();
  for (const district of districts) {
    const entry = byDivision.get(district.divisionBn) ?? {
      name: district.divisionBn,
      unlocked: 0,
      total: 0,
    };
    entry.total += 1;
    if (unlocked.has(district.id)) entry.unlocked += 1;
    byDivision.set(district.divisionBn, entry);
  }
  return [...byDivision.values()];
}

export type NextStamp = {
  district: { slug: string; nameBn: string };
  food: { slug: string; nameBn: string };
};

/**
 * "পরের স্ট্যাম্প": the first curated famous food (editor order) of a district the person has not
 * unlocked yet.
 */
export function nextStampSuggestion(
  fame: { districtId: number; food: { slug: string; nameBn: string } }[],
  districts: { id: number; slug: string; nameBn: string }[],
  unlocked: ReadonlySet<number>,
): NextStamp | null {
  for (const entry of fame) {
    if (unlocked.has(entry.districtId)) continue;
    const district = districts.find((candidate) => candidate.id === entry.districtId);
    if (district) {
      return {
        district: { slug: district.slug, nameBn: district.nameBn },
        food: entry.food,
      };
    }
  }
  return null;
}
