import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

// Grouped list card (docs/06-design-system.md §6): one white card, rows separated by --divider,
// instead of many separate cards.

export function GroupedList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul
      className={cn(
        "divide-y divide-divider overflow-hidden rounded-card border border-border bg-card",
        className,
      )}
    >
      {children}
    </ul>
  );
}

const ROW_CLASS = "flex min-h-17 items-center gap-3 p-3";

function ListRowBody({
  leading,
  title,
  meta,
  trailing,
}: {
  leading: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-card-title">{title}</div>
        <div className="line-clamp-1 text-meta text-muted-foreground">{meta}</div>
      </div>
      {trailing}
    </>
  );
}

/** 44px rounded tile that holds an icon or a letter. */
export function ListTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-thumb bg-muted text-muted-foreground [&_svg]:size-5"
    >
      {children}
    </span>
  );
}

type ListRowProps = {
  href: string;
  leading: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  /** Right side; defaults to a chevron. */
  trailing?: ReactNode;
};

export function ListRow({ href, leading, title, meta, trailing }: ListRowProps) {
  return (
    <li>
      <Link href={href} className={cn(ROW_CLASS, "press hover:bg-muted/50")}>
        <ListRowBody
          leading={leading}
          title={title}
          meta={meta}
          trailing={
            trailing ?? (
              <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            )
          }
        />
      </Link>
    </li>
  );
}

export function ListRowSkeleton({ hasTrailing = true }: { hasTrailing?: boolean }) {
  return (
    <li className={ROW_CLASS}>
      <ListRowBody
        leading={<Skeleton className="size-11 shrink-0 rounded-thumb" />}
        title={<SkeletonText className="w-2/3" />}
        meta={<SkeletonText className="w-1/2" />}
        trailing={hasTrailing ? <Skeleton className="size-5 shrink-0 rounded-full" /> : undefined}
      />
    </li>
  );
}
