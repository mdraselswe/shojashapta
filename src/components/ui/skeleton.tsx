import type * as React from "react";

import { cn } from "@/lib/cn";

// Skeleton primitives (docs/05-loading-skeletons.md §2). A skeleton must match the real component's
// layout exactly: build both from one shared shell and reuse the same typography classes.

/** Base block: themed fill + shimmer, hidden from screen readers (the LoadingRegion announces). */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-md bg-skeleton", className)}
      {...props}
    />
  );
}

/**
 * Text lines sized by the parent's line-height (`1lh`), so a skeleton inside the same typography
 * class as the real text has exactly its height — important for tall Bangla lines.
 */
export function SkeletonText({
  lines = 1,
  className,
  lastWidth = "60%",
}: {
  lines?: number;
  className?: string;
  /** Width of the last line when there are several (ragged paragraph end). */
  lastWidth?: string;
}) {
  return (
    <div aria-hidden className={cn("flex flex-col", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <span key={index} className="flex h-[1lh] items-center">
          <Skeleton
            className="h-[0.7em] w-full"
            style={index === lines - 1 && lines > 1 ? { width: lastWidth } : undefined}
          />
        </span>
      ))}
    </div>
  );
}

/** Image placeholder that reserves the final aspect ratio. */
export function SkeletonImage({
  ratio = "4/3",
  className,
}: {
  ratio?: string;
  className?: string;
}) {
  return <Skeleton className={cn("w-full", className)} style={{ aspectRatio: ratio }} />;
}

/** Round avatar placeholder of a fixed size in px. */
export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton
      className={cn("shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Accessible wrapper for a whole loading region: announced once as busy, children stay silent. */
export function LoadingRegion({
  label,
  children,
  className,
}: {
  /** What is loading, e.g. "লোড হচ্ছে…" (from i18n). */
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  );
}
