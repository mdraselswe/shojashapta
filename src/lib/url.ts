import { siteConfig } from "@/config/site";

type QueryValue = string | number | boolean | null | undefined;

/** Adds query parameters, skipping empty ones: ("/search", { q: "দই", page: 2 }) → "/search?q=…&page=2". */
export function withSearchParams(path: string, params: Record<string, QueryValue>): string {
  const [base = "", existing = ""] = path.split("?");
  const search = new URLSearchParams(existing);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") search.delete(key);
    else search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${base}?${query}` : base;
}

/** Canonical absolute URL for a path ("/food/doi" → "https://shojashapta.com/food/doi"). */
export function absoluteUrl(path: string = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
