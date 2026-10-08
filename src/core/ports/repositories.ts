import type {
  Claim,
  ClaimVote,
  District,
  DishWithFood,
  DishWithPlace,
  EditSuggestion,
  EntityType,
  Experience,
  Food,
  MediaRef,
  Page,
  PageOpts,
  Place,
  PlaceType,
  Reaction,
  RegionalFame,
  Report,
  SavedItem,
} from "@/core/domain";

// Data access ports, one per aggregate (docs/03-architecture.md §4). Named by what the app needs,
// not by the database. Adapters: src/infrastructure/{supabase,mock}. Methods grow with each phase.

export interface DistrictRepository {
  list(): Promise<District[]>;
  bySlug(slug: string): Promise<District | null>;
  /** Curated "famous for" list, in editor order. */
  fame(districtId: number): Promise<RegionalFame[]>;
  /** The whole curated list (every district), in editor order — one query for the home page. */
  allFame(): Promise<RegionalFame[]>;
}

export type NewFood = { nameBn: string; nameEn?: string | null };

export interface FoodRepository {
  bySlug(slug: string): Promise<Food | null>;
  byId(id: string): Promise<Food | null>;
  /** Slugs of the `limit` most experienced active foods (static generation, sitemap). */
  slugs(limit: number): Promise<string[]>;
  /** Dishes of this food ranked by Wilson score (decision P10). */
  topDishes(
    foodId: string,
    opts?: PageOpts & { districtId?: number },
  ): Promise<Page<DishWithPlace>>;
  create(input: NewFood & { slug: string }, createdBy: string): Promise<Food>;
}

export type NewPlace = {
  nameBn: string;
  nameEn?: string | null;
  type: PlaceType;
  districtId: number;
  areaId?: number | null;
  /** A neighbourhood typed by the contributor; the adapter finds or creates the area. */
  areaName?: string | null;
  address?: string | null;
  location?: { lat: number; lng: number } | null;
};

export interface PlaceRepository {
  bySlug(slug: string): Promise<Place | null>;
  byId(id: string): Promise<Place | null>;
  /** Slugs of up to `limit` active places (static generation, sitemap). */
  slugs(limit: number): Promise<string[]>;
  inDistrict(districtId: number, opts?: PageOpts): Promise<Page<Place>>;
  /** All dishes of a place, best first ("প্রথমবার? এগুলো অর্ডার করুন"). */
  dishes(placeId: string): Promise<DishWithFood[]>;
  /** Possible duplicates before adding a place (same district, similar name). */
  similar(nameBn: string, districtId: number): Promise<Place[]>;
  create(input: NewPlace & { slug: string }, createdBy: string): Promise<Place>;
}

export interface DishRepository {
  byId(id: string): Promise<DishWithPlace | null>;
  /** The dish for (place, food), created on first experience. */
  findOrCreate(placeId: string, foodId: string): Promise<DishWithPlace>;
}

export type ExperienceInput = {
  dishId: string;
  userId: string;
  reaction: Reaction;
  comment?: string | null;
  pricePaid?: number | null;
  visitedOn?: Date | null;
};

export interface ExperienceRepository {
  byId(id: string): Promise<Experience | null>;
  forDish(dishId: string, opts?: PageOpts): Promise<Page<Experience>>;
  forFood(foodId: string, opts?: PageOpts): Promise<Page<Experience>>;
  byUser(userId: string, opts?: PageOpts): Promise<Page<Experience>>;
  /** One experience per user per dish (decision P6): a second one updates the first. */
  upsert(input: ExperienceInput): Promise<Experience>;
}

export interface ClaimRepository {
  forEntity(entity: Claim["entity"], entityId: string): Promise<Claim[]>;
  byId(id: string): Promise<Claim | null>;
  /** Creates the claim if (entity, entityId, type) has none yet (created empty, `unverified`); else returns the existing one. */
  ensure(input: {
    entity: Claim["entity"];
    entityId: string;
    type: Claim["type"];
    value: Record<string, unknown>;
    createdBy: string;
  }): Promise<Claim>;
  /** Records (or replaces) the user's vote and returns the claim with fresh counts. */
  vote(vote: ClaimVote): Promise<Claim>;
  /** Persists a status/expiry computed by claimService. */
  saveStatus(
    claimId: string,
    update: Pick<Claim, "status" | "lastConfirmedAt" | "expiresAt">,
  ): Promise<void>;
}

export interface EditSuggestionRepository {
  create(input: Omit<EditSuggestion, "id" | "status" | "createdAt">): Promise<EditSuggestion>;
}

export interface ReportRepository {
  create(input: Omit<Report, "id" | "status" | "createdAt">): Promise<Report>;
  /** Reports about this content that no admin has handled yet. */
  openFor(entity: Report["entity"], entityId: string): Promise<Report[]>;
}

export interface SavedRepository {
  list(userId: string, opts?: PageOpts): Promise<Page<SavedItem>>;
  isSaved(userId: string, entity: SavedItem["entity"], entityId: string): Promise<boolean>;
  save(userId: string, entity: SavedItem["entity"], entityId: string): Promise<void>;
  remove(userId: string, entity: SavedItem["entity"], entityId: string): Promise<void>;
}

export interface MediaRepository {
  create(
    input: MediaRef & { ownerId: string; entity: EntityType; entityId: string; provider: string },
  ): Promise<MediaRef>;
  forEntity(entity: EntityType, entityId: string): Promise<MediaRef[]>;
}

export type SearchHit =
  | { kind: "food"; food: Food }
  | { kind: "place"; place: Place }
  | { kind: "district"; district: District };

export interface SearchRepository {
  /** `text` is the cleaned query, `key` its normalized search key (lib/text/normalize, Phase 1.3). */
  search(query: { text: string; key: string }, opts?: PageOpts): Promise<Page<SearchHit>>;
  /** Remember a query with no results so editors can add aliases or content. */
  recordMiss(query: { text: string; key: string }): Promise<void>;
}

export interface RateLimitRepository {
  countSince(userId: string, action: string, since: Date): Promise<number>;
  record(userId: string, action: string): Promise<void>;
}

export interface AdminRepository {
  /** Hides content (status `hidden`) until an admin restores or removes it. */
  hide(entity: Report["entity"], entityId: string): Promise<void>;
  openReports(opts?: PageOpts): Promise<Page<Report>>;
  openEditSuggestions(opts?: PageOpts): Promise<Page<EditSuggestion>>;
}

export type Repositories = {
  districts: DistrictRepository;
  foods: FoodRepository;
  places: PlaceRepository;
  dishes: DishRepository;
  experiences: ExperienceRepository;
  claims: ClaimRepository;
  editSuggestions: EditSuggestionRepository;
  reports: ReportRepository;
  saved: SavedRepository;
  media: MediaRepository;
  search: SearchRepository;
  rateLimits: RateLimitRepository;
  admin: AdminRepository;
};
