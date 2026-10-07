/**
 * External map link. No coordinates are stored in the MVP, so the map app searches by the place's
 * name and area (Google Maps' documented "search" URL).
 */
export function mapSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
