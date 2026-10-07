"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/cn";

// `chip`: filter and reason chips (40px outline pills; selected = primary-soft).
// `segmented`: options inside a muted track (theme switcher, ✅/⚠️/❌).
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow] duration-(--duration-fast) outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        chip: "h-10 press rounded-full border border-border bg-card px-3.5 text-sm text-foreground hover:bg-muted data-[state=on]:border-primary-soft data-[state=on]:bg-primary-soft data-[state=on]:text-primary-soft-fg",
        segmented:
          "h-full flex-1 rounded-xl px-3 text-[15px] text-muted-foreground data-[state=on]:bg-card data-[state=on]:font-semibold data-[state=on]:text-foreground data-[state=on]:shadow-segment",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

function Toggle({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
