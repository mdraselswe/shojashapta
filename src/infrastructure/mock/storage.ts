import type { StorageProvider } from "@/core/ports";

/**
 * NEXT_PUBLIC_STORAGE_PROVIDER=mock: keys are paths under /public, uploads are accepted but not kept.
 * Browser-safe (no secrets) so infrastructure/client.ts can use `url` for the image loader.
 */
export function createMockStorage(): StorageProvider {
  return {
    async createUploadTicket({ userId }) {
      const key = `mock-uploads/${userId}/${Date.now().toString(36)}`;
      return {
        uploadUrl: "about:blank",
        fields: {},
        key,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
    },
    async confirmUpload({ key }) {
      return { id: `m-${key}`, key, width: 1080, height: 810, dominantColor: null };
    },
    async delete() {},
    url(key, variant) {
      void variant; // fixtures ship one size
      return key.startsWith("/") ? key : `/${key}`;
    },
  };
}
