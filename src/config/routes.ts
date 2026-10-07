/**
 * Typed route builders — link with these, never with string literals (docs/03-architecture.md §9).
 */

const segment = (value: string) => encodeURIComponent(value);

function withQuery(path: string, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, value);
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export const routes = {
  home: () => "/",
  search: (query?: { q?: string }) => withQuery("/search", { q: query?.q }),
  food: (slug: string) => `/food/${segment(slug)}`,
  place: (slug: string) => `/place/${segment(slug)}`,
  district: (slug: string) => `/district/${segment(slug)}`,
  districtFood: (districtSlug: string, foodSlug: string) =>
    `/district/${segment(districtSlug)}/${segment(foodSlug)}`,
  add: () => "/add",
  me: () => "/me",
  admin: () => "/admin",
  policy: () => "/policy",
  about: () => "/about",
  comingSoon: () => "/coming-soon",
  authCallback: () => "/auth/callback",
  dev: {
    skeletons: () => "/dev/skeletons",
    themes: () => "/dev/themes",
  },
  api: {
    health: () => "/api/health",
    search: (query: { q: string }) => withQuery("/api/search", { q: query.q }),
  },
} as const;
