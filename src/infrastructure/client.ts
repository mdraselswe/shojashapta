import { publicEnv } from "@/config/public-env";
import type { AnalyticsProvider, StorageProvider } from "@/core/ports";

import { noopAnalytics } from "./analytics/noop";
import { cloudinaryUrl } from "./cloudinary/url";
import { createMockStorage } from "./mock/storage";

// Browser-safe infrastructure (docs/03-architecture.md §5): secret-free helpers chosen by
// NEXT_PUBLIC_* env only. Never import server adapters or SDKs that need secrets here.

function browserStorage(): Pick<StorageProvider, "url"> {
  switch (publicEnv.storageProvider) {
    case "mock":
      return createMockStorage();
    case "cloudinary":
      return { url: (key, variant) => cloudinaryUrl(publicEnv.cloudinaryCloudName, key, variant) };
    default:
      // Other providers' URL builders arrive with their adapters.
      return {
        url: () => {
          throw new Error(`No browser URL builder for ${publicEnv.storageProvider} yet`);
        },
      };
  }
}

const storage = browserStorage();

/** URL for an image variant — the <AppImage> custom loader (Phase 5.4) is built on this. */
export function imageUrl(key: string, variant: "thumb" | "large"): string {
  return storage.url(key, variant);
}

export const analytics: AnalyticsProvider = noopAnalytics;
