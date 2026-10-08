import type { MediaVariant } from "@/core/domain";

// Delivery URLs (browser-safe, no secrets). Only the large WebP is stored; the thumbnail is the
// same file scaled by Cloudinary on first request and cached on its CDN (decision T5).

const TRANSFORM: Record<MediaVariant, string> = {
  thumb: "c_limit,w_400,f_webp,q_auto",
  large: "c_limit,w_1080,f_webp,q_auto",
};

export function cloudinaryUrl(cloudName: string, key: string, variant: MediaVariant): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${TRANSFORM[variant]}/${key}`;
}
