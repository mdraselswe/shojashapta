"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { MediaRef } from "@/core/domain";
import { useT } from "@/i18n/client";
import { formatNumber } from "@/lib/format/number";

import { AppImage } from "./app-image";

/** Large view of one photo with previous / next; Escape or the close button leaves. */
export function PhotoViewer({
  photos,
  start,
  onClose,
}: {
  photos: MediaRef[];
  start: number;
  onClose: () => void;
}) {
  const t = useT();
  const [index, setIndex] = useState(start);
  const photo = photos[index];
  if (!photo) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">{t("photos.title")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("photos.position", { n: formatNumber(index + 1), total: formatNumber(photos.length) })}
        </DialogDescription>
        <AppImage
          media={photo}
          alt=""
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="max-h-[70dvh] w-full rounded-card object-contain"
        />
        {photos.length > 1 && (
          <div className="flex justify-between">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
              aria-label={t("photos.previous")}
              className="flex size-11 press items-center justify-center rounded-full border border-border disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              disabled={index === photos.length - 1}
              onClick={() => setIndex(index + 1)}
              aria-label={t("photos.next")}
              className="flex size-11 press items-center justify-center rounded-full border border-border disabled:opacity-40"
            >
              <ChevronRightIcon className="size-5" aria-hidden />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
