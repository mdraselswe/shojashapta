import { STORAGE_PROVIDERS, type StorageProviderId } from "./providers";

/**
 * NEXT_PUBLIC_* values for browser code, without zod (keeps it out of client bundles).
 * The same variables are fully validated at build time by config/env.ts via next.config.ts.
 */
function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.find((option) => option === value) ?? fallback;
}

export const publicEnv = {
  storageProvider: oneOf<StorageProviderId>(
    process.env.NEXT_PUBLIC_STORAGE_PROVIDER,
    STORAGE_PROVIDERS,
    "mock",
  ),
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  launched: process.env.NEXT_PUBLIC_LAUNCHED === "true",
  defaultLocale: oneOf<"bn" | "en">(process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ["bn", "en"], "bn"),
} as const;
