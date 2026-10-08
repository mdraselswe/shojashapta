import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import { routes } from "@/config/routes";
import { AdminCard, AdminFrame } from "@/features/admin/components/admin-frame";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";
import type { MessageKey } from "@/i18n/t";
import { formatNumber } from "@/lib/format/number";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("admin.sections.claims"),
  description: getT()("admin.title"),
  path: "/admin/claims",
  noindex: true,
});

export default function AdminClaims() {
  return (
    <AdminFrame section="claims">
      {async () => {
        const t = getT();
        const { admin, repos } = getServices();
        const claims = await admin.disputedClaims();
        if (claims.length === 0) return <EmptyState message={t("admin.empty")} />;
        const rows = await Promise.all(
          claims.map(async (claim) => {
            const place = claim.entity === "place" ? await repos.places.byId(claim.entityId) : null;
            return { claim, place };
          }),
        );
        return rows.map(({ claim, place }) => (
          <AdminCard key={claim.id}>
            <p className="text-body font-semibold">
              {t(`claim.types.${claim.type}`)}
              <span className="font-normal text-muted-foreground">
                {" · "}
                {t(`admin.claimStatus.${claim.status}` as MessageKey)}
              </span>
            </p>
            <p className="mt-1 text-meta text-muted-foreground">
              {t("admin.claimVotes", {
                correct: formatNumber(claim.counts.correct),
                partial: formatNumber(claim.counts.partial),
                wrong: formatNumber(claim.counts.wrong),
              })}
            </p>
            {place ? (
              <p className="mt-1 text-meta">
                <Link href={routes.place(place.slug)} className="text-primary-text">
                  {place.nameBn}
                </Link>
              </p>
            ) : null}
          </AdminCard>
        ));
      }}
    </AdminFrame>
  );
}
