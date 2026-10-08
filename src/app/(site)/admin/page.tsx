import type { Metadata } from "next";
import Link from "next/link";

import { AdminCard, AdminFrame } from "@/features/admin/components/admin-frame";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";
import { formatNumber } from "@/lib/format/number";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("admin.title"),
  description: getT()("admin.title"),
  path: "/admin",
  noindex: true,
});

export default function Admin() {
  return (
    <AdminFrame>
      {async () => {
        const t = getT();
        const counts = await getServices().admin.counts();
        const queues = [
          ["reports", counts.openReports],
          ["edits", counts.openEdits],
          ["claims", counts.disputedClaims],
        ] as const;
        const totals = [
          ["users", counts.users],
          ["places", counts.places],
          ["foods", counts.foods],
          ["dishes", counts.dishes],
          ["experiences", counts.experiences],
          ["media", counts.media],
        ] as const;
        return (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {queues.map(([key, value]) => (
                <Link key={key} href={`/admin/${key}`} className="press">
                  <AdminCard>
                    <span className="block font-display text-[22px] font-bold">
                      {formatNumber(value)}
                    </span>
                    <span className="text-caption text-muted-foreground">
                      {t(`admin.sections.${key}`)}
                    </span>
                  </AdminCard>
                </Link>
              ))}
            </div>
            <h2 className="mt-3 text-card-title">{t("admin.usage")}</h2>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {totals.map(([key, value]) => (
                <AdminCard key={key}>
                  <span className="block font-display text-[22px] font-bold">
                    {formatNumber(value)}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {t(`admin.totals.${key}`)}
                  </span>
                </AdminCard>
              ))}
            </div>
          </>
        );
      }}
    </AdminFrame>
  );
}
