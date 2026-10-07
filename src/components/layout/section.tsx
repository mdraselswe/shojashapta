import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  title: ReactNode;
  /** Right of the title, e.g. a "সব দেখুন" link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A titled page section (docs/design: 24px top spacing, 20px page gutter, 21px heading). */
export function Section({ title, action, children, className }: SectionProps) {
  return (
    <section className={cn("px-5 pt-6", className)}>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h2 className="text-heading">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
