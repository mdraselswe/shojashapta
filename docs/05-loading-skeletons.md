# 05 — Loading Skeleton System

**Goal:** every page first shows a skeleton that looks exactly like the final page, then real data
replaces it in place — no jump, no spinner, no blank screen. Target CLS = 0.

## 1. Rules
1. Every route segment has `loading.tsx` → renders `<XPageSkeleton />`.
2. Every component that renders fetched data has a sibling skeleton in the **same file**:
   `FoodCard` + `FoodCardSkeleton`. Same outer element, same padding, same grid, same image aspect ratio.
3. Inside pages, each independent data section is wrapped in `<Suspense fallback={<SectionSkeleton/>}>`
   so fast sections appear first (streaming).
4. Page skeleton = composition of section skeletons (DRY). `loading.tsx` and Suspense fallbacks use the same pieces.
5. Static parts (header, page title when known from URL, tabs, bottom nav) render for real, never as skeleton.
6. Skeleton list length = `appConfig.pagination.default` (or the visible count for that section).
7. Client-side loading (search suggestions, infinite scroll, tab switch) uses the same skeleton components.
8. Spinners only inside buttons during submit. Optimistic UI for reactions/saves (instant feedback).

## 2. Primitives (`src/components/ui/skeleton.tsx`)
```tsx
// Base block: shimmer, hidden from screen readers, respects reduced motion
export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div aria-hidden className={cn('rounded-md bg-skeleton skeleton-shimmer', className)} {...props} />;
}

// Text lines sized by line-height so they match real text exactly (Bangla needs taller lines)
export function SkeletonText({ lines = 1, className, lastWidth = '60%' }: { lines?: number; className?: string; lastWidth?: string }) {
  return (
    <div aria-hidden className={cn('flex flex-col', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="flex h-[1lh] items-center">
          <Skeleton className="h-[0.7em] w-full" style={i === lines - 1 && lines > 1 ? { width: lastWidth } : undefined} />
        </span>
      ))}
    </div>
  );
}

export function SkeletonImage({ ratio = '4/3', className }: { ratio?: string; className?: string }) {
  return <Skeleton className={cn('w-full', className)} style={{ aspectRatio: ratio }} />;
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton className="rounded-full" style={{ width: size, height: size }} />;
}

// Accessible wrapper for a whole loading region
export function LoadingRegion({ label, children }: { label: string; children: React.ReactNode }) {
  return <div role="status" aria-busy="true" aria-label={label}>{children}</div>;
}
```
`SkeletonText` inherits the parent's `font-size` and `line-height`, so putting it inside the same
typography class as the real text guarantees identical height.

CSS (in `globals.css`):
```css
@keyframes shimmer { 100% { transform: translateX(100%); } }
.skeleton-shimmer { position: relative; overflow: hidden; }
.skeleton-shimmer::after {
  content: ''; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, var(--skeleton-highlight), transparent);
  animation: shimmer 1.4s infinite;
}
@media (prefers-reduced-motion: reduce) { .skeleton-shimmer::after { animation: none; } }
```

## 3. Pattern: component + skeleton share a layout shell
```tsx
// features/dish/components/dish-card.tsx
function DishCardShell({ media, children }: { media: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="grid grid-cols-[96px_1fr] gap-3 rounded-xl border bg-card p-3">
      <div className="aspect-square overflow-hidden rounded-lg">{media}</div>
      <div className="min-w-0 space-y-1">{children}</div>
    </article>
  );
}

export function DishCard({ dish }: { dish: DishWithPlace }) {
  return (
    <DishCardShell media={<AppImage media={dish.cover} variant="thumb" ratio="1/1" />}>
      <h3 className="text-title line-clamp-1">{dish.place.name}</h3>
      <p className="text-meta line-clamp-1">{dish.place.areaName}</p>
      <LikeMeter loved={dish.lovedCount} total={dish.experienceCount} />
    </DishCardShell>
  );
}

export function DishCardSkeleton() {
  return (
    <DishCardShell media={<SkeletonImage ratio="1/1" />}>
      <SkeletonText className="text-title" />
      <SkeletonText className="text-meta" lastWidth="40%" />
      <LikeMeterSkeleton />
    </DishCardShell>
  );
}
```
The shell guarantees identical structure. Text skeletons use the same typography classes.
Use `line-clamp` on real text so long names never change height.

## 4. Pattern: list + section
```tsx
export function DishListSkeleton({ count = appConfig.pagination.default }: { count?: number }) {
  return <div className="space-y-3">{Array.from({ length: count }, (_, i) => <DishCardSkeleton key={i} />)}</div>;
}

// features/food/components/food-favorites-section.tsx (Server Component)
export async function FoodFavoritesSection({ foodId }: { foodId: string }) {
  const page = await getFoodTopDishes(foodId);
  return <Section title={t('food.favorites')}><DishList items={page.items} /></Section>;
}
export function FoodFavoritesSectionSkeleton() {
  return <Section title={t('food.favorites')}><DishListSkeleton count={5} /></Section>;
}
```

## 5. Pattern: page
```tsx
// app/(site)/food/[slug]/page.tsx
export default async function FoodPage({ params }: PageProps<'/food/[slug]'>) {
  const { slug } = await params;
  const food = await getFoodBySlug(slug);            // fast, cached: header data
  if (!food) notFound();
  return (
    <PageShell>
      <FoodHeader food={food} />
      <Suspense fallback={<FoodFavoritesSectionSkeleton />}><FoodFavoritesSection foodId={food.id} /></Suspense>
      <Suspense fallback={<PhotoStripSkeleton />}><FoodPhotos foodId={food.id} /></Suspense>
      <Suspense fallback={<ExperienceListSkeleton count={3} />}><FoodExperiences foodId={food.id} /></Suspense>
    </PageShell>
  );
}

// app/(site)/food/[slug]/loading.tsx
export default function Loading() { return <FoodPageSkeleton />; }

// features/food/components/food-page-skeleton.tsx
export function FoodPageSkeleton() {
  return (
    <LoadingRegion label={t('common.loading')}>
      <PageShell>
        <FoodHeaderSkeleton />
        <FoodFavoritesSectionSkeleton />
        <PhotoStripSkeleton />
        <ExperienceListSkeleton count={3} />
      </PageShell>
    </LoadingRegion>
  );
}
```

## 6. Images inside loaded content
- Always reserve space: width/height or `aspect-ratio`.
- Background = `media.dominantColor` until the image decodes, then fade in (CSS `opacity` transition only, no layout change).
- LCP image of a page: `priority` + `fetchPriority="high"`; everything else lazy.

## 7. Client-side loading
- Search suggestions: show `SuggestionListSkeleton` only if the request takes > 150 ms (avoid flicker):
  `const showSkeleton = useDelayedFlag(isFetching, 150)` (in `src/hooks`).
- Infinite scroll appends `DishCardSkeleton × 3` at the bottom while fetching the next page.
- Tab switches inside a page use `useTransition`; keep old content visible with reduced opacity rather than skeleton when data is already on screen.

## 8. Required skeleton inventory (MVP)
| Page | Page skeleton | Section skeletons |
|---|---|---|
| Home | `HomePageSkeleton` | `FavoritesRowSkeleton`, `DistrictGridSkeleton`, `RecentListSkeleton` |
| Search | `SearchPageSkeleton` | `SearchResultListSkeleton`, `SuggestionListSkeleton` |
| Food | `FoodPageSkeleton` | `FoodHeaderSkeleton`, `FoodFavoritesSectionSkeleton`, `PhotoStripSkeleton`, `ExperienceListSkeleton` |
| Place | `PlacePageSkeleton` | `PlaceHeaderSkeleton`, `OrderTheseSkeleton`, `DishListSkeleton`, `PlaceInfoSkeleton`, `ClaimBadgesSkeleton` |
| District | `DistrictPageSkeleton` | `FameListSkeleton`, `PlaceListSkeleton` |
| District × Food | `DistrictFoodPageSkeleton` | reuse above |
| Add | `AddFlowSkeleton` | step skeleton |
| Me | `ProfilePageSkeleton` | `ProfileHeaderSkeleton`, tab list skeletons |
| Admin | `AdminQueueSkeleton` | `AdminRowSkeleton` |

## 9. Verification
- `/dev/skeletons` (dev only, 404 in production): renders every component next to its skeleton using
  fixture data, plus a toggle to overlay them at 50% opacity — mismatches are obvious.
- Playwright test per page: throttle network, capture layout shift entries while the page streams; assert CLS < 0.01.
- Manual: Chrome DevTools → Network "Slow 4G" → reload each page.
