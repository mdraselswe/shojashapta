"use client";

import Image, { type ImageLoaderProps } from "next/image";

import type { MediaRef } from "@/core/domain";
import { imageUrl } from "@/infrastructure/client";
import { cn } from "@/lib/cn";

// Our own loader: images come from the image host's CDN already compressed, so nothing goes through
// Vercel image optimization (docs/02-tech-stack.md §8). Small slots get the thumbnail variant.
const loader = ({ src, width }: ImageLoaderProps) =>
  imageUrl(src, width <= 480 ? "thumb" : "large");

/** A stored photo: reserves its aspect ratio and shows its dominant colour until it decodes. */
export function AppImage({
  media,
  alt,
  sizes,
  className,
  priority = false,
}: {
  media: Pick<MediaRef, "key" | "width" | "height" | "dominantColor">;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      loader={loader}
      src={media.key}
      width={media.width}
      height={media.height}
      alt={alt}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      style={{ backgroundColor: media.dominantColor ?? undefined }}
      className={cn("object-cover", className)}
    />
  );
}
