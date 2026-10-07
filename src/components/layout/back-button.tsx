import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getT } from "@/i18n/server";
import { cn } from "@/lib/cn";

/** 44px round "go back" link at the start of a page header. Links to a fixed parent, not history. */
export function BackButton({ href, className }: { href: string; className?: string }) {
  const t = getT();
  return (
    <Button asChild variant="outline" size="icon" className={cn("shrink-0", className)}>
      <Link href={href} aria-label={t("common.back")}>
        <ArrowLeftIcon />
      </Link>
    </Button>
  );
}
