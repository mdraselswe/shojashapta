/**
 * The ❤️ % shown on dishes (decision P10: display %, sort by Wilson). Whole percent; null when there
 * are no experiences yet, so the UI shows "এখনও পর্যাপ্ত অভিজ্ঞতা নেই" instead of 0%.
 */
export function lovedPercent(loved: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((Math.min(loved, total) / total) * 100);
}
