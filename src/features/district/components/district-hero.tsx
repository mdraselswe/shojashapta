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
    <section className="px-5 pt-1">
      <h1 className="text-title-1">{district.nameBn}</h1>
      <p className="mt-1 text-meta text-muted-foreground">
        {t("search.districtMeta", { division: district.divisionBn })}
      </p>
    </section>
  );
}

export function DistrictHeroSkeleton() {
  return (
    <section className="px-5 pt-1">
      <div className="text-title-1">
        <SkeletonText className="w-1/2" />
      </div>
      <div className="mt-1 text-meta">
        <SkeletonText className="w-1/3" />
      </div>
    </section>
  );
}
