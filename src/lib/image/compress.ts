import { appConfig } from "@/config/app.config";

// Browser-side image preparation (decision T5): a phone photo is shrunk to a WebP before upload, so
// the original never leaves the device and the stored file stays small (roughly 100-150 KB).

export type ImageLimits = {
  maxBytes: number;
  allowedTypes: readonly string[];
};

export const IMAGE_LIMITS: ImageLimits = {
  maxBytes: appConfig.media.maxUploadBytes,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

export type PickProblem = "not_image" | "too_big";

/** Why a picked file cannot be used, or null when it can. */
export function checkPickedFile(
  file: { type: string; size: number },
  limits: ImageLimits = IMAGE_LIMITS,
): PickProblem | null {
  if (!limits.allowedTypes.includes(file.type.toLowerCase())) return "not_image";
  if (file.size > limits.maxBytes) return "too_big";
  return null;
}

/** Size after shrinking to at most `maxWidth` wide (never enlarged), keeping the aspect ratio. */
export function fitWithin(
  width: number,
  height: number,
  maxWidth: number,
): { width: number; height: number } {
  if (width <= maxWidth) return { width, height };
  const scale = maxWidth / width;
  return { width: maxWidth, height: Math.max(1, Math.round(height * scale)) };
}

export type CompressedImage = { blob: Blob; width: number; height: number };

/**
 * Decodes the file, scales it to the large variant and encodes WebP. Runs in the browser only
 * (canvas); EXIF rotation is applied by `createImageBitmap`, and no metadata (GPS) is kept.
 */
export async function compressToWebp(file: Blob): Promise<CompressedImage> {
  const { width: maxWidth, quality } = appConfig.media.variants.large;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const size = fitWithin(bitmap.width, bitmap.height, maxWidth);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available");
    context.drawImage(bitmap, 0, 0, size.width, size.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob) throw new Error("This browser cannot encode WebP");
    return { blob, width: size.width, height: size.height };
  } finally {
    bitmap.close();
  }
}
