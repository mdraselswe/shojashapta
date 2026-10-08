import type { StorageProvider } from "@/core/ports";

/**
 * NEXT_PUBLIC_STORAGE_PROVIDER=mock: uploads are accepted by /api/mock-upload and not kept, and every
 * uploaded key shows the same placeholder picture. Browser-safe (no secrets) so infrastructure/client.ts can
 * use `url` for the image loader.
 */
export function createMockStorage(): StorageProvider {
  return {
    async createUploadTicket({ userId }) {
      const key = `mock-uploads/${userId}/${Date.now().toString(36)}`;
      return {
        uploadUrl: "/api/mock-upload",
        fields: {},
        key,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
    },
    async confirmUpload({ key }) {
      return { id: `m-${key}`, key, width: 1080, height: 810, dominantColor: "#e8d9c0" };
    },
    async delete() {},
    url(key, variant) {
      void variant;
      // Paths of files that ship with the app stay as they are; everything else is the placeholder.
      return key.startsWith("/") ? key : "/mock-photo.svg";
    },
  };
}
