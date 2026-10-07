// Shared domain vocabulary (docs/04-database.md §2). Repositories map DB rows to these types;
// DB types never leave src/infrastructure.

export type ContentStatus = "active" | "pending" | "hidden" | "closed" | "merged";

export type EntityType =
  "food" | "place" | "dish" | "district" | "experience" | "claim" | "media" | "profile";

/** One page of a list. `nextCursor` is opaque; null means there is no next page. */
export type Page<T> = { items: T[]; nextCursor: string | null };

export type PageOpts = { limit?: number; cursor?: string | null };

/** Taka range; either end may be unknown. */
export type PriceRange = { min: number | null; max: number | null };
