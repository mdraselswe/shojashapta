"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/cn";

/** Row divider inside grouped cards; uses --divider (lighter than card borders). */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      // Plain size classes (not data-* variants) so callers can override them, e.g. inset dividers `ml-16 w-auto`.
      className={cn(
        "shrink-0 bg-divider",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
