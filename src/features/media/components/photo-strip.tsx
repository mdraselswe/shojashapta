"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { MediaRef } from "@/core/domain";
import { useT } from "@/i18n/client";
import { formatNumber } from "@/lib/format/number";

import { AppImage } from "./app-image";

// The full-size viewer is only needed after a tap, so its code loads then (docs/08 budgets).
const PhotoViewer = dynamic(() => import("./photo-viewer").then((mod) => mod.PhotoViewer), {
  ssr: false,
});

/** Row of square thumbnails; a tap opens the viewer on that photo. */
export function PhotoStrip({
  photos,
  label,
  size = 88,
}: {
  photos: MediaRef[];
  label: string;
  size?: number;
}) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;
  return (
    <>
      <ul className="flex [scrollbar-width:none] gap-2 overflow-x-auto" aria-label={label}>
        {photos.map((photo, index) => (
          <li key={photo.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={t("photos.open", { n: formatNumber(index + 1) })}
              className="block press overflow-hidden rounded-thumb"
              style={{ width: size, height: size }}
            >
              <AppImage media={photo} alt="" sizes={`${size}px`} className="size-full" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <PhotoViewer photos={photos} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
