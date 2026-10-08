import type { Metadata } from "next";

import { AdminButton } from "@/features/admin/components/admin-button";
import { AdminCard, AdminFrame } from "@/features/admin/components/admin-frame";
import { FameForm } from "@/features/admin/components/admin-forms";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("admin.sections.fame"),
  description: getT()("admin.title"),
  path: "/admin/fame",
  noindex: true,
});

export default function AdminFame() {
  return (
    <AdminFrame section="fame">
      {async () => {
        const t = getT();
        const { repos } = getServices();
        const [districts, fame] = await Promise.all([
          repos.districts.list(),
          repos.districts.allFame(),
        ]);
        const names = new Map(districts.map((district) => [district.id, district.nameBn]));
        return (
          <>
            <p className="text-meta text-muted-foreground">{t("admin.fameHint")}</p>
            <AdminCard>
              <FameForm districts={districts.map(({ id, nameBn }) => ({ id, nameBn }))} />
            </AdminCard>
            <h2 className="mt-3 text-card-title">{t("admin.fameCurrent")}</h2>
            {fame.map((entry) => (
              <AdminCard key={`${entry.districtId}-${entry.food.id}`}>
                <div className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 text-body">
                    <b>{names.get(entry.districtId)}</b> — {entry.food.nameBn}
                    {entry.noteBn ? (
                      <span className="block text-meta text-muted-foreground">{entry.noteBn}</span>
                    ) : null}
                  </span>
                  <AdminButton
                    confirm={t("admin.removeConfirm")}
                    payload={{
                      kind: "fame-remove",
                      districtId: entry.districtId,
                      foodId: entry.food.id,
                    }}
                  >
                    {t("admin.remove")}
                  </AdminButton>
                </div>
              </AdminCard>
            ))}
          </>
        );
      }}
    </AdminFrame>
  );
}
