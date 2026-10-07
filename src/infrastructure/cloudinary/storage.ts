import type { StorageProvider } from "@/core/ports";

// Cloudinary StorageProvider (NEXT_PUBLIC_STORAGE_PROVIDER=cloudinary). Empty until Phase 5.2.

export function createCloudinaryStorage(): StorageProvider {
  throw new Error(
    "Cloudinary storage is implemented in Phase 5.2; use the mock provider until then.",
  );
}
