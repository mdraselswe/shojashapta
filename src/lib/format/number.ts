// Bangla number formatting (docs/06-design-system.md §3): Bangla digits, lakh grouping, ৳ prices.

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

const integerFormat = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });

/** Latin digits in any string or number → Bangla digits ("12/64" → "১২/৬৪"). */
export function toBnDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

/** 1234567 → "১২,৩৪,৫৬৭" (South Asian grouping). Rounds to whole numbers unless told otherwise. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return options
    ? new Intl.NumberFormat("bn-BD", options).format(value)
    : integerFormat.format(value);
}

/** 250 → "৳২৫০". */
export function formatTaka(amount: number): string {
  return `৳${formatNumber(amount)}`;
}

/**
 * Price range as shown on dish rows: "৳২৫০–৳৩৮০". One known end shows just that price;
 * no price at all returns null so the caller can hide the field.
 */
export function formatPriceRange(min: number | null, max: number | null): string | null {
  if (min === null || max === null || min === max) {
    const only = min ?? max;
    return only === null ? null : formatTaka(only);
  }
  const [low, high] = min < max ? [min, max] : [max, min];
  return `${formatTaka(low)}–${formatTaka(high)}`;
}

/** 92 → "৯২%". */
export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}
