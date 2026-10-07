import * as React from "react";

import { cn } from "@/lib/cn";

// 56px tall, 16px text (prevents iOS zoom), card fill with a border (docs/design C-Home search box).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-input border border-border bg-card px-4 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
