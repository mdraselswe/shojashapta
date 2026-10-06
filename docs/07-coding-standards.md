# 07 — Coding Standards (DRY, hooks, utils, helpers)

## 1. Where code goes (decision table)
| Kind of code | Location | Rule |
|---|---|---|
| Pure function, no React, no I/O | `src/lib/<topic>/` | Unit-tested, framework-free |
| React logic reused by 2+ features | `src/hooks/use-*.ts` | Client-only, no fetching vendors directly |
| React logic for one feature | `src/features/<x>/hooks/` | Promote to `src/hooks` on second use |
| Business rule | `src/services/` | Pure TS, depends on ports only |
| Tunable number / threshold | `src/config/app.config.ts` | Never inline magic numbers |
| UI primitive | `src/components/ui/` | No data fetching |
| Feature UI | `src/features/<x>/components/` | Exports component + Skeleton |
| Server data read for a page | `src/features/<x>/queries.ts` | Cached, calls services |
| Mutation | `src/features/<x>/actions.ts` | `'use server'`, uses `defineAction` |
| Input validation | `src/features/<x>/schemas.ts` | Zod, shared by client + server |
| Vendor code | `src/infrastructure/<vendor>/` | Implements ports |

**DRY rule:** before creating anything, search `lib/`, `hooks/`, `components/ui/`, `services/`.
The second time you write similar code, extract it. The third time is a bug.

## 2. Naming
- Files: `kebab-case.ts(x)`. Components: `PascalCase`. Hooks: `useCamelCase`. Constants: `UPPER_SNAKE` only for true constants; config lives in `appConfig`.
- Booleans: `is/has/can/should`. Event handlers: `onX` props, `handleX` internals.
- Server-only modules start with `import 'server-only'`. Client modules with `'use client'`.
- Domain terms in code are English (`food`, `place`, `dish`, `experience`, `claim`); UI text is Bangla via i18n.

## 3. TypeScript
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- No `any`; use `unknown` + zod. Prefer `type` for data, `interface` for ports.
- Domain types in `core/domain`; DB types generated in `infrastructure/supabase/database.types.ts` and
  **mapped** to domain types in repositories (`toFood(row)`), never leaked upward.
- Discriminated unions for states; `assertNever` for exhaustive switches.

## 4. Shared building blocks (create in Phase 0)
### `src/lib`
| Module | Exports |
|---|---|
| `cn.ts` | `cn(...classes)` |
| `result.ts` | `Result<T,E>`, `ok()`, `err()`, `isOk()` |
| `action.ts` | `defineAction(schema, handler, { auth?, rateLimit? })` — validation + auth + limit + Result |
| `text/normalize.ts` | `normalizeBn`, `toSearchKey`, `stripStopWords` |
| `text/slug.ts` | `slugify(nameBn, nameEn?)` → latin slug, uniqueness suffix helper |
| `format/number.ts` | `formatNumber`, `formatTaka`, `formatPriceRange`, `toBnDigits` |
| `format/date.ts` | `timeAgo(date)` → "৫ দিন আগে", `formatDate` |
| `ranking/wilson.ts` | `wilsonLowerBound(pos, n, z)` (mirrors SQL, unit-tested against it) |
| `ranking/percent.ts` | `lovedPercent(loved, total)` |
| `claims/status.ts` | `computeClaimStatus(counts, rules)`, `isStale(claim, now)` |
| `image/compress.ts` | `compressImage(file, variant)` → `{ blob, width, height }` (canvas → WebP) |
| `image/color.ts` | `dominantColor(bitmap)` |
| `url.ts` | `absoluteUrl(path)`, `withSearchParams()` |
| `seo/metadata.ts` | `buildMetadata({ title, description, path, image })` |
| `seo/jsonld.ts` | `foodJsonLd`, `placeJsonLd`, `breadcrumbJsonLd` |
| `env.ts` guard | `isServer`, `isDev` |

### `src/hooks`
| Hook | Purpose |
|---|---|
| `useDebounce(value, ms)` | search input |
| `useDelayedFlag(flag, ms)` | show skeleton only if loading > ms |
| `useMediaQuery(q)` / `useIsMobile()` | responsive behavior |
| `useShare()` | Web Share API + clipboard fallback + toast |
| `useImageCompression()` | wraps `lib/image` with progress state |
| `useInfiniteScroll(ref, onEnd)` | IntersectionObserver |
| `useOptimisticAction(action)` | optimistic + rollback + toast on `Result.err` |
| `useRequireAuth()` | opens LoginGate when action returns `auth_required` |
| `useOnline()` | offline banner |
| `useLocalStorage(key, initial)` | recent searches |
| `useTheme()` | `{ preference, resolved, setPreference }` — theme switching (see design system §2b) |

### `src/components/layout`
`PageShell`, `Section`, `EmptyState`, `ErrorState`, `Header`, `BottomNav`.

## 5. Server actions
```ts
// features/experience/actions.ts
'use server';
export const addExperience = defineAction(
  addExperienceSchema,
  async (input, { user, services }) => services.experience.add(user.id, input),
  { auth: true, rateLimit: 'experience' },
);
```
- Always return `Result`. Map domain errors to i18n keys (`errors.rate_limited`).
- Never trust client IDs for ownership; derive `user.id` from the session.
- After success, the service invalidates cache tags; actions don't call `revalidatePath` ad hoc.

## 6. Components
- Server Components by default; `'use client'` leaf components only (buttons, pickers, forms, search box).
- Props: small and typed; pass IDs or domain objects, not raw DB rows.
- No fetching inside client components except via TanStack Query hooks in `features/<x>/hooks`.
- Every data component exports its Skeleton (see `05-loading-skeletons.md`).
- No inline styles except dynamic values (aspect ratio, dominant color).

## 7. i18n
- `src/i18n/messages/bn.json` (source of truth) and `en.json`. Keys by feature: `food.favorites`, `errors.auth_required`.
- Server: `const t = await getT()`; Client: `const t = useT()`. Simple interpolation `{count}`; plural helper for English only.
- No user-facing literal strings in components (ESLint `no-literal-string` style rule for JSX text, or code review).
- MVP ships Bangla only; English toggle is V1.5 (structure ready now).

## 8. Errors & logging
- Expected → `Result.err(code)`. Unexpected → throw, caught by `error.tsx`, reported via `ErrorReporter`.
- No `console.log` in committed code (ESLint `no-console` except `warn`/`error` in infrastructure).

## 9. Testing
| Layer | Tool | Must cover |
|---|---|---|
| `lib/text` | Vitest | Banglish/Bangla normalization table (≥ 50 cases) |
| `lib/ranking`, `lib/claims` | Vitest | Wilson values, claim status transitions, staleness |
| `services/*` | Vitest with fake repositories | business rules, limits, error paths |
| Pages | Playwright | home → search → food → place; add flow; verify flow; CLS during load |
| A11y | Playwright + axe | each MVP page |
Coverage target: `lib` + `services` ≥ 80%.

## 10. Git
- Branches: `feat/…`, `fix/…`, `chore/…`. Conventional commits (`feat(search): banglish keys`).
- Small PRs, one feature each. CI: typecheck, lint, test, build, Lighthouse.
- Never commit `.env*` (except `.env.example`).

## 11. Performance habits
- No barrel files that pull client code into server bundles (import from the file directly).
- Dynamic import (`next/dynamic`) for heavy client-only widgets (image viewer, admin tables).
- `select` only needed columns in repositories; paginate everything.
- Memoize only when profiling shows a need.
