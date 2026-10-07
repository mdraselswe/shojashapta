import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/cn";

// Pills: each color carries one meaning (docs/06-design-system.md §2). Status badges always pair
// color with an icon and text.
const badgeVariants = cva(
  "inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1 rounded-[10px] px-2.5 text-caption whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        soft: "bg-primary-soft text-primary-soft-fg",
        muted: "bg-muted text-muted-foreground",
        outline: "border border-border bg-card text-foreground",
        reward: "bg-reward text-reward-foreground",
        "reward-soft": "bg-reward-soft text-reward-soft-fg",
        success: "bg-success-soft text-success-fg",
        warning: "bg-warning-soft text-warning-fg",
        danger: "bg-danger-soft text-danger-fg",
        stale: "bg-stale text-stale-fg",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? "muted"}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
