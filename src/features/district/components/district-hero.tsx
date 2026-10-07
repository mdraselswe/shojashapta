import { SkeletonText } from "@/components/ui/skeleton";
import { getT } from "@/i18n/server";
import type { DistrictHeader } from "@/services/catalog-service";

export function DistrictHero({
  district,
}: {
  district: Pick<DistrictHeader, "nameBn" | "divisionBn">;
}) {
  const t = getT();
  return (
    <section className="page-x pt-1 lg:pt-5">
      <h1 className="text-title-1">{district.nameBn}</h1>
      <p className="mt-1 text-meta text-muted-foreground">
        {t("search.districtMeta", { division: district.divisionBn })}
      </p>
    </section>
  );
}

export function DistrictHeroSkeleton() {
  return (
    <section className="page-x pt-1 lg:pt-5">
      <div className="text-title-1">
        <SkeletonText className="w-1/2" />
      </div>
      <div className="mt-1 text-meta">
        <SkeletonText className="w-1/3" />
      </div>
    </section>
  );
}
