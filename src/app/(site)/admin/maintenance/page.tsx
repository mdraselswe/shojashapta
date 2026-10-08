import type { Metadata } from "next";

import { AdminButton } from "@/features/admin/components/admin-button";
import { AdminCard, AdminFrame } from "@/features/admin/components/admin-frame";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";
import { formatNumber } from "@/lib/format/number";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("admin.sections.maintenance"),
  description: getT()("admin.title"),
  path: "/admin/maintenance",
  noindex: true,
});

export default function AdminMaintenance() {
  return (
    <AdminFrame section="maintenance">
      {async () => {
        const t = getT();
        const orphans = await getServices().admin.orphanMedia();
        return (
          <>
            <AdminCard>
              <p className="text-body font-semibold">{t("admin.purgeTitle")}</p>
              <p className="mt-1 text-meta text-muted-foreground">{t("admin.purgeHint")}</p>
              <div className="mt-3">
                <AdminButton payload={{ kind: "purge-rate-events" }}>{t("admin.run")}</AdminButton>
              </div>
            </AdminCard>
            <AdminCard>
              <p className="text-body font-semibold">
                {t("admin.orphanTitle", { count: formatNumber(orphans.length) })}
              </p>
              <p className="mt-1 text-meta text-muted-foreground">{t("admin.orphanHint")}</p>
              <div className="mt-3">
                <AdminButton confirm={t("admin.orphanConfirm")} payload={{ kind: "clean-media" }}>
                  {t("admin.run")}
                </AdminButton>
              </div>
            </AdminCard>
          </>
        );
      }}
    </AdminFrame>
  );
}
