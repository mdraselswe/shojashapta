import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";
import { cn } from "@/lib/cn";

/**
 * Looks like the search box and opens the search page (docs/design/C-Home). Phase 2.2 swaps this
 * for the live SearchBox on the home page.
 */
export function SearchEntry({ className }: { className?: string }) {
  const t = getT();
  return (
    <Link
      href={routes.search()}
      className={cn(
        "flex h-14 press items-center gap-2.5 rounded-input border border-border bg-card px-4 text-base text-muted-foreground",
        className,
      )}
    >
      <SearchIcon className="size-[22px] shrink-0" aria-hidden />
      <span className="line-clamp-1">{t("home.searchPlaceholder")}</span>
    </Link>
  );
}
