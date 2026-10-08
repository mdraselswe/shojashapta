import "server-only";

import { serverEnv } from "@/config/env";
import type {
  AnalyticsProvider,
  AuthProvider,
  CacheInvalidator,
  ErrorReporter,
  RateLimiter,
  Repositories,
  StorageProvider,
} from "@/core/ports";
import { createCatalogService, type CatalogService } from "@/services/catalog-service";
import { createExperienceService, type ExperienceService } from "@/services/experience-service";
import { createSearchService, type SearchService } from "@/services/search-service";
import { createDefineAction } from "@/lib/action";

import { noopAnalytics } from "./analytics/noop";
import { createCloudinaryStorage } from "./cloudinary/storage";
import { consoleErrorReporter } from "./errors/console";
import { createMockAuth } from "./mock/auth";
import { createMockRepositories } from "./mock/repositories";
import { createMockStorage } from "./mock/storage";
import { nextCacheInvalidator } from "./next/cache-invalidator";
import { createRateLimiter } from "./shared/rate-limiter";
import { createSupabaseAuth, createSupabaseRepositories } from "./supabase";

/** Renews an expiring Supabase session; called from proxy.ts (Server Components cannot write cookies). */
export { refreshSupabaseSession as refreshAuthSession } from "./supabase/proxy-session";

// Wires every port to an adapter chosen by env (docs/03-architecture.md §5). The only module the
// app imports from infrastructure on the server. Services join here as they are built (Phase 1+).

function assertNever(value: never): never {
  throw new Error(`Unhandled provider: ${String(value)}`);
}

export type Services = {
  repos: Repositories;
  catalog: CatalogService;
  search: SearchService;
  experience: ExperienceService;
  auth: AuthProvider;
  storage: StorageProvider;
  cache: CacheInvalidator;
  analytics: AnalyticsProvider;
  errors: ErrorReporter;
  rateLimiter: RateLimiter;
};

let services: Services | undefined;

/** Adapters are created once per server process (the mock store must survive between requests). */
export function getServices(): Services {
  if (services) return services;
  const env = serverEnv();

  const repos =
    env.DB_PROVIDER === "mock"
      ? createMockRepositories()
      : env.DB_PROVIDER === "supabase"
        ? createSupabaseRepositories()
        : assertNever(env.DB_PROVIDER);

  const auth =
    env.AUTH_PROVIDER === "mock"
      ? createMockAuth()
      : env.AUTH_PROVIDER === "supabase"
        ? createSupabaseAuth()
        : assertNever(env.AUTH_PROVIDER);

  const storageProvider = env.NEXT_PUBLIC_STORAGE_PROVIDER;
  const storage =
    storageProvider === "mock"
      ? createMockStorage()
      : storageProvider === "cloudinary" ||
          storageProvider === "imagekit" ||
          storageProvider === "supabase"
        ? createCloudinaryStorage() // only Cloudinary is planned (decision T5); others fail loudly
        : assertNever(storageProvider);

  const analytics =
    env.ANALYTICS_PROVIDER === "noop" || env.ANALYTICS_PROVIDER === "vercel"
      ? noopAnalytics // Vercel analytics adapter arrives when it is enabled
      : assertNever(env.ANALYTICS_PROVIDER);

  services = {
    repos,
    catalog: createCatalogService({ repos }),
    search: createSearchService({ repos }),
    experience: createExperienceService({ repos, cache: nextCacheInvalidator }),
    auth,
    storage,
    cache: nextCacheInvalidator,
    analytics,
    errors: consoleErrorReporter,
    rateLimiter: createRateLimiter(repos.rateLimits),
  };
  return services;
}

/** Server action wrapper wired to this container: validation → auth → rate limit → Result. */
export const defineAction = createDefineAction({
  auth: () => getServices().auth,
  rateLimiter: () => getServices().rateLimiter,
  errors: () => getServices().errors,
  services: getServices,
});
