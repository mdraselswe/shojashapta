import { PageShell } from "@/components/layout/page-shell";
import { LoadingRegion, SkeletonText } from "@/components/ui/skeleton";
import { getT } from "@/i18n/server";

// Fallback for any (site) page without its own loading.tsx. Header and bottom nav render for real
// (docs/05 §1.5); pages replace this with their own <XPageSkeleton /> as they are built.
export default function Loading() {
  const t = getT();
  return (
    <PageShell className="px-5 pt-6">
      <LoadingRegion label={t("common.loading")} className="flex flex-col gap-3">
        <SkeletonText className="w-2/3 text-title-1" />
        <SkeletonText className="text-body" lines={3} />
      </LoadingRegion>
    </PageShell>
  );
}
