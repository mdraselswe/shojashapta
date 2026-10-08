import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { AdminButton } from "@/features/admin/components/admin-button";
import { AdminCard, AdminFrame } from "@/features/admin/components/admin-frame";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";
import type { MessageKey } from "@/i18n/t";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("admin.sections.reports"),
  description: getT()("admin.title"),
  path: "/admin/reports",
  noindex: true,
});

export default function AdminReports() {
  return (
    <AdminFrame section="reports">
      {async () => {
        const t = getT();
        const { items } = await getServices().admin.reports();
        if (items.length === 0) return <EmptyState message={t("admin.empty")} />;
        return items.map((report) => {
          const target = {
            entity: report.entity as "place" | "food" | "dish" | "experience",
            entityId: report.entityId,
          };
          return (
            <AdminCard key={report.id}>
              <p className="text-body font-semibold">
                {report.target.href ? (
                  <Link href={report.target.href} className="text-primary-text">
                    {report.target.label}
                  </Link>
                ) : (
                  report.target.label
                )}
              </p>
              <p className="mt-1 text-meta text-muted-foreground">
                {t(`moderation.reasons.${report.reason}` as MessageKey)}
                {report.note ? ` — ${report.note}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminButton
                  variant="destructive"
                  payload={{ kind: "report", id: report.id, decision: "hide", ...target }}
                >
                  {t("admin.hide")}
                </AdminButton>
                <AdminButton
                  payload={{ kind: "report", id: report.id, decision: "dismiss", ...target }}
                >
                  {t("admin.dismiss")}
                </AdminButton>
                <AdminButton
                  confirm={t("admin.banConfirm")}
                  payload={{ kind: "ban", userId: report.userId, banned: true }}
                >
                  {t("admin.banReporter")}
                </AdminButton>
              </div>
            </AdminCard>
          );
        });
      }}
    </AdminFrame>
  );
}
