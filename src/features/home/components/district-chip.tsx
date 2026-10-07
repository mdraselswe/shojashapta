import Link from "next/link";
import type { ReactNode } from "react";

import { SkeletonText } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import type { HomeDistrict } from "@/services/catalog-service";

// Two-line chip (district + what it is known for), as on the approved home screen.
export const DISTRICT_CHIP_CLASS =
  "block shrink-0 snap-start rounded-thumb border border-border bg-card px-3.5 py-2";

function DistrictChipBody({ name, food }: { name: ReactNode; food: ReactNode }) {
  return (
    <>
      <div className="line-clamp-1 text-[15px] leading-snug font-semibold">{name}</div>
      <div className="line-clamp-1 text-caption text-muted-foreground">{food}</div>
    </>
  );
}

export function DistrictChip({ district }: { district: HomeDistrict }) {
  return (
    <Link href={routes.district(district.slug)} className={`${DISTRICT_CHIP_CLASS} press`}>
      <DistrictChipBody name={district.nameBn} food={district.famous?.nameBn ?? " "} />
    </Link>
  );
}

export function DistrictChipSkeleton() {
  return (
    <div className={`${DISTRICT_CHIP_CLASS} w-28`}>
      <DistrictChipBody
        name={<SkeletonText className="text-[15px] leading-snug" />}
        food={<SkeletonText className="w-2/3 text-caption" />}
      />
    </div>
  );
}
