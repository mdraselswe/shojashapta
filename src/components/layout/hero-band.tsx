import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const TONE = {
  home: "bg-grad-hero",
  food: "bg-grad-food",
  place: "bg-grad-place",
  district: "bg-grad-district",
} as const;

export type HeroTone = keyof typeof TONE;

type HeroBandProps = {
  tone: HeroTone;
  children: ReactNode;
  className?: string;
};

/**
 * The gradient banner at the top of home, food, place and district pages (docs/06-design-system.md
 * §2c). White text on the gradient passes AA in every theme; decoration is two soft circles.
 */
export function HeroBand({ tone, children, className }: HeroBandProps) {
  return (
    <section className="page-x pt-1 lg:pt-5">
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] p-5 text-on-hero lg:rounded-[40px] lg:p-12",
          TONE[tone],
          className,
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-10 size-44 rounded-full bg-white/10 lg:-top-24 lg:-right-16 lg:size-80"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/3 size-36 rounded-full bg-reward/20 lg:size-60"
        />
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
