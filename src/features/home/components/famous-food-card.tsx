import Link from "next/link";
import type { ReactNode } from "react";

import { SkeletonText } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import type { HomeFamous } from "@/services/catalog-service";

// Card in the "famous for" row. Link and skeleton share one class string and one body, so the
// skeleton has exactly the real card's size (docs/05-loading-skeletons.md §3).
export const FAMOUS_CARD_CLASS =
  "block w-40 shrink-0 snap-start rounded-card border border-border bg-card p-3.5";

function FamousFoodCardBody({ title, subtitle }: { title: ReactNode; subtitle: ReactNode }) {
  return (
    <>
      <div className="line-clamp-1 text-card-title">{title}</div>
      <div className="line-clamp-1 text-meta text-muted-foreground">{subtitle}</div>
    </>
  );
}

export function FamousFoodCard({ item }: { item: HomeFamous }) {
  return (
    <Link
      href={routes.districtFood(item.district.slug, item.food.slug)}
      className={`${FAMOUS_CARD_CLASS} press`}
    >
      <FamousFoodCardBody title={item.food.nameBn} subtitle={item.district.nameBn} />
    </Link>
  );
}

export function FamousFoodCardSkeleton() {
  return (
    <div className={FAMOUS_CARD_CLASS}>
      <FamousFoodCardBody
        title={<SkeletonText className="w-3/4" />}
        subtitle={<SkeletonText className="w-1/2" />}
      />
    </div>
  );
}
