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
  title: getT()("admin.sections.edits"),
  description: getT()("admin.title"),
  path: "/admin/edits",
  noindex: true,
});

export default function AdminEdits() {
  return (
    <AdminFrame section="edits">
      {async () => {
        const t = getT();
        const { items } = await getServices().admin.edits();
        if (items.length === 0) return <EmptyState message={t("admin.empty")} />;
        return items.map((edit) => (
          <AdminCard key={edit.id}>
            <p className="text-body font-semibold">
              {edit.target.href ? (
                <Link href={edit.target.href} className="text-primary-text">
                  {edit.target.label}
                </Link>
              ) : (
                edit.target.label
              )}
              <span className="font-normal text-muted-foreground">
                {" · "}
                {t(`moderation.fields.${edit.field}` as MessageKey)}
              </span>
            </p>
            {edit.currentValue ? (
              <p className="mt-1 text-meta text-muted-foreground line-through">
                {edit.currentValue}
              </p>
            ) : null}
            <p className="mt-1 text-body">{edit.proposedValue}</p>
            {edit.note ? <p className="mt-1 text-meta text-muted-foreground">{edit.note}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminButton
                variant="soft"
                payload={{ kind: "edit", id: edit.id, decision: "approve" }}
              >
                {t("admin.approve")}
              </AdminButton>
              <AdminButton payload={{ kind: "edit", id: edit.id, decision: "reject" }}>
                {t("admin.reject")}
              </AdminButton>
            </div>
          </AdminCard>
        ));
      }}
    </AdminFrame>
  );
}
