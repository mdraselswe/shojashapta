// Dependency-free on purpose: client components (BottomNav via routes.ts) import this, and anything
// that reaches config/env would ship zod to the browser.

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
