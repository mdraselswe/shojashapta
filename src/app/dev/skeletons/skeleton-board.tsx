"use client";

import { useState, type ReactNode } from "react";

import { Toggle } from "@/components/ui/toggle";

export type SkeletonPair = { name: string; real: ReactNode; skeleton: ReactNode };

/**
 * Every component next to its skeleton, or stacked at 50% opacity ("overlay") so any size or
 * position mismatch is obvious (docs/05-loading-skeletons.md §9). e2e/skeletons.spec.ts compares
 * the boxes automatically via the data-pair attributes.
 */
export function SkeletonBoard({ pairs }: { pairs: readonly SkeletonPair[] }) {
  const [overlay, setOverlay] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <Toggle pressed={overlay} onPressedChange={setOverlay} className="self-start">
        Overlay 50%
      </Toggle>
      {pairs.map(({ name, real, skeleton }) => (
        <section key={name} className="flex flex-col gap-2">
          <h2 className="text-card-title">{name}</h2>
          {overlay ? (
            <div className="relative">
              <div data-pair={name} data-kind="real">
                {real}
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-50">{skeleton}</div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div data-pair={name} data-kind="real">
                {real}
              </div>
              <div data-pair={name} data-kind="skeleton">
                {skeleton}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
